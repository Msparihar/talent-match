export function SessionCardSkeleton() {
  return (
    <div className="w-full p-3 rounded-lg glass-strong border border-border/50">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0 space-y-2">
          {/* Icon + Title */}
          <div className="flex items-center gap-2">
            <div className="skeleton w-4 h-4 rounded" />
            <div className="skeleton skeleton-text flex-1 max-w-[70%]" />
          </div>

          {/* Badge + Message count */}
          <div className="flex items-center gap-2">
            <div className="skeleton skeleton-text-sm w-12" />
            <div className="skeleton skeleton-text-sm w-8" />
          </div>
        </div>
      </div>

      {/* Timestamp */}
      <div className="mt-2">
        <div className="skeleton skeleton-text-sm w-24" />
      </div>
    </div>
  );
}

export function SessionCardSkeletonGroup({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <SessionCardSkeleton key={i} />
      ))}
    </div>
  );
}
