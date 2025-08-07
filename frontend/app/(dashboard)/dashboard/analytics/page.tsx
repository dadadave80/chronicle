const Analytics = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-lg font-medium">Total Products</h3>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-lg font-medium">Total Shipments</h3>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-lg font-medium">Total Value</h3>
          <p className="mt-2 text-3xl font-bold">$0.00</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;