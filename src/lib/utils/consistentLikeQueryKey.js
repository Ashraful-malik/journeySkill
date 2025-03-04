export const generateLikeQueryKey = (postIds, userId) => {
  const stablePostIds = JSON.stringify(
    [...new Set(postIds?.map((id) => id.toString()))].sort()
  );
  return ["likes", stablePostIds, userId];
};
