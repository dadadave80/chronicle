"use client";

import {
  MdAdd,
  MdSearch,
  MdFilterList,
  MdVisibility,
  MdEdit,
  MdDelete,
  MdLocalShipping,
  MdInventory,
  MdClose,
  MdCheck,
  MdWarning,
  MdTrendingUp,
  MdTrendingDown,
  MdDownload,
  MdUpload,
  MdRefresh,
  MdTimeline,
  MdCalendarToday,
  MdAttachMoney,
  MdCategory,
  MdDescription,
  MdStore,
  MdLocalShipping as MdTransport,
  MdBarChart,
} from "react-icons/md";
import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useAddProduct from "@/hooks/useAddProduct";

// Zod validation schema
const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name cannot exceed 100 characters"),
  category: z.string().min(1, "Category is required"),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a valid number",
    })
    .positive("Price must be greater than 0")
    .max(999999, "Price cannot exceed $999,999"),
  quantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a valid number",
    })
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0")
    .max(100000, "Quantity cannot exceed 100,000"),
  transporter: z.string().min(1, "Transporter is required"),
  retailer: z.string().min(1, "Retailer is required"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  transporter: string;
  retailer: string;
  status: "Draft" | "Pending" | "In Transit" | "Delivered" | "Cancelled";
  createdDate: string;
  estimatedDelivery?: string;
  category: string;
  description?: string;
  totalValue: number;
  trackingNumber?: string;
  lastUpdated: string;
}

const mockProducts: Product[] = [
  {
    id: "PROD-001",
    name: "Premium Coffee Beans",
    price: 25.99,
    quantity: 100,
    transporter: "FastTrack Logistics",
    retailer: "Bean & Brew Co.",
    status: "Delivered",
    createdDate: "2024-12-20",
    estimatedDelivery: "2024-12-25",
    category: "Food & Beverage",
    description: "High-quality arabica coffee beans from Colombia",
    totalValue: 2599,
    trackingNumber: "FTL-2024-001",
    lastUpdated: "2024-12-25T10:30:00Z",
  },
  {
    id: "PROD-002",
    name: "Organic Honey",
    price: 15.5,
    quantity: 50,
    transporter: "GreenMove Transport",
    retailer: "Natural Foods Market",
    status: "In Transit",
    createdDate: "2024-12-18",
    estimatedDelivery: "2024-12-28",
    category: "Food & Beverage",
    description: "Pure organic honey from local beekeepers",
    totalValue: 775,
    trackingNumber: "GMT-2024-002",
    lastUpdated: "2024-12-27T14:15:00Z",
  },
  {
    id: "PROD-003",
    name: "Handcraft Pottery Set",
    price: 89.99,
    quantity: 20,
    transporter: "Careful Cargo",
    retailer: "Artisan Home Store",
    status: "Pending",
    createdDate: "2024-12-15",
    estimatedDelivery: "2024-12-30",
    category: "Home & Decor",
    description: "Beautiful handmade ceramic pottery set",
    totalValue: 1799.8,
    lastUpdated: "2024-12-15T09:45:00Z",
  },
  {
    id: "PROD-004",
    name: "Solar Power Bank",
    price: 45.0,
    quantity: 75,
    transporter: "TechMove Express",
    retailer: "Gadget World",
    status: "Draft",
    createdDate: "2024-12-22",
    category: "Electronics",
    description: "Portable solar-powered charging device",
    totalValue: 3375,
    lastUpdated: "2024-12-22T16:20:00Z",
  },
  {
    id: "PROD-005",
    name: "Bamboo Water Bottles",
    price: 18.99,
    quantity: 200,
    transporter: "EcoFriendly Transport",
    retailer: "Green Living Store",
    status: "In Transit",
    createdDate: "2024-12-19",
    estimatedDelivery: "2024-12-29",
    category: "Health & Beauty",
    description: "Sustainable bamboo fiber water bottles",
    totalValue: 3798,
    trackingNumber: "EFT-2024-003",
    lastUpdated: "2024-12-26T11:00:00Z",
  },
];

const categories = [
  "Food & Beverage",
  "Electronics",
  "Home & Decor",
  "Fashion & Apparel",
  "Health & Beauty",
  "Sports & Outdoors",
  "Books & Media",
  "Office Supplies",
  "Automotive",
  "Others",
];

const transporters = [
  "FastTrack Logistics",
  "GreenMove Transport",
  "Careful Cargo",
  "TechMove Express",
  "Swift Delivery Co.",
  "EcoFriendly Transport",
  "Reliable Freight",
  "Express Courier",
];

const retailers = [
  "Bean & Brew Co.",
  "Natural Foods Market",
  "Artisan Home Store",
  "Gadget World",
  "Fashion Forward",
  "Health Plus Store",
  "Sports Central",
  "BookWorm Corner",
  "Office Essentials",
  "Auto Parts Pro",
];

const StatusBadge = ({ status }: { status: Product["status"] }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Transit":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "Delivered":
        return <MdCheck className="w-3 h-3 mr-1" />;
      case "In Transit":
        return <MdLocalShipping className="w-3 h-3 mr-1" />;
      case "Pending":
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
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex items-center justify-between">
      <div className="flex flex-row lg:flex-col items-start space-x-4 lg:space-x-0 lg:space-y-4">
        <div className="p-3 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-ibm font-medium text-gray-600">
            {title}
          </h3>
          <p className="text-2xl font-nunitoSans font-bold text-gray-900 mt-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs font-nunitoSans text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {change && (
        <div
          className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${changeType === "up"
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

const ActionButton = ({
  icon: Icon,
  label,
  onClick,
  variant = "primary",
  size = "default",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "default" | "sm";
}) => {
  const getButtonStyles = () => {
    const baseStyles =
      "flex items-center space-x-2 rounded-lg transition-all cursor-pointer font-nunitoSans duration-200 font-medium";
    const sizeStyles = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2";

    switch (variant) {
      case "primary":
        return `${baseStyles} ${sizeStyles} bg-gray-800 text-white hover:bg-gray-900 shadow-sm`;
      case "secondary":
        return `${baseStyles} ${sizeStyles} bg-gray-600 text-white hover:bg-gray-700 shadow-sm`;
      case "outline":
        return `${baseStyles} ${sizeStyles} bg-white text-gray-700 border border-gray-300 hover:bg-gray-50`;
      default:
        return `${baseStyles} ${sizeStyles} bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm`;
    }
  };

  return (
    <button onClick={onClick} className={getButtonStyles()}>
      <Icon className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} />
      <span>{label}</span>
    </button>
  );
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "name" | "price" | "status">(
    "date",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [transporterFees, setTransporterFees] = useState<number>(1);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      quantity: 1,
      transporter: "",
      retailer: "",
      description: "",
    },
  });

  // Watch form values for real-time calculations
  const watchedPrice = watch("price");
  const watchedQuantity = watch("quantity");
  const totalValue = (watchedPrice || 0) * (watchedQuantity || 0);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = products.length;
    const pending = products.filter((p) => p.status === "Pending").length;
    const inTransit = products.filter((p) => p.status === "In Transit").length;
    const delivered = products.filter((p) => p.status === "Delivered").length;
    const draft = products.filter((p) => p.status === "Draft").length;
    const totalValue = products.reduce((sum, p) => sum + p.totalValue, 0);

    return {
      total,
      pending,
      inTransit,
      delivered,
      draft,
      totalValue,
    };
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || product.status === filterStatus;

      const matchesCategory =
        filterCategory === "all" || product.category === filterCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "date":
        default:
          comparison =
            new Date(a.createdDate).getTime() -
            new Date(b.createdDate).getTime();
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [products, searchTerm, filterStatus, filterCategory, sortBy, sortOrder]);


  const { addProduct } = useAddProduct();

  const onSubmit = async (data: ProductFormData) => {
    try {
      // Simulate API call
      await addProduct(data.name, data.category, data.price, transporterFees, data.quantity);

      const newProduct: Product = {
        id: `PROD-${String(products.length + 1).padStart(3, "0")}`,
        name: data.name,
        price: data.price,
        quantity: data.quantity,
        transporter: data.transporter,
        retailer: data.retailer,
        status: "Draft",
        createdDate: new Date().toISOString().split("T")[0],
        category: data.category,
        description: data.description,
        totalValue: data.price * data.quantity,
        lastUpdated: new Date().toISOString(),
      };

      setProducts((prev) => [newProduct, ...prev]);
      reset();
      setShowAddForm(false);

      // Show success notification (you can implement toast here)
      console.log("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  }, []);

  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting products...");
  };

  const handleBulkImport = () => {
    // Implement bulk import functionality
    console.log("Opening bulk import...");
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="md:text-3xl text-2xl font-bold text-gray-900 font-ibm">
                Products Management
              </h1>
              <p className="mt-2 text-gray-600 font-nunitoSans">
                Manage your supply chain products and track deliveries
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
              <ActionButton
                icon={MdRefresh}
                label={isRefreshing ? "Refreshing..." : "Refresh"}
                onClick={handleRefresh}
                variant="outline"
                size="sm"
              />
              <ActionButton
                icon={MdUpload}
                label="Bulk Import"
                onClick={handleBulkImport}
                variant="secondary"
                size="sm"
              />
              <ActionButton
                icon={MdDownload}
                label="Export"
                onClick={handleExport}
                variant="outline"
                size="sm"
              />
              <ActionButton
                icon={MdAdd}
                label="Add Product"
                onClick={() => setShowAddForm(true)}
                variant="primary"
              />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon={MdInventory}
            title="Total Products"
            value={stats.total.toString()}
            change="+12%"
            changeType="up"
            subtitle="All time"
          />
          <StatCard
            icon={MdWarning}
            title="Pending"
            value={stats.pending.toString()}
            subtitle="Awaiting action"
          />
          <StatCard
            icon={MdLocalShipping}
            title="In Transit"
            value={stats.inTransit.toString()}
            subtitle="On the way"
          />
          <StatCard
            icon={MdCheck}
            title="Delivered"
            value={stats.delivered.toString()}
            change="+8%"
            changeType="up"
            subtitle="Successfully delivered"
          />
          <StatCard
            icon={MdAttachMoney}
            title="Total Value"
            value={`$${stats.totalValue.toLocaleString()}`}
            change="+15%"
            changeType="up"
            subtitle="Portfolio value"
          />
        </div>

        {/* Search, Filter, and Sort */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products by name, ID, or category..."
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
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <div className="flex items-center space-x-2">
                <MdCategory className="text-gray-400 w-5 h-5" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Sort by:</span>
              <div className="flex space-x-2">
                {["date", "name", "price", "status"].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      if (sortBy === option) {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy(option as typeof sortBy);
                        setSortOrder("asc");
                      }
                    }}
                    className={`px-3 py-1 rounded-md cursor-pointer text-sm font-medium transition-colors ${sortBy === option
                      ? "bg-gray-800 text-gray-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                    {sortBy === option && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 font-ibm">
                Products ({filteredProducts.length})
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <MdBarChart className="w-4 h-4" />
                <span>
                  Total Value: $
                  {filteredProducts
                    .reduce((sum, p) => sum + p.totalValue, 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price & Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supply Chain
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 font-nunitoSans">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.id}
                        </div>
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 mt-1">
                          {product.category}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        ${product.price.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Qty: {product.quantity.toLocaleString()}
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        Total: ${product.totalValue.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <MdTransport className="w-4 h-4 mr-2 text-gray-400" />
                          {product.transporter}
                        </div>
                        <div className="flex items-center text-sm text-gray-900">
                          <MdStore className="w-4 h-4 mr-2 text-gray-400" />
                          {product.retailer}
                        </div>
                        {product.trackingNumber && (
                          <div className="text-xs text-blue-600">
                            Track: {product.trackingNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <MdCalendarToday className="w-4 h-4 mr-2 text-gray-400" />
                          {product.createdDate}
                        </div>
                        {product.estimatedDelivery && (
                          <div className="text-xs text-gray-500">
                            Est: {product.estimatedDelivery}
                          </div>
                        )}
                        <div className="text-xs text-gray-400">
                          Updated:{" "}
                          {new Date(product.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewProduct(product)}
                          className="p-2 text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors"
                          title="View Details"
                        >
                          <MdVisibility className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-green-600 cursor-pointer transition-colors"
                          title="Edit"
                        >
                          <MdEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-gray-400 hover:text-red-600 cursor-pointer transition-colors"
                          title="Delete"
                        >
                          <MdDelete className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <MdInventory className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                {searchTerm ||
                  filterStatus !== "all" ||
                  filterCategory !== "all"
                  ? "Try adjusting your search and filter criteria"
                  : "Get started by adding your first product"}
              </p>
            </div>
          )}
        </div>

        {/* Add Product Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-[99999] backdrop-blur-sm">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 font-ibm">
                      Add New Product
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Fill in the details to add a new product to your supply
                      chain
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      reset();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MdClose className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                {/* Real-time Value Display */}
                {totalValue > 0 && (
                  <div className="bg-gradient-to-r from-indigo-50 to-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MdAttachMoney className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-800">
                          Estimated Total Value:
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        ${totalValue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors ${errors.name ? "border-red-300" : "border-gray-300"
                        }`}
                      placeholder="Enter product name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <MdWarning className="w-4 h-4 mr-1" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      {...register("category")}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 ${errors.category ? "border-red-300" : "border-gray-300"
                        }`}
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <MdWarning className="w-4 h-4 mr-1" />
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($) *
                    </label>
                    <input
                      {...register("price", { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      min="0"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 ${errors.price ? "border-red-300" : "border-gray-300"
                        }`}
                      placeholder="0.00"
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <MdWarning className="w-4 h-4 mr-1" />
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      {...register("quantity", { valueAsNumber: true })}
                      type="number"
                      min="1"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 ${errors.quantity ? "border-red-300" : "border-gray-300"
                        }`}
                      placeholder="1"
                    />
                    {errors.quantity && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <MdWarning className="w-4 h-4 mr-1" />
                        {errors.quantity.message}
                      </p>
                    )}
                  </div>

                  {/* Transporter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transporter *
                    </label>
                    <select
                      {...register("transporter")}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 ${errors.transporter
                        ? "border-red-300"
                        : "border-gray-300"
                        }`}
                    >
                      <option value="">Select transporter</option>
                      {transporters.map((transporter) => (
                        <option key={transporter} value={transporter}>
                          {transporter}
                        </option>
                      ))}
                    </select>
                    {errors.transporter && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <MdWarning className="w-4 h-4 mr-1" />
                        {errors.transporter.message}
                      </p>
                    )}
                  </div>

                  {/* Retailer */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Retailer *
                    </label>
                    <select
                      {...register("retailer")}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 ${errors.retailer ? "border-red-300" : "border-gray-300"
                        }`}
                    >
                      <option value="">Select retailer</option>
                      {retailers.map((retailer) => (
                        <option key={retailer} value={retailer}>
                          {retailer}
                        </option>
                      ))}
                    </select>
                    {errors.retailer && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <MdWarning className="w-4 h-4 mr-1" />
                        {errors.retailer.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      {...register("description")}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 ${errors.description ? "border-red-300" : "border-gray-300"
                        }`}
                      placeholder="Enter product description (optional)"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <MdWarning className="w-4 h-4 mr-1" />
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Transporter Fees */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transporter Fees *
                    </label>
                    <input
                      type="number"
                      min="1"
                      className={`w-full px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500`}
                      placeholder="1"
                      value={transporterFees}
                      onChange={(e) => setTransporterFees(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      reset();
                    }}
                    className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 font-medium"
                  >
                    {isSubmitting && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    <span>
                      {isSubmitting ? "Adding Product..." : "Add Product"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Product Details Modal */}
        {showProductDetails && selectedProduct && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-[9999] backdrop-blur-sm">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 font-ibm">
                      Product Details
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Complete information about {selectedProduct.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowProductDetails(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MdClose className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Status Banner */}
                <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-indigo-50 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <StatusBadge status={selectedProduct.status} />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 font-nunitoSans">
                          {selectedProduct.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          ID: {selectedProduct.id}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-ibm font-bold text-gray-900">
                        ${selectedProduct.totalValue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Total Value</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Product Information */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                        <MdInventory className="w-5 h-5 mr-2 text-gray-800" />
                        Product Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-500">
                            Category:
                          </span>
                          <span className="font-medium text-gray-900">
                            {selectedProduct.category}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-500">Price:</span>
                          <span className="font-medium text-green-600">
                            ${selectedProduct.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-500">
                            Quantity:
                          </span>
                          <span className="font-medium text-gray-900">
                            {selectedProduct.quantity.toLocaleString()} units
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Supply Chain Info */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                        <MdTimeline className="w-5 h-5 mr-2 text-gray-800" />
                        Supply Chain
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <div className="flex items-center space-x-2">
                            <MdTransport className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              Transporter:
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {selectedProduct.transporter}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <div className="flex items-center space-x-2">
                            <MdStore className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              Retailer:
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {selectedProduct.retailer}
                          </span>
                        </div>
                        {selectedProduct.trackingNumber && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-500">
                              Tracking:
                            </span>
                            <span className="font-medium text-blue-600">
                              {selectedProduct.trackingNumber}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Timeline and Dates */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                        <MdCalendarToday className="w-5 h-5 mr-2 text-gray-800" />
                        Timeline
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Created
                            </div>
                            <div className="text-xs text-gray-500">
                              {selectedProduct.createdDate}
                            </div>
                          </div>
                        </div>
                        {selectedProduct.estimatedDelivery && (
                          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                Estimated Delivery
                              </div>
                              <div className="text-xs text-gray-500">
                                {selectedProduct.estimatedDelivery}
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Last Updated
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(
                                selectedProduct.lastUpdated,
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                        <MdBarChart className="w-5 h-5 mr-2 text-gray-800" />
                        Quick Stats
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-indigo-50 p-3 rounded-lg text-center">
                          <div className="text-lg font-bold text-gray-800">
                            ${selectedProduct.price.toFixed(2)}
                          </div>
                          <div className="text-xs text-indigo-800">
                            Unit Price
                          </div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg text-center">
                          <div className="text-lg font-bold text-gray-800">
                            {selectedProduct.quantity}
                          </div>
                          <div className="text-xs text-green-800">Quantity</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedProduct.description && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                      <MdDescription className="w-5 h-5 mr-2 text-gray-800" />
                      Description
                    </h4>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                      {selectedProduct.description}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap gap-3 justify-end">
                    <button className="px-4 py-2 cursor-pointer bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                      <MdEdit className="w-4 h-4" />
                      <span>Edit Product</span>
                    </button>

                    <button className="px-4 py-2 cursor-pointer bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center space-x-2">
                      <MdTimeline className="w-4 h-4" />
                      <span>Track Product</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
