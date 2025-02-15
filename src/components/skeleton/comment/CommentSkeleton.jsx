// components/CommentSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function CommentSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="flex space-x-3 p-3 border-b border-gray-700"
        >
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2 w-full">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
