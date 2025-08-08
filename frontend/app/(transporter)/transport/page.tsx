"use client";

import {
  MdLocalShipping,
  MdLocationOn,
  MdRoute,
  MdCheckCircle,
  MdWarning,
  MdPhone,
  MdDirections,
  MdCamera,
  MdQrCodeScanner,
  MdRefresh,
  MdSearch,
  MdFilterList,
  MdUpdate,
  MdInventory,
  MdTrendingUp,
  MdAssignment,
  MdNotifications,
  MdClose,
  MdMyLocation,
  MdMap,
  MdFlag,
  MdTimer,
  MdGasMeter,
  MdSettings,
  MdHistory,
  MdStar,
  MdPerson,
} from "react-icons/md";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Delivery {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  supplier: {
    name: string;
    address: string;
    phone: string;
    email: string;
    contactPerson: string;
  };
  retailer: {
    name: string;
    address: string;
    phone: string;
    email: string;
    contactPerson: string;
  };
  status:
    | "Assigned"
    | "En Route to Pickup"
    | "At Pickup Location"
    | "Loading"
    | "Picked Up"
    | "In Transit"
    | "At Delivery Location"
    | "Unloading"
    | "Delivered"
    | "Delayed"
    | "Issue Reported";
  priority: "High" | "Medium" | "Low";
  pickupDate: string;
  deliveryDate: string;
  estimatedDelivery: string;
  trackingNumber: string;
  value: number;
  weight: number;
  specialInstructions?: string;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  distance: {
    toPickup: number;
    toDelivery: number;
    totalDistance: number;
  };
  estimatedTime: {
    toPickup: string;
    toDelivery: string;
  };
  milestones: {
    status: string;
    location: string;
    timestamp: string;
    notes?: string;
    photo?: string;
  }[];
  earnings: number;
  category: string;
}

interface TransporterStats {
  totalDeliveries: number;
  completedToday: number;
  pendingPickups: number;
  inTransit: number;
  todayEarnings: number;
  weeklyEarnings: number;
  rating: number;
  onTimeDeliveries: number;
}

const mockDeliveries: Delivery[] = [
  {
    id: "DEL-001",
    productId: "PROD-001",
    productName: "Premium Coffee Beans",
    quantity: 100,
    supplier: {
      name: "Coffee Masters Co.",
      address: "123 Coffee St, Portland, OR 97201",
      phone: "+1-555-0101",
      email: "shipping@coffeemasters.com",
      contactPerson: "John Smith",
    },
    retailer: {
      name: "Bean & Brew Co.",
      address: "456 Downtown Ave, Seattle, WA 98101",
      phone: "+1-555-0201",
      email: "receiving@beanbrewco.com",
      contactPerson: "Sarah Johnson",
    },
    status: "Assigned",
    priority: "High",
    pickupDate: "2024-12-28",
    deliveryDate: "2024-12-30",
    estimatedDelivery: "2024-12-30T14:00:00Z",
    trackingNumber: "FTL-2024-001",
    value: 2599,
    weight: 50.5,
    specialInstructions:
      "Handle with care - fragile packaging. Requires signature on delivery.",
    currentLocation: {
      lat: 45.5152,
      lng: -122.6784,
      address: "FastTrack Hub, Portland, OR",
    },
    distance: {
      toPickup: 5.2,
      toDelivery: 173.8,
      totalDistance: 179.0,
    },
    estimatedTime: {
      toPickup: "15 mins",
      toDelivery: "3.5 hours",
    },
    milestones: [
      {
        status: "Order Assigned",
        location: "FastTrack Hub, Portland, OR",
        timestamp: "2024-12-27T08:00:00Z",
        notes: "Delivery assigned to driver",
      },
    ],
    earnings: 180.5,
    category: "Food & Beverage",
  },
  {
    id: "DEL-002",
    productId: "PROD-002",
    productName: "Organic Honey",
    quantity: 50,
    supplier: {
      name: "Pure Honey Farms",
      address: "789 Farm Road, Napa, CA 94558",
      phone: "+1-555-0102",
      email: "sales@purehoney.com",
      contactPerson: "Mike Wilson",
    },
    retailer: {
      name: "Natural Foods Market",
      address: "321 Organic Plaza, San Francisco, CA 94102",
      phone: "+1-555-0202",
      email: "orders@naturalfoods.com",
      contactPerson: "Lisa Chen",
    },
    status: "In Transit",
    priority: "Medium",
    pickupDate: "2024-12-26",
    deliveryDate: "2024-12-28",
    estimatedDelivery: "2024-12-28T16:00:00Z",
    trackingNumber: "GMT-2024-002",
    value: 775,
    weight: 25.0,
    currentLocation: {
      lat: 37.7749,
      lng: -122.4194,
      address: "Highway 101, San Rafael, CA",
    },
    distance: {
      toPickup: 0,
      toDelivery: 32.1,
      totalDistance: 89.3,
    },
    estimatedTime: {
      toPickup: "0 mins",
      toDelivery: "45 mins",
    },
    milestones: [
      {
        status: "Order Assigned",
        location: "GreenMove Hub, Sacramento, CA",
        timestamp: "2024-12-25T10:00:00Z",
        notes: "Delivery assigned to driver",
      },
      {
        status: "En Route to Pickup",
        location: "Sacramento, CA",
        timestamp: "2024-12-26T07:00:00Z",
        notes: "Heading to pickup location",
      },
      {
        status: "Picked Up",
        location: "Pure Honey Farms, Napa, CA",
        timestamp: "2024-12-26T11:30:00Z",
        notes: "Product successfully picked up",
        photo: "pickup_photo_url",
      },
      {
        status: "In Transit",
        location: "Highway 101, San Rafael, CA",
        timestamp: "2024-12-28T14:45:00Z",
        notes: "En route to delivery location",
      },
    ],
    earnings: 125.75,
    category: "Food & Beverage",
  },
  {
    id: "DEL-003",
    productId: "PROD-003",
    productName: "Handcraft Pottery Set",
    quantity: 20,
    supplier: {
      name: "Artisan Crafts Ltd.",
      address: "555 Arts District, Denver, CO 80202",
      phone: "+1-555-0103",
      email: "orders@artisancrafts.com",
      contactPerson: "Emma Davis",
    },
    retailer: {
      name: "Artisan Home Store",
      address: "777 Creative Blvd, Boulder, CO 80301",
      phone: "+1-555-0203",
      email: "delivery@artisanhome.com",
      contactPerson: "David Brown",
    },
    status: "Delayed",
    priority: "High",
    pickupDate: "2024-12-25",
    deliveryDate: "2024-12-27",
    estimatedDelivery: "2024-12-27T12:00:00Z",
    trackingNumber: "CC-2024-003",
    value: 1799.8,
    weight: 45.8,
    specialInstructions:
      "Fragile items - use extra padding. Delivery window: 10 AM - 2 PM",
    currentLocation: {
      lat: 39.7392,
      lng: -104.9903,
      address: "Rest Stop, Highway 36, Denver, CO",
    },
    distance: {
      toPickup: 0,
      toDelivery: 25.2,
      totalDistance: 25.2,
    },
    estimatedTime: {
      toPickup: "0 mins",
      toDelivery: "35 mins",
    },
    milestones: [
      {
        status: "Picked Up",
        location: "Artisan Crafts Ltd., Denver, CO",
        timestamp: "2024-12-25T13:00:00Z",
        notes: "Fragile items carefully loaded",
        photo: "fragile_loading_photo",
      },
      {
        status: "Delayed",
        location: "Rest Stop, Highway 36, Denver, CO",
        timestamp: "2024-12-26T20:00:00Z",
        notes:
          "Delayed due to severe weather conditions. Safe location secured.",
      },
    ],
    earnings: 195.0,
    category: "Home & Decor",
  },
  {
    id: "DEL-004",
    productId: "PROD-004",
    productName: "Electronic Components",
    quantity: 200,
    supplier: {
      name: "Tech Supply Co.",
      address: "890 Industrial Blvd, Austin, TX 78701",
      phone: "+1-555-0104",
      email: "logistics@techsupply.com",
      contactPerson: "Robert Lee",
    },
    retailer: {
      name: "Electronics Plus",
      address: "246 Tech Center Dr, Dallas, TX 75201",
      phone: "+1-555-0204",
      email: "warehouse@electronicsplus.com",
      contactPerson: "Michelle Garcia",
    },
    status: "At Pickup Location",
    priority: "Medium",
    pickupDate: "2024-12-28",
    deliveryDate: "2024-12-29",
    estimatedDelivery: "2024-12-29T10:00:00Z",
    trackingNumber: "TME-2024-004",
    value: 4200,
    weight: 75.0,
    currentLocation: {
      lat: 30.2672,
      lng: -97.7431,
      address: "Tech Supply Co., Austin, TX",
    },
    distance: {
      toPickup: 0.1,
      toDelivery: 195.5,
      totalDistance: 195.6,
    },
    estimatedTime: {
      toPickup: "2 mins",
      toDelivery: "3 hours",
    },
    milestones: [
      {
        status: "En Route to Pickup",
        location: "Highway 35, Austin, TX",
        timestamp: "2024-12-28T08:30:00Z",
        notes: "On the way to pickup location",
      },
      {
        status: "At Pickup Location",
        location: "Tech Supply Co., Austin, TX",
        timestamp: "2024-12-28T09:15:00Z",
        notes: "Arrived at pickup location, awaiting loading",
      },
    ],
    earnings: 275.25,
    category: "Electronics",
  },
];

const mockStats: TransporterStats = {
  totalDeliveries: 247,
  completedToday: 3,
  pendingPickups: 2,
  inTransit: 1,
  todayEarnings: 456.5,
  weeklyEarnings: 2840.75,
  rating: 4.8,
  onTimeDeliveries: 96,
};

const StatusBadge = ({ status }: { status: Delivery["status"] }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "At Delivery Location":
      case "Unloading":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "In Transit":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Picked Up":
      case "Loading":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "At Pickup Location":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "En Route to Pickup":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Assigned":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Delayed":
      case "Issue Reported":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "Delivered":
        return <MdCheckCircle className="w-3 h-3 mr-1" />;
      case "At Delivery Location":
      case "At Pickup Location":
        return <MdLocationOn className="w-3 h-3 mr-1" />;
      case "In Transit":
      case "En Route to Pickup":
        return <MdLocalShipping className="w-3 h-3 mr-1" />;
      case "Picked Up":
      case "Loading":
      case "Unloading":
        return <MdInventory className="w-3 h-3 mr-1" />;
      case "Assigned":
        return <MdAssignment className="w-3 h-3 mr-1" />;
      case "Delayed":
      case "Issue Reported":
        return <MdWarning className="w-3 h-3 mr-1" />;
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

const PriorityBadge = ({ priority }: { priority: Delivery["priority"] }) => {
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
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`p-3 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
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
            <MdTrendingUp className="w-4 h-4" />
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const UpdateStatusModal = ({
  delivery,
  onClose,
  onUpdate,
}: {
  delivery: Delivery;
  onClose: () => void;
  onUpdate: (
    status: string,
    location: string,
    notes?: string,
    photo?: string,
  ) => void;
}) => {
  const [selectedStatus, setSelectedStatus] = useState(delivery.status);
  const [location, setLocation] = useState(delivery.currentLocation.address);
  const [notes, setNotes] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  const statusOptions = [
    "Assigned",
    "En Route to Pickup",
    "At Pickup Location",
    "Loading",
    "Picked Up",
    "In Transit",
    "At Delivery Location",
    "Unloading",
    "Delivered",
    "Delayed",
    "Issue Reported",
  ];

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(
            `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`,
          );
          setIsGettingLocation(false);
        },
        () => {
          setIsGettingLocation(false);
          alert(
            "Unable to get location. Please ensure location services are enabled.",
          );
        },
      );
    } else {
      setIsGettingLocation(false);
      alert("Geolocation is not supported by this browser");
    }
  };

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(selectedStatus, location, notes, photoPreview);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-[9999] backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-ibm">
                Update Delivery Status
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {delivery.trackingNumber} - {delivery.productName}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as Delivery["status"])
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Location Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Location *
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter current location"
                required
              />
              <Button
                type="button"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <MdMyLocation className="w-4 h-4" />
                <span>{isGettingLocation ? "..." : "GPS"}</span>
              </Button>
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Photo (Optional)
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoCapture}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <MdCamera className="w-4 h-4" />
                <span>Take Photo</span>
              </label>
              {photoPreview && (
                <div className="relative">
                  <Image
                    src={photoPreview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoPreview("")}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    <MdClose className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Add any additional notes about this update..."
            />
          </div>

          {/* Quick Status Buttons */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Quick Updates:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedStatus("At Pickup Location");
                  setNotes("Arrived at pickup location");
                }}
                className="text-xs"
              >
                📍 At Pickup
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedStatus("Picked Up");
                  setNotes("Package successfully picked up");
                }}
                className="text-xs"
              >
                📦 Picked Up
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedStatus("In Transit");
                  setNotes("En route to delivery location");
                }}
                className="text-xs"
              >
                🚛 In Transit
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedStatus("Delivered");
                  setNotes("Package successfully delivered");
                }}
                className="text-xs"
              >
                ✅ Delivered
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center space-x-2">
              <MdUpdate className="w-4 h-4" />
              <span>Update Status</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeliveryCard = ({
  delivery,
  onUpdateStatus,
  onGetDirections,
}: {
  delivery: Delivery;
  onUpdateStatus: (delivery: Delivery) => void;
  onGetDirections: (address: string) => void;
}) => {
  const isActive = !["Delivered", "Issue Reported"].includes(delivery.status);
  const nextLocation =
    delivery.distance.toPickup > 0
      ? delivery.supplier.address
      : delivery.retailer.address;

  return (
    <div
      className={`bg-white border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
        delivery.priority === "High"
          ? "border-red-200 border-l-4 border-l-red-500"
          : "border-gray-200"
      }`}
    >
      {/* Card Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900 font-nunitoSans">
              {delivery.productName}
            </h3>
            {delivery.priority === "High" && (
              <MdFlag className="w-4 h-4 text-red-500" title="High Priority" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <PriorityBadge priority={delivery.priority} />
            <StatusBadge status={delivery.status} />
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="font-mono">{delivery.trackingNumber}</span>
          <span className="font-semibold text-green-600">
            +${delivery.earnings}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-4">
        {/* Route Progress */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">
              ROUTE PROGRESS
            </span>
            <span className="text-xs text-gray-500">
              {delivery.distance.totalDistance} mi total
            </span>
          </div>

          {/* Route Visualization */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  delivery.distance.toPickup === 0
                    ? "bg-green-500"
                    : "bg-blue-500"
                }`}
              ></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {delivery.supplier.name}
                </p>
                <p className="text-xs text-gray-500">
                  {delivery.supplier.address}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <MdPerson className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-600">
                    {delivery.supplier.contactPerson}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {delivery.distance.toPickup > 0 ? "Pickup" : "✓ Picked up"}
                </p>
                {delivery.distance.toPickup > 0 && (
                  <>
                    <p className="text-xs font-medium">
                      {delivery.distance.toPickup} mi
                    </p>
                    <p className="text-xs text-blue-600">
                      {delivery.estimatedTime.toPickup}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-px h-4 bg-gray-300"></div>
            </div>

            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  delivery.status === "Delivered"
                    ? "bg-green-500"
                    : "bg-orange-500"
                }`}
              ></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {delivery.retailer.name}
                </p>
                <p className="text-xs text-gray-500">
                  {delivery.retailer.address}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <MdPerson className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-600">
                    {delivery.retailer.contactPerson}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {delivery.status === "Delivered" ? "✓ Delivered" : "Delivery"}
                </p>
                <p className="text-xs font-medium">
                  {delivery.distance.toDelivery} mi
                </p>
                <p className="text-xs text-orange-600">
                  {delivery.estimatedTime.toDelivery}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Location */}
        <div className="flex items-center space-x-2 p-3 bg-indigo-50 rounded-lg">
          <MdLocationOn className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-indigo-600 font-medium">
              Current Location
            </p>
            <p className="text-sm text-indigo-900 truncate">
              {delivery.currentLocation.address}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onGetDirections(nextLocation)}
            className="flex items-center space-x-1 text-xs"
          >
            <MdDirections className="w-3 h-3" />
            <span>Navigate</span>
          </Button>
        </div>

        {/* Delivery Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Weight</p>
            <p className="font-medium">{delivery.weight} kg</p>
          </div>
          <div>
            <p className="text-gray-500">Value</p>
            <p className="font-medium">${delivery.value.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Delivery Date</p>
            <p className="font-medium">{delivery.deliveryDate}</p>
          </div>
          <div>
            <p className="text-gray-500">Quantity</p>
            <p className="font-medium">{delivery.quantity} units</p>
          </div>
        </div>

        {/* Special Instructions */}
        {delivery.specialInstructions && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <MdWarning className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-yellow-800 font-medium mb-1">
                  Special Instructions
                </p>
                <p className="text-xs text-yellow-700">
                  {delivery.specialInstructions}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
            <MdPhone className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600">Supplier</span>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
            <MdPhone className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600">Retailer</span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            onClick={() => onUpdateStatus(delivery)}
            className="flex items-center justify-center space-x-1"
            disabled={!isActive}
          >
            <MdUpdate className="w-4 h-4" />
            <span>Update Status</span>
          </Button>
          <div className="grid grid-cols-2 gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(`tel:${delivery.supplier.phone}`)}
              className="flex items-center justify-center p-2"
              title="Call Supplier"
            >
              <MdPhone className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(`tel:${delivery.retailer.phone}`)}
              className="flex items-center justify-center p-2"
              title="Call Retailer"
            >
              <MdPhone className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TransporterDeliveryDashboard() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [stats] = useState<TransporterStats>(mockStats);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("active");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null,
  );
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Filter deliveries
  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((delivery) => {
      const matchesSearch =
        delivery.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.trackingNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        delivery.supplier.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        delivery.retailer.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" &&
          !["Delivered", "Issue Reported"].includes(delivery.status)) ||
        delivery.status === filterStatus;

      const matchesPriority =
        filterPriority === "all" || delivery.priority === filterPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [deliveries, searchTerm, filterStatus, filterPriority]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  }, []);

  const handleUpdateStatus = (
    deliveryId: string,
    status: string,
    location: string,
    notes?: string,
    photo?: string,
  ) => {
    setDeliveries((prev) =>
      prev.map((delivery) =>
        delivery.id === deliveryId
          ? {
              ...delivery,
              status: status as Delivery["status"],
              currentLocation: {
                ...delivery.currentLocation,
                address: location,
              },
              milestones: [
                ...delivery.milestones,
                {
                  status,
                  location,
                  timestamp: new Date().toISOString(),
                  notes,
                  photo,
                },
              ],
            }
          : delivery,
      ),
    );
  };

  const handleOpenUpdateModal = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setShowUpdateModal(true);
  };

  const handleGetDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(
      `https://maps.google.com/maps?daddr=${encodedAddress}`,
      "_blank",
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-ibm">
                Delivery Dashboard
              </h1>
              <p className="mt-2 text-gray-600 font-nunitoSans">
                Manage your pickup and delivery assignments
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {currentTime.toLocaleString()} • Driver Portal
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center cursor-pointer space-x-2"
                size="sm"
              >
                <MdRefresh
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span>{isRefreshing ? "Syncing..." : "Sync"}</span>
              </Button>
              <Button
                className="flex items-center cursor-pointer space-x-2"
                size="sm"
              >
                <MdQrCodeScanner className="w-4 h-4" />
                <span>Scan</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center cursor-pointer space-x-2"
                size="sm"
              >
                <MdSettings className="w-4 h-4" />
                <span>Settings</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={MdAssignment}
            title="Today's Tasks"
            value={`${stats.completedToday}/${stats.totalDeliveries}`}
            subtitle="Completed"
          />
          <StatCard
            icon={MdLocalShipping}
            title="Pending Pickups"
            value={stats.pendingPickups.toString()}
            subtitle="Awaiting pickup"
          />
          <StatCard
            icon={MdRoute}
            title="In Transit"
            value={stats.inTransit.toString()}
            subtitle="On the road"
          />
          <StatCard
            icon={MdTimer}
            title="On-Time Rate"
            value={`${stats.onTimeDeliveries}%`}
            subtitle="This week"
          />
          <StatCard
            icon={MdStar}
            title="Rating"
            value={stats.rating.toFixed(1)}
            subtitle="⭐⭐⭐⭐⭐"
          />
          <StatCard
            icon={MdGasMeter}
            title="Today's Earnings"
            value={`$${stats.todayEarnings}`}
            change="+18%"
            changeType="up"
            subtitle="vs yesterday"
          />
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-gradient-to-r from-gray-500 to-indigo-300 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
              <p className="text-indigo-100 text-sm">
                Manage your deliveries efficiently
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white cursor-pointer hover:bg-white/20 flex items-center space-x-2"
                size="sm"
              >
                <MdMap className="w-4 h-4" />
                <span>Route Planner</span>
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white cursor-pointer hover:bg-white/20 flex items-center space-x-2"
                size="sm"
              >
                <MdCamera className="w-4 h-4" />
                <span>Upload Photo</span>
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white cursor-pointer hover:bg-white/20 flex items-center space-x-2"
                size="sm"
              >
                <MdHistory className="w-4 h-4" />
                <span>History</span>
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white cursor-pointer hover:bg-white/20 flex items-center space-x-2"
                size="sm"
              >
                <MdNotifications className="w-4 h-4" />
                <span>Send Update</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by product, tracking number, or location..."
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
                  <option value="active">Active Deliveries</option>
                  <option value="all">All Status</option>
                  <option value="Assigned">Assigned</option>
                  <option value="En Route to Pickup">En Route to Pickup</option>
                  <option value="At Pickup Location">At Pickup</option>
                  <option value="Picked Up">Picked Up</option>
                  <option value="In Transit">In Transit</option>
                  <option value="At Delivery Location">At Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Delayed">Delayed</option>
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

        {/* Deliveries Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDeliveries.map((delivery) => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              onUpdateStatus={handleOpenUpdateModal}
              onGetDirections={handleGetDirections}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredDeliveries.length === 0 && (
          <div className="text-center py-12">
            <MdLocalShipping className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No deliveries found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm ||
              filterStatus !== "active" ||
              filterPriority !== "all"
                ? "Try adjusting your search and filter criteria to find deliveries."
                : "Your delivery assignments will appear here. Check back later or contact dispatch."}
            </p>
          </div>
        )}

        {/* Update Status Modal */}
        {showUpdateModal && selectedDelivery && (
          <UpdateStatusModal
            delivery={selectedDelivery}
            onClose={() => setShowUpdateModal(false)}
            onUpdate={(status, location, notes, photo) =>
              handleUpdateStatus(
                selectedDelivery.id,
                status,
                location,
                notes,
                photo,
              )
            }
          />
        )}
      </div>
    </div>
  );
}
