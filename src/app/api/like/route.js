import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Challenge } from "@/models/challenge.model";
import { Like } from "@/models/like.model";
import { Post } from "@/models/post.model";
import mongoose from "mongoose";

// create like
export async function POST(req) {
  let session = null;

  try {
    const { batchActions } = await req.json();
    // Validate batch actions
    if (!Array.isArray(batchActions) || batchActions.length === 0) {
      return createErrorResponse({
        status: 400,
        message: "batchActions must be a non-empty array",
      });
    }
    if (
      !batchActions.every((action) => {
        return (
          action.targetType === "Post" || action.targetType === "Challenge"
        );
      })
    ) {
      return createErrorResponse({
        status: 400,
        message: "Invalid targetType",
      });
    }
    if (
      !batchActions.every((action) => {
        return action.operation === "like" || action.operation === "unlike";
      })
    ) {
      return createErrorResponse({
        status: 400,
        message: "Invalid operation",
      });
    }

    await dbConnect();
    session = await mongoose.startSession();
    session.startTransaction();

    // Deduplicate actions by (userId, targetId, targetType)
    const actionMap = new Map();
    batchActions.forEach((action) => {
      const key = `${action.userId}-${action.targetId}-${action.targetType}`;
      actionMap.set(key, action);
    });

    const uniqueActions = Array.from(actionMap.values());

    const targetIdsByType = uniqueActions.reduce((acc, action) => {
      if (!acc[action.targetType]) acc[action.targetType] = [];
      acc[action.targetType].push(new mongoose.Types.ObjectId(action.targetId));
      return acc;
    }, {});
    // Perform batched existence checks
    const validActions = [];

    for (const [type, ids] of Object.entries(targetIdsByType)) {
      const Model = type === "Post" ? Post : Challenge;
      const existingTargets = await Model.find({ _id: { $in: ids } }).session(
        session
      );
      const existingIds = new Set(
        existingTargets.map((doc) => doc._id.toString())
      );

      // Filter valid actions
      validActions.push(
        ...uniqueActions.filter(
          (action) =>
            action.targetType !== type || existingIds.has(action.targetId)
        )
      );
    }

    const likeOperations = [];
    for (const action of validActions) {
      const { targetId, targetType, operation, userId } = action;

      if (operation === "like") {
        likeOperations.push({
          updateOne: {
            filter: {
              userId: new mongoose.Types.ObjectId(userId),
              targetId: new mongoose.Types.ObjectId(targetId),
              targetType,
            },
            update: {
              $set: {
                userId: new mongoose.Types.ObjectId(userId),
                targetId: new mongoose.Types.ObjectId(targetId),
                targetType,
                createdAt: new Date(),
              },
            },
            upsert: true,
          },
        });
      } else {
        likeOperations.push({
          deleteOne: {
            filter: {
              userId: new mongoose.Types.ObjectId(userId),
              targetId: new mongoose.Types.ObjectId(targetId),
              targetType,
            },
          },
        });
      }
    }
    // Execute like operations if any
    if (likeOperations.length > 0) {
      await Like.bulkWrite(likeOperations, { session, ordered: false });
    }
    await session.commitTransaction();

    return createResponse({
      status: 200,
      message: "success",
      data: {
        liked: likeOperations.filter((op) => op.updateOne).length,
        unliked: likeOperations.filter((op) => op.deleteOne).length,
      },
    });
  } catch (error) {
    if (session) await session.abortTransaction();

    return createErrorResponse({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  } finally {
    if (session) session.endSession();
  }
}
