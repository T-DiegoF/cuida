interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`rounded-xl bg-gradient-to-r from-[#E6F4F1] via-[#F0FAF8] to-[#E6F4F1] bg-[length:200%_100%] animate-skeleton ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div
      className="bg-white rounded-2xl p-5 flex flex-col gap-3"
      style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.06)" }}
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex gap-2 mt-1">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonCampaignCard() {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.06)" }}
      aria-hidden="true"
    >
      <Skeleton className="h-40 rounded-none" />
      <div className="p-5 flex flex-col gap-3">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-2.5 w-full rounded-full" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}
