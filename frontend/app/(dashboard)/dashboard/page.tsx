"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  MdOutlineInventory,
  MdOutlineLocalShipping,
  MdOutlineVerified,
  MdTrendingUp,
  MdTrendingDown,
  MdRefresh,
  MdAdd,
  MdQrCodeScanner,
  MdAutorenew,
  MdTimeline,
} from "react-icons/md";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
);

interface Transaction {
  productId: string;
  status: "Pending" | "In Transit" | "Delivered";
  date: string;
  role: "Supplier" | "Transporter" | "Retailer";
  amount?: number;
}

const recentTransactions: Transaction[] = [
  {
    productId: "PROD-001",
    status: "Delivered",
    date: "2024-12-28",
    role: "Retailer",
    amount: 1250,
  },
  {
    productId: "PROD-002",
    status: "In Transit",
    date: "2024-12-27",
    role: "Transporter",
    amount: 890,
  },
  {
    productId: "PROD-003",
    status: "Pending",
    date: "2024-12-26",
    role: "Supplier",
    amount: 2100,
  },
  {
    productId: "PROD-004",
    status: "Delivered",
    date: "2024-12-25",
    role: "Retailer",
    amount: 750,
  },
  {
    productId: "PROD-005",
    status: "In Transit",
    date: "2024-12-24",
    role: "Transporter",
    amount: 1680,
  },
  {
    productId: "PROD-006",
    status: "Pending",
    date: "2024-12-23",
    role: "Supplier",
    amount: 3200,
  },
];

const barChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Products Registered",
      data: [50, 70, 90, 60, 80, 100],
      backgroundColor: "oklch(37.3% 0.034 259.733)",
      borderColor: "oklch(27.8% 0.033 256.848)",
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    },
  ],
};

const lineChartData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    {
      label: "Pending",
      data: [10, 15, 20, 10],
      borderColor: "oklch(55.1% 0.027 264.364)",
      backgroundColor: "oklch(44.2% 0.017 285.786)",
      fill: true,
      tension: 0.4,
      pointRadius: 6,
      pointHoverRadius: 8,
    },
    {
      label: "In Transit",
      data: [20, 25, 30, 35],
      borderColor: "oklch(70.4% 0.04 256.788)",
      backgroundColor: "oklch(70.4% 0.04 256.788)",
      fill: true,
      tension: 0.4,
      pointRadius: 6,
      pointHoverRadius: 8,
    },
    {
      label: "Delivered",
      data: [30, 40, 50, 60],
      borderColor: "oklch(55.3% 0.013 58.071)",
      backgroundColor: "oklch(55.3% 0.013 58.071)",
      fill: true,
      tension: 0.4,
      pointRadius: 6,
      pointHoverRadius: 8,
    },
  ],
};

const doughnutChartData = {
  labels: ["Supplier", "Transporter", "Retailer"],
  datasets: [
    {
      label: "Role Distribution",
      data: [40, 35, 25],
      backgroundColor: [
        "oklch(21% 0.034 264.665)",
        "oklch(55.1% 0.027 264.364)",
        "oklch(37.3% 0.034 259.733)",
      ],
      borderColor: [
        "oklch(21% 0.034 264.665)",
        "oklch(55.1% 0.027 264.364)",
        "oklch(37.3% 0.034 259.733)",
      ],
      borderWidth: 3,
      cutout: "60%",
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
  },
};

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        usePointStyle: true,
        padding: 20,
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
  },
  interaction: {
    intersect: false,
    mode: "index" as const,
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        usePointStyle: true,
        padding: 20,
      },
    },
  },
};

const StatCard = ({
  icon: Icon,
  title,
  value,
  change,
  changeType,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  change?: string;
  changeType?: "up" | "down";
}) => (
  <div className="bg-white border border-gray-200 cursor-pointer rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600 font-nunitoSans">
            {title}
          </h3>
          <p className="text-2xl font-bold text-gray-900 font-ibm mt-1">
            {value}
          </p>
        </div>
      </div>
      {change && (
        <div
          className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${
            changeType === "up"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {changeType === "up" ? (
            <MdTrendingUp className="w-4 h-4" />
          ) : (
            <MdTrendingDown className="w-4 h-4" />
          )}
          <span>{change}</span>
        </div>
      )}
    </div>
  </div>
);

const ChartCard = ({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
  >
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900 font-ibm">{title}</h3>
      <button className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200">
        <MdRefresh className="w-4 h-4 text-gray-500" />
      </button>
    </div>
    <div className="h-64">{children}</div>
  </div>
);

const getStatusBadge = (status: string) => {
  const baseClasses =
    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium";

  switch (status) {
    case "Delivered":
      return `${baseClasses} bg-green-100 text-green-800`;
    case "In Transit":
      return `${baseClasses} bg-blue-100 text-blue-800`;
    case "Pending":
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

const QuickActionButton = ({
  icon: Icon,
  label,
  onClick,
  variant = "primary",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
      variant === "primary"
        ? "bg-gray-900 text-gray-200 shadow-sm"
        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
    }`}
  >
    <Icon className="w-4 h-4" />
    <span className="text-sm font-nunitoSans">{label}</span>
  </button>
);

export default function UserDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [realTimeStats, setRealTimeStats] = useState({
    totalProducts: 1247,
    activeShipments: 368,
    verifiedTransactions: 5234,
  });

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeStats((prev) => ({
        totalProducts: prev.totalProducts + Math.floor(Math.random() * 5),
        activeShipments:
          prev.activeShipments + Math.floor(Math.random() * 3) - 1,
        verifiedTransactions:
          prev.verifiedTransactions + Math.floor(Math.random() * 10),
      }));
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    setLastUpdate(new Date());
  }, []);

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`);
    if (action === "add-product") {
      router.push("/dashboard/products");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
        <div className="text-gray-600 font-ibm font-medium">
          Loading Chronify Dashboard...
        </div>
        <div className="text-sm text-gray-500 font-nunitoSans mt-2">
          Fetching real-time supply chain data
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="md:text-3xl text-2xl font-bold text-gray-900 font-ibm">
                Chronify Dashboard
              </h1>
              <p className="mt-2 text-gray-600 font-nunitoSans">
                Supply chain transparency and tracking analytics
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 space-y-3 sm:space-y-0 mt-4 sm:mt-0">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </span>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center space-x-1 text-sm cursor-pointer text-gray-800 hover:text-gray-900 disabled:opacity-50"
                >
                  <MdAutorenew
                    className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                </button>
              </div>
              <div className="flex space-x-2">
                <QuickActionButton
                  icon={MdAdd}
                  label="Add Product"
                  onClick={() => handleQuickAction("add-product")}
                />
                <QuickActionButton
                  icon={MdQrCodeScanner}
                  label="Scan QR"
                  onClick={() => handleQuickAction("scan-qr")}
                  variant="secondary"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="transform transition-all duration-300 hover:scale-105">
            <StatCard
              icon={MdOutlineInventory}
              title="Total Products"
              value={realTimeStats.totalProducts.toLocaleString()}
              change="+12%"
              changeType="up"
            />
          </div>
          <div className="transform transition-all duration-300 hover:scale-105">
            <StatCard
              icon={MdOutlineLocalShipping}
              title="Active Shipments"
              value={realTimeStats.activeShipments.toString()}
              change="+5%"
              changeType="up"
            />
          </div>
          <div className="transform transition-all duration-300 hover:scale-105">
            <StatCard
              icon={MdOutlineVerified}
              title="Verified Transactions"
              value={realTimeStats.verifiedTransactions.toLocaleString()}
              change="-2%"
              changeType="down"
            />
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <div className="transform transition-all duration-500 hover:shadow-lg">
            <ChartCard title="Product Registration Trends">
              <Bar data={barChartData} options={chartOptions} />
            </ChartCard>
          </div>

          <div className="transform transition-all duration-500 hover:shadow-lg">
            <ChartCard title="Shipment Status Overview">
              <Line data={lineChartData} options={lineChartOptions} />
            </ChartCard>
          </div>

          <div className="transform transition-all duration-500 hover:shadow-lg lg:col-span-2 xl:col-span-1">
            <ChartCard title="Role Distribution">
              <Doughnut data={doughnutChartData} options={doughnutOptions} />
            </ChartCard>
          </div>
        </div>

        {/* Activity Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            {/* Recent Activity Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 font-ibm">
                    Recent Transactions
                  </h3>
                  <button className="text-sm cursor-pointer text-gray-600 hover:text-gray-800 font-medium">
                    View all
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-marcellus">
                        Product ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-marcellus">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-marcellus">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-marcellus">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-marcellus">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentTransactions.map((tx, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 font-nunitoSans">
                            {tx.productId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(tx.status)}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-nunitoSans">
                          {tx.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-nunitoSans">
                          {tx.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-nunitoSans">
                          ${tx.amount?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
            {/* System Health */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 font-ibm">
                  System Health
                </h3>
                <MdTimeline className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Network Status</span>
                  <span className="flex items-center text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Sync</span>
                  <span className="text-sm text-gray-500">
                    {Math.floor((Date.now() - lastUpdate.getTime()) / 60000)}{" "}
                    min ago
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Data Integrity</span>
                  <span className="text-sm text-green-600">100%</span>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r to-green-500 via-amber-500 from-red-500 h-2 rounded-full animate-pulse"
                      style={{ width: "98%" }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    System Performance: Excellent
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 font-ibm mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleQuickAction("generate-report")}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-300 cursor-pointer transition-all duration-300 group"
                >
                  <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-700">
                    📊 Generate Report
                  </div>
                  <div className="text-xs text-gray-500 group-hover:text-indigo-600">
                    Create supply chain analytics report
                  </div>
                </button>
                <button
                  onClick={() => handleQuickAction("bulk-import")}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:border-green-300 cursor-pointer transition-all duration-300 group"
                >
                  <div className="text-sm font-medium text-gray-900 group-hover:text-green-700">
                    📦 Bulk Import
                  </div>
                  <div className="text-xs text-gray-500 group-hover:text-green-600">
                    Import multiple products at once
                  </div>
                </button>
                <button
                  onClick={() => handleQuickAction("export-data")}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 cursor-pointer transition-all duration-300 group"
                >
                  <div className="text-sm font-medium text-gray-900 group-hover:text-purple-700">
                    💾 Export Data
                  </div>
                  <div className="text-xs text-gray-500 group-hover:text-purple-600">
                    Download transaction history
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
