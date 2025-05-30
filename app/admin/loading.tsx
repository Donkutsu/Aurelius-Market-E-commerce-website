// app/admin/loading.tsx

export default function AdminDashboardLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-6 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="
            flex flex-col
            bg-black/40
            border border-white/20
            rounded-2xl
            backdrop-blur
            px-6 py-8
            shadow-md
            transition-all
          "
        >
          <div className="h-6 w-1/2 bg-white/20 rounded mb-2" />
          <div className="h-4 w-1/3 bg-white/10 rounded mb-6" />
          <div className="h-10 w-2/3 bg-white/30 rounded" />
        </div>
      ))}
    </div>
  );
}
