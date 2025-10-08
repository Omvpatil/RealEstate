export default function Loading() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 h-[600px] bg-muted animate-pulse rounded-lg" />
                <div className="lg:col-span-2 h-[600px] bg-muted animate-pulse rounded-lg" />
            </div>
        </div>
    );
}
