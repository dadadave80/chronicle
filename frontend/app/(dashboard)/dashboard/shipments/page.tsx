"use client";

import {
  MdLocalShipping,
  MdInventory,
  MdLocationOn,
  MdSchedule,
  MdCheckCircle,
  MdWarning,
  MdError,
  MdSearch,
  MdFilterList,
  MdRefresh,
  MdVisibility,
  MdGetApp,
  MdNotifications,
  MdTrendingUp,
  MdTrendingDown,
  MdTimeline,
  MdRoute,
  MdPhone,
  MdEmail,
  MdClose,
  MdDirections,
  MdQrCodeScanner,
} from "react-icons/md";
import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface Shipment {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  supplier: string;
  transporter: string;
  retailer: string;
  status:
    | "Pending"
    | "In Transit"
    | "Out for Delivery"
    | "Delivered"
    | "Delayed"
    | "Cancelled";
  priority: "High" | "Medium" | "Low";
  createdDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  currentLocation?: string;
  trackingNumber: string;
  value: number;
  category: string;
  weight: number;
  notes?: string;
  transporterContact: {
    phone: string;
    email: string;
  };
  milestones: {
    status: string;
    location: string;
    timestamp: string;
    description: string;
  }[];
}

const mockShipments: Shipment[] = [
  {
    id: "SHP-001",
    productId: "PROD-001",
    productName: "Premium Coffee Beans",
    quantity: 100,
    supplier: "Coffee Masters Co.",
    transporter: "FastTrack Logistics",
    retailer: "Bean & Brew Co.",
    status: "In Transit",
    priority: "High",
    createdDate: "2024-12-20",
    estimatedDelivery: "2024-12-28",
    currentLocation: "Distribution Center, Chicago",
    trackingNumber: "FTL-2024-001",
    value: 2599.0,
    category: "Food & Beverage",
    weight: 50.5,
    transporterContact: {
      phone: "+1-555-0123",
      email: "support@fasttracklogistics.com",
    },
    milestones: [
      {
        status: "Order Confirmed",
        location: "Coffee Masters Co., Portland",
        timestamp: "2024-12-20T10:00:00Z",
        description: "Order confirmed and processing started",
      },
      {
        status: "Picked Up",
        location: "Coffee Masters Co., Portland",
        timestamp: "2024-12-21T14:30:00Z",
        description: "Package picked up by FastTrack Logistics",
      },
      {
        status: "In Transit",
        location: "Distribution Center, Chicago",
        timestamp: "2024-12-24T09:15:00Z",
        description: "Package arrived at distribution center",
      },
    ],
  },
  {
    id: "SHP-002",
    productName: "Organic Honey",
    productId: "PROD-002",
    quantity: 50,
    supplier: "Pure Honey Farms",
    transporter: "GreenMove Transport",
    retailer: "Natural Foods Market",
    status: "Out for Delivery",
    priority: "Medium",
    createdDate: "2024-12-18",
    estimatedDelivery: "2024-12-27",
    currentLocation: "Local Delivery Hub",
    trackingNumber: "GMT-2024-002",
    value: 775.0,
    category: "Food & Beverage",
    weight: 25.0,
    transporterContact: {
      phone: "+1-555-0456",
      email: "delivery@greenmove.com",
    },
    milestones: [
      {
        status: "Order Confirmed",
        location: "Pure Honey Farms, California",
        timestamp: "2024-12-18T08:00:00Z",
        description: "Order confirmed and ready for pickup",
      },
      {
        status: "In Transit",
        location: "GreenMove Hub, Sacramento",
        timestamp: "2024-12-19T16:20:00Z",
        description: "Package in transit to destination",
      },
      {
        status: "Out for Delivery",
        location: "Local Delivery Hub",
        timestamp: "2024-12-27T06:30:00Z",
        description: "Package out for final delivery",
      },
    ],
  },
  {
    id: "SHP-003",
    productName: "Handcraft Pottery Set",
    productId: "PROD-003",
    quantity: 20,
    supplier: "Artisan Crafts Ltd.",
    transporter: "Careful Cargo",
    retailer: "Artisan Home Store",
    status: "Delayed",
    priority: "High",
    createdDate: "2024-12-15",
    estimatedDelivery: "2024-12-26",
    currentLocation: "Weather Delay - Denver",
    trackingNumber: "CC-2024-003",
    value: 1799.8,
    category: "Home & Decor",
    weight: 45.8,
    notes: "Delayed due to severe weather conditions",
    transporterContact: {
      phone: "+1-555-0789",
      email: "care@carefulcargo.com",
    },
    milestones: [
      {
        status: "Picked Up",
        location: "Artisan Crafts Ltd., Colorado",
        timestamp: "2024-12-16T11:00:00Z",
        description: "Fragile items carefully packaged and picked up",
      },
      {
        status: "Delayed",
        location: "Weather Delay - Denver",
        timestamp: "2024-12-25T14:00:00Z",
        description: "Delivery delayed due to severe weather conditions",
      },
    ],
  },
  {
    id: "SHP-004",
    productName: "Solar Power Bank",
    productId: "PROD-004",
    quantity: 75,
    supplier: "Tech Innovations Inc.",
    transporter: "TechMove Express",
    retailer: "Gadget World",
    status: "Delivered",
    priority: "Low",
    createdDate: "2024-12-10",
    estimatedDelivery: "2024-12-20",
    actualDelivery: "2024-12-19",
    trackingNumber: "TME-2024-004",
    value: 3375.0,
    category: "Electronics",
    weight: 15.0,
    transporterContact: {
      phone: "+1-555-0321",
      email: "track@techmove.com",
    },
    milestones: [
      {
        status: "Order Confirmed",
        location: "Tech Innovations Inc., Austin",
        timestamp: "2024-12-10T09:00:00Z",
        description: "Order confirmed and prepared for shipping",
      },
      {
        status: "In Transit",
        location: "TechMove Hub, Dallas",
        timestamp: "2024-12-12T13:45:00Z",
        description: "Package in transit",
      },
      {
        status: "Delivered",
        location: "Gadget World, Houston",
        timestamp: "2024-12-19T15:30:00Z",
        description: "Package successfully delivered",
      },
    ],
  },
];

const StatusBadge = ({ status }: { status: Shipment["status"] }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Out for Delivery":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "In Transit":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Delayed":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "Delivered":
        return <MdCheckCircle className="w-3 h-3 mr-1" />;
      case "Out for Delivery":
      case "In Transit":
        return <MdLocalShipping className="w-3 h-3 mr-1" />;
      case "Pending":
        return <MdSchedule className="w-3 h-3 mr-1" />;
      case "Delayed":
        return <MdWarning className="w-3 h-3 mr-1" />;
      case "Cancelled":
        return <MdError className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyles()}`}
    >
      {getStatusIcon()}
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }: { priority: Shipment["priority"] }) => {
  const getPriorityStyles = () => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityStyles()}`}
    >
      {priority}
    </span>
  );
};

const StatCard = ({
  icon: Icon,
  title,
  value,
  change,
  changeType,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  change?: string;
  changeType?: "up" | "down";
  subtitle?: string;
}) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
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

const TrackingModal = ({
  shipment,
  onClose,
}: {
  shipment: Shipment;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-[99999] backdrop-blur-sm">
    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-ibm">
              Shipment Tracking
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Track your shipment: {shipment.trackingNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MdClose className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Status Overview */}
        <div className="mb-8 p-6 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {shipment.productName}
              </h3>
              <p className="text-sm text-gray-600">
                Tracking: {shipment.trackingNumber}
              </p>
            </div>
            <StatusBadge status={shipment.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Current Location:</span>
              <p className="font-medium text-gray-900 flex items-center mt-1">
                <MdLocationOn className="w-4 h-4 mr-1 text-gray-800" />
                {shipment.currentLocation || "Unknown"}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Estimated Delivery:</span>
              <p className="font-medium text-gray-900 flex items-center mt-1">
                <MdSchedule className="w-4 h-4 mr-1 text-gray-800" />
                {shipment.estimatedDelivery}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Value:</span>
              <p className="font-medium text-gray-900">
                ${shipment.value.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Timeline */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <MdTimeline className="w-5 h-5 mr-2 text-gray-800" />
              Shipment Timeline
            </h4>
            <div className="space-y-4">
              {shipment.milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-b-0"
                >
                  <div
                    className={`flex-shrink-0 w-3 h-3 rounded-full mt-1 ${
                      index === 0
                        ? "bg-gray-800"
                        : index === shipment.milestones.length - 1
                          ? "bg-green-500"
                          : "bg-gray-300"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-medium text-gray-900">
                        {milestone.status}
                      </h5>
                      <time className="text-xs text-gray-500">
                        {new Date(milestone.timestamp).toLocaleString()}
                      </time>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {milestone.description}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <MdLocationOn className="w-3 h-3 mr-1" />
                      {milestone.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipment Details */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <MdInventory className="w-5 h-5 mr-2 text-gray-800" />
              Shipment Details
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-3">
                  Product Information
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Product ID:</span>
                    <span className="text-gray-900">{shipment.productId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Quantity:</span>
                    <span className="text-gray-900">
                      {shipment.quantity} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Weight:</span>
                    <span className="text-gray-900">{shipment.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category:</span>
                    <span className="text-gray-900">{shipment.category}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-3">
                  Transporter Contact
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <MdPhone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">
                      {shipment.transporterContact.phone}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MdEmail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">
                      {shipment.transporterContact.email}
                    </span>
                  </div>
                </div>
              </div>

              {shipment.notes && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                    <MdNotifications className="w-4 h-4 mr-2 text-yellow-600" />
                    Notes
                  </h5>
                  <p className="text-sm text-gray-700">{shipment.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-3 justify-end">
          <Button variant="outline" className="flex items-center space-x-2">
            <MdDirections className="w-4 h-4" />
            <span>Get Directions</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <MdGetApp className="w-4 h-4" />
            <span>Download Receipt</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <MdPhone className="w-4 h-4" />
            <span>Contact Transporter</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default function ShipmentsPage() {
  const [shipments] = useState<Shipment[]>(mockShipments);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null,
  );
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = shipments.length;
    const inTransit = shipments.filter(
      (s) => s.status === "In Transit" || s.status === "Out for Delivery",
    ).length;
    const delivered = shipments.filter((s) => s.status === "Delivered").length;
    const delayed = shipments.filter((s) => s.status === "Delayed").length;
    const totalValue = shipments.reduce((sum, s) => sum + s.value, 0);

    return {
      total,
      inTransit,
      delivered,
      delayed,
      totalValue,
    };
  }, [shipments]);

  // Filter shipments
  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const matchesSearch =
        shipment.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.trackingNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        shipment.supplier.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || shipment.status === filterStatus;

      const matchesPriority =
        filterPriority === "all" || shipment.priority === filterPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [shipments, searchTerm, filterStatus, filterPriority]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  }, []);

  const handleViewTracking = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setShowTrackingModal(true);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-ibm">
                My Shipments
              </h1>
              <p className="mt-2 text-gray-600 font-nunitoSans">
                Track and manage your incoming shipments
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2"
              >
                <MdRefresh
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
              </Button>
              <Button className="flex items-center space-x-2">
                <MdQrCodeScanner className="w-4 h-4" />
                <span>Scan QR</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={MdInventory}
            title="Total Shipments"
            value={stats.total.toString()}
            subtitle="All shipments"
          />
          <StatCard
            icon={MdLocalShipping}
            title="In Transit"
            value={stats.inTransit.toString()}
            change="+3"
            changeType="up"
            subtitle="Currently moving"
          />
          <StatCard
            icon={MdCheckCircle}
            title="Delivered"
            value={stats.delivered.toString()}
            change="+8%"
            changeType="up"
            subtitle="Successfully received"
          />
          <StatCard
            icon={MdWarning}
            title="Delayed"
            value={stats.delayed.toString()}
            change="-2"
            changeType="down"
            subtitle="Need attention"
          />
        </div>

        {/* Search and Filter */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="lg:col-span-1">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by product, tracking number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <div className="flex items-center space-x-2">
                <MdFilterList className="text-gray-400 w-5 h-5" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              >
                <option value="all">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 font-ibm">
                Shipments ({filteredShipments.length})
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Total Value: ${stats.totalValue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product & Tracking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier & Transporter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status & Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value & Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredShipments.map((shipment) => (
                  <tr
                    key={shipment.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {shipment.productName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {shipment.productId}
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          Track: {shipment.trackingNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          {shipment.supplier}
                        </div>
                        <div className="text-sm text-gray-500">
                          via {shipment.transporter}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <StatusBadge status={shipment.status} />
                        <PriorityBadge priority={shipment.priority} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          {shipment.estimatedDelivery}
                        </div>
                        {shipment.currentLocation && (
                          <div className="text-xs text-gray-500 flex items-center">
                            <MdLocationOn className="w-3 h-3 mr-1" />
                            {shipment.currentLocation}
                          </div>
                        )}
                        {shipment.actualDelivery && (
                          <div className="text-xs text-green-600">
                            Delivered: {shipment.actualDelivery}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          ${shipment.value.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {shipment.quantity} units
                        </div>
                        <div className="text-xs text-gray-400">
                          {shipment.weight} kg
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewTracking(shipment)}
                          className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                          title="Track Shipment"
                        >
                          <MdVisibility className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Download Receipt"
                        >
                          <MdGetApp className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Get Directions"
                        >
                          <MdRoute className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredShipments.length === 0 && (
            <div className="text-center py-12">
              <MdLocalShipping className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No shipments found
              </h3>
              <p className="text-gray-500">
                {searchTerm ||
                filterStatus !== "all" ||
                filterPriority !== "all"
                  ? "Try adjusting your search and filter criteria"
                  : "Your incoming shipments will appear here"}
              </p>
            </div>
          )}
        </div>

        {/* Tracking Modal */}
        {showTrackingModal && selectedShipment && (
          <TrackingModal
            shipment={selectedShipment}
            onClose={() => setShowTrackingModal(false)}
          />
        )}
      </div>
    </div>
  );
}
