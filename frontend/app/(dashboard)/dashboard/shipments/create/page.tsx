"use client";

import {
  MdClose,
  MdWarning,
  MdLocalShipping,
  MdInventory,
  MdStore,
  MdSchedule,
  MdAttachMoney,
  MdDescription,
  MdPerson,
  MdPhone,
  MdEmail,
  MdLocationOn,
} from "react-icons/md";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

// Zod validation schema
const shipmentSchema = z.object({
  productId: z.string().min(1, "Product selection is required"),
  transporterId: z.string().min(1, "Transporter selection is required"),
  retailerId: z.string().min(1, "Retailer selection is required"),
  priority: z.enum(["High", "Medium", "Low"], {
    required_error: "Priority selection is required",
  }),
  estimatedDelivery: z
    .string()
    .min(1, "Estimated delivery date is required")
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, "Delivery date must be today or in the future"),
  specialInstructions: z
    .string()
    .max(500, "Special instructions cannot exceed 500 characters")
    .optional(),
  pickupLocation: z.string().min(1, "Pickup location is required"),
  deliveryLocation: z.string().min(1, "Delivery location is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  contactPhone: z
    .string()
    .min(1, "Contact phone is required")
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),
  contactEmail: z
    .string()
    .min(1, "Contact email is required")
    .email("Please enter a valid email address"),
});

type ShipmentFormData = z.infer<typeof shipmentSchema>;

// Mock data (in real app, this would come from APIs)
const mockProducts = [
  {
    id: "PROD-001",
    name: "Premium Coffee Beans",
    price: 25.99,
    quantity: 100,
    supplier: "Coffee Masters Co.",
    category: "Food & Beverage",
    weight: 50.5,
  },
  {
    id: "PROD-002",
    name: "Organic Honey",
    price: 15.5,
    quantity: 50,
    supplier: "Pure Honey Farms",
    category: "Food & Beverage",
    weight: 25.0,
  },
  {
    id: "PROD-003",
    name: "Handcraft Pottery Set",
    price: 89.99,
    quantity: 20,
    supplier: "Artisan Crafts Ltd.",
    category: "Home & Decor",
    weight: 45.8,
  },
];

const mockTransporters = [
  {
    id: "TRANS-001",
    name: "FastTrack Logistics",
    rating: 4.8,
    specialties: ["Food & Beverage", "Electronics"],
    phone: "+1-555-0123",
    email: "support@fasttracklogistics.com",
  },
  {
    id: "TRANS-002",
    name: "GreenMove Transport",
    rating: 4.6,
    specialties: ["Food & Beverage", "Health & Beauty"],
    phone: "+1-555-0456",
    email: "delivery@greenmove.com",
  },
  {
    id: "TRANS-003",
    name: "Careful Cargo",
    rating: 4.9,
    specialties: ["Home & Decor", "Fragile Items"],
    phone: "+1-555-0789",
    email: "care@carefulcargo.com",
  },
];

const mockRetailers = [
  {
    id: "RET-001",
    name: "Bean & Brew Co.",
    location: "Downtown Store, Main St.",
    phone: "+1-555-1001",
    email: "orders@beanbrewco.com",
  },
  {
    id: "RET-002",
    name: "Natural Foods Market",
    location: "Organic Plaza, Green Ave.",
    phone: "+1-555-1002",
    email: "receiving@naturalfoods.com",
  },
  {
    id: "RET-003",
    name: "Artisan Home Store",
    location: "Arts District, Creative Blvd.",
    phone: "+1-555-1003",
    email: "delivery@artisanhome.com",
  },
];

const FormField = ({
  label,
  required = false,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
    {children}
    {error && (
      <p className="text-sm text-red-600 flex items-center">
        <MdWarning className="w-4 h-4 mr-1" />
        {error}
      </p>
    )}
  </div>
);

const InfoCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
    <div className="flex items-center space-x-2 mb-3">
      <Icon className="w-5 h-5 text-indigo-600" />
      <h3 className="font-medium text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

export default function CreateShipmentPage() {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState(mockProducts[0]);
  const [selectedTransporter, setSelectedTransporter] = useState(
    mockTransporters[0],
  );
  const [selectedRetailer, setSelectedRetailer] = useState(mockRetailers[0]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      productId: mockProducts[0].id,
      transporterId: mockTransporters[0].id,
      retailerId: mockRetailers[0].id,
      priority: "Medium",
      pickupLocation: "",
      deliveryLocation: "",
      contactPerson: "",
      contactPhone: "",
      contactEmail: "",
      specialInstructions: "",
    },
  });

  const watchedProductId = watch("productId");
  const watchedTransporterId = watch("transporterId");
  const watchedRetailerId = watch("retailerId");

  // Update selected items when form values change
  React.useEffect(() => {
    const product = mockProducts.find((p) => p.id === watchedProductId);
    if (product) setSelectedProduct(product);
  }, [watchedProductId]);

  React.useEffect(() => {
    const transporter = mockTransporters.find(
      (t) => t.id === watchedTransporterId,
    );
    if (transporter) setSelectedTransporter(transporter);
  }, [watchedTransporterId]);

  React.useEffect(() => {
    const retailer = mockRetailers.find((r) => r.id === watchedRetailerId);
    if (retailer) setSelectedRetailer(retailer);
  }, [watchedRetailerId]);

  const onSubmit = async (data: ShipmentFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real app, make API call here
      console.log("Creating shipment:", data);

      // Show success message (you can implement toast here)
      alert("Shipment created successfully!");

      // Redirect to shipments page
      router.push("/dashboard/shipments");
    } catch (error) {
      console.error("Error creating shipment:", error);
      alert("Error creating shipment. Please try again.");
    }
  };

  const estimatedValue = selectedProduct
    ? selectedProduct.price * selectedProduct.quantity
    : 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/dashboard/shipments">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <MdClose className="w-4 h-4" />
                <span>Back to Shipments</span>
              </Button>
            </Link>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-ibm">
              Create New Shipment
            </h1>
            <p className="mt-2 text-gray-600 font-nunitoSans">
              Schedule a new shipment for your products
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Shipment Overview */}
          {estimatedValue > 0 && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MdAttachMoney className="w-6 h-6 text-indigo-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-900">
                      Shipment Value
                    </h3>
                    <p className="text-sm text-indigo-700">
                      {selectedProduct?.quantity} × ${selectedProduct?.price}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-900">
                    ${estimatedValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-indigo-600">Estimated Value</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form Fields */}
            <div className="space-y-6">
              {/* Product Selection */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MdInventory className="w-5 h-5 mr-2 text-indigo-600" />
                  Product Details
                </h2>

                <FormField
                  label="Select Product"
                  required
                  error={errors.productId?.message}
                >
                  <select
                    {...register("productId")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {mockProducts.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.quantity} units
                      </option>
                    ))}
                  </select>
                </FormField>

                {selectedProduct && (
                  <InfoCard icon={MdInventory} title="Product Information">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Supplier:</span>
                        <span className="text-gray-900">
                          {selectedProduct.supplier}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Category:</span>
                        <span className="text-gray-900">
                          {selectedProduct.category}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Weight:</span>
                        <span className="text-gray-900">
                          {selectedProduct.weight} kg
                        </span>
                      </div>
                    </div>
                  </InfoCard>
                )}
              </div>

              {/* Transporter Selection */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MdLocalShipping className="w-5 h-5 mr-2 text-indigo-600" />
                  Transporter
                </h2>

                <FormField
                  label="Select Transporter"
                  required
                  error={errors.transporterId?.message}
                >
                  <select
                    {...register("transporterId")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {mockTransporters.map((transporter) => (
                      <option key={transporter.id} value={transporter.id}>
                        {transporter.name} - ★{transporter.rating}
                      </option>
                    ))}
                  </select>
                </FormField>

                {selectedTransporter && (
                  <InfoCard
                    icon={MdLocalShipping}
                    title="Transporter Information"
                  >
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Rating:</span>
                        <span className="text-gray-900">
                          ★{selectedTransporter.rating}/5
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Specialties:</span>
                        <span className="text-gray-900">
                          {selectedTransporter.specialties.join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MdPhone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">
                          {selectedTransporter.phone}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MdEmail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">
                          {selectedTransporter.email}
                        </span>
                      </div>
                    </div>
                  </InfoCard>
                )}
              </div>

              {/* Retailer Selection */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MdStore className="w-5 h-5 mr-2 text-indigo-600" />
                  Retailer
                </h2>

                <FormField
                  label="Select Retailer"
                  required
                  error={errors.retailerId?.message}
                >
                  <select
                    {...register("retailerId")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {mockRetailers.map((retailer) => (
                      <option key={retailer.id} value={retailer.id}>
                        {retailer.name} - {retailer.location}
                      </option>
                    ))}
                  </select>
                </FormField>

                {selectedRetailer && (
                  <InfoCard icon={MdStore} title="Retailer Information">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MdLocationOn className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">
                          {selectedRetailer.location}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MdPhone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">
                          {selectedRetailer.phone}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MdEmail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">
                          {selectedRetailer.email}
                        </span>
                      </div>
                    </div>
                  </InfoCard>
                )}
              </div>
            </div>

            {/* Right Column - Shipping Details */}
            <div className="space-y-6">
              {/* Shipping Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MdSchedule className="w-5 h-5 mr-2 text-indigo-600" />
                  Shipping Details
                </h2>

                <div className="space-y-4">
                  <FormField
                    label="Priority Level"
                    required
                    error={errors.priority?.message}
                  >
                    <select
                      {...register("priority")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                    </select>
                  </FormField>

                  <FormField
                    label="Estimated Delivery Date"
                    required
                    error={errors.estimatedDelivery?.message}
                  >
                    <input
                      {...register("estimatedDelivery")}
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </FormField>

                  <FormField
                    label="Pickup Location"
                    required
                    error={errors.pickupLocation?.message}
                  >
                    <input
                      {...register("pickupLocation")}
                      type="text"
                      placeholder="Enter pickup address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </FormField>

                  <FormField
                    label="Delivery Location"
                    required
                    error={errors.deliveryLocation?.message}
                  >
                    <input
                      {...register("deliveryLocation")}
                      type="text"
                      placeholder="Enter delivery address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </FormField>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MdPerson className="w-5 h-5 mr-2 text-indigo-600" />
                  Contact Information
                </h2>

                <div className="space-y-4">
                  <FormField
                    label="Contact Person"
                    required
                    error={errors.contactPerson?.message}
                  >
                    <input
                      {...register("contactPerson")}
                      type="text"
                      placeholder="Full name of contact person"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </FormField>

                  <FormField
                    label="Contact Phone"
                    required
                    error={errors.contactPhone?.message}
                  >
                    <input
                      {...register("contactPhone")}
                      type="tel"
                      placeholder="+1-555-000-0000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </FormField>

                  <FormField
                    label="Contact Email"
                    required
                    error={errors.contactEmail?.message}
                  >
                    <input
                      {...register("contactEmail")}
                      type="email"
                      placeholder="contact@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </FormField>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MdDescription className="w-5 h-5 mr-2 text-indigo-600" />
                  Special Instructions
                </h2>

                <FormField
                  label="Additional Notes"
                  error={errors.specialInstructions?.message}
                >
                  <textarea
                    {...register("specialInstructions")}
                    rows={4}
                    placeholder="Any special handling instructions, delivery preferences, or notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </FormField>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
            <Link href="/dashboard/shipments">
              <Button type="button" variant="outline" className="px-6 py-2">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 flex items-center space-x-2"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>
                {isSubmitting ? "Creating Shipment..." : "Create Shipment"}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
