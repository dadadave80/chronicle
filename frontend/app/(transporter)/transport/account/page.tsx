/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  MdWallet,
  MdPerson,
  MdBusiness,
  MdLocalShipping,
  MdStore,
  MdEdit,
  MdSave,
  MdCancel,
  MdVerified,
  MdSecurity,
  MdHistory,
  MdNotifications,
  MdSettings,
  MdLink,
  MdContentCopy,
  MdLogout,
  MdWarning,
  MdCheckCircle,
  MdInfo,
  MdVpnKey,
} from "react-icons/md";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserAccount {
  id: string;
  walletAddress: string;
  name: string;
  email: string;
  role: "Supplier" | "Transporter" | "Retailer";
  isVerified: boolean;
  joinDate: string;
  avatar?: string;
  bio?: string;
  company?: string;
  location?: string;
  phone?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

interface WalletInfo {
  isConnected: boolean;
  address: string;
  balance: string;
  network: string;
}

const mockAccount: UserAccount = {
  id: "usr-003",
  walletAddress: "0x742d35C8C3C4C30E6A0b1b5Db6e30f8A2D5E9B3F",
  name: "Adam Philip",
  email: "adams@example.com",
  role: "Transporter",
  isVerified: true,
  joinDate: "2024-01-15",
  avatar: "/api/placeholder/100/100",
  bio: "Experienced transporter/delivery agent with over 10 years of experience.",
  company: "Fedex Co.",
  location: "Los Angeles, CA",
  phone: "+1-555-0123",
  website: "https://fedexco.com",
  socialLinks: {
    twitter: "@fedex",
    linkedin: "fedex-co",
  },
};

const mockWallet: WalletInfo = {
  isConnected: true,
  address: "0x742d35C8C3C4C30E6A0b1b5Db6e30f8A2D5E9B3F",
  balance: "2.4567 ETH",
  network: "Hedera Testnet",
};

const RoleCard = ({
  role,
  icon: Icon,
  description,
  isSelected,
  onSelect,
}: {
  role: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <div
    onClick={onSelect}
    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
      isSelected
        ? "border-gray-600 bg-gray-50"
        : "border-gray-200 hover:border-gray-300"
    }`}
  >
    <div className="flex items-center space-x-3">
      <div
        className={`p-3 rounded-lg ${
          isSelected ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-600"
        }`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3
          className={`font-semibold ${
            isSelected ? "text-gray-900" : "text-gray-800"
          }`}
        >
          {role}
        </h3>
        <p
          className={`text-sm ${
            isSelected ? "text-gray-800" : "text-gray-600"
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  </div>
);

const InfoCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  subtitle?: string;
  action?: React.ReactNode;
}) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-indigo-100 rounded-lg">
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-lg font-semibold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  </div>
);

const NotificationItem = ({
  title,
  description,
  time,
  type,
}: {
  title: string;
  description: string;
  time: string;
  type: "info" | "success" | "warning";
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <MdCheckCircle className="w-5 h-5" />;
      case "warning":
        return <MdWarning className="w-5 h-5" />;
      default:
        return <MdInfo className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border ${getTypeStyles()} flex items-start space-x-3`}
    >
      {getIcon()}
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm opacity-90 mt-1">{description}</p>
        <p className="text-xs opacity-70 mt-2">{time}</p>
      </div>
    </div>
  );
};

export default function AccountPage() {
  const [account, setAccount] = useState<UserAccount>(mockAccount);
  const [wallet, setWallet] = useState<WalletInfo>(mockWallet);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(account);
  const [activeTab, setActiveTab] = useState<
    "profile" | "wallet" | "notifications" | "security"
  >("profile");
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  // Mock notifications
  const [notifications] = useState([
    {
      title: "Profile Verified",
      description: "Your profile has been successfully verified",
      time: "2 hours ago",
      type: "success" as const,
    },
    {
      title: "New Delivery Assigned",
      description: "You have a new delivery assignment for Coffee Beans",
      time: "4 hours ago",
      type: "info" as const,
    },
    {
      title: "Payment Pending",
      description: "Your payment for order #ORD-123 is pending confirmation",
      time: "1 day ago",
      type: "warning" as const,
    },
  ]);

  const handleSave = () => {
    setAccount(editForm);
    setIsEditing(false);
    // In real app, save to blockchain/backend
    console.log("Saving account:", editForm);
  };

  const handleCancel = () => {
    setEditForm(account);
    setIsEditing(false);
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(wallet.address);
    // Show toast notification
    alert("Address copied to clipboard!");
  };

  const handleRoleChange = (
    newRole: "Supplier" | "Transporter" | "Retailer",
  ) => {
    setEditForm({ ...editForm, role: newRole });
    setShowRoleSelector(false);
  };

  const TabButton = ({
    tabKey,
    label,
    icon: Icon,
  }: {
    tabKey: typeof activeTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => (
    <button
      onClick={() => setActiveTab(tabKey)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === tabKey
          ? "bg-gray-800 text-gray-100"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-ibm">
                Account Management
              </h1>
              <p className="mt-2 text-gray-600 font-nunitoSans">
                Manage your Chronicle dApp profile and settings
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-2">
              {account.isVerified && (
                <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  <MdVerified className="w-4 h-4" />
                  <span>Verified</span>
                </div>
              )}
              <div className="text-sm text-gray-500">
                Member since {new Date(account.joinDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-2 overflow-x-auto">
            <TabButton tabKey="profile" label="Profile" icon={MdPerson} />
            <TabButton tabKey="wallet" label="Wallet" icon={MdWallet} />
            <TabButton
              tabKey="notifications"
              label="Notifications"
              icon={MdNotifications}
            />
            <TabButton tabKey="security" label="Security" icon={MdSecurity} />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Profile Information
                  </h2>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <MdEdit className="w-4 h-4" />
                      <span>Edit</span>
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <MdCancel className="w-4 h-4" />
                        <span>Cancel</span>
                      </Button>
                      <Button
                        onClick={handleSave}
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <MdSave className="w-4 h-4" />
                        <span>Save</span>
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Avatar and Basic Info */}
                  <div className="flex items-start space-x-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-500 to-gray-800 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {(isEditing ? editForm.name : account.name)
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      {account.isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <MdVerified className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={isEditing ? editForm.name : account.name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={isEditing ? editForm.email : account.email}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                email: e.target.value,
                              })
                            }
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div>
                    <Label>Role in Chronify *</Label>
                    <div className="mt-2">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-indigo-100 rounded-lg">
                          {account.role === "Transporter" && (
                            <MdLocalShipping className="w-6 h-6 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {account.role}
                          </p>
                          <p className="text-sm text-gray-600">
                            {account.role === "Supplier" &&
                              "Create and supply products"}
                            {account.role === "Transporter" &&
                              "Handle logistics and delivery"}
                            {account.role === "Retailer" &&
                              "Receive and sell products"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={
                          isEditing
                            ? editForm.company || ""
                            : account.company || ""
                        }
                        onChange={(e) =>
                          setEditForm({ ...editForm, company: e.target.value })
                        }
                        disabled={!isEditing}
                        className="mt-1"
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={
                          isEditing
                            ? editForm.location || ""
                            : account.location || ""
                        }
                        onChange={(e) =>
                          setEditForm({ ...editForm, location: e.target.value })
                        }
                        disabled={!isEditing}
                        className="mt-1"
                        placeholder="City, State"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={
                          isEditing ? editForm.phone || "" : account.phone || ""
                        }
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                        disabled={!isEditing}
                        className="mt-1"
                        placeholder="+1-555-000-0000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={
                          isEditing
                            ? editForm.website || ""
                            : account.website || ""
                        }
                        onChange={(e) =>
                          setEditForm({ ...editForm, website: e.target.value })
                        }
                        disabled={!isEditing}
                        className="mt-1"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      value={isEditing ? editForm.bio || "" : account.bio || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, bio: e.target.value })
                      }
                      disabled={!isEditing}
                      rows={4}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <InfoCard
                icon={MdVpnKey}
                title="Account ID"
                value={account.id}
                subtitle="Unique identifier"
              />

              <InfoCard
                icon={MdHistory}
                title="Member Since"
                value={new Date(account.joinDate).toLocaleDateString()}
                subtitle="Join date"
              />

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <MdLink className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <MdSettings className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    size="sm"
                  >
                    <MdLogout className="w-4 h-4 mr-2" />
                    Deactivate Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "wallet" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <InfoCard
                icon={MdWallet}
                title="Wallet Address"
                value={`${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`}
                subtitle={wallet.network}
                action={
                  <Button
                    onClick={copyAddress}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <MdContentCopy className="w-4 h-4" />
                    <span>Copy</span>
                  </Button>
                }
              />

              <InfoCard
                icon={MdWallet}
                title="Balance"
                value={wallet.balance}
                subtitle="Available balance"
              />

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Wallet Actions
                </h3>
                <div className="space-y-3">
                  <Button className="w-full" size="sm">
                    Add Funds
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    View Transaction History
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    Export Private Key
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Transactions
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        Product Registration
                      </p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">-0.0001 ETH</p>
                      <p className="text-sm text-green-600">Confirmed</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        Delivery Update
                      </p>
                      <p className="text-sm text-gray-500">1 day ago</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">-0.0001 ETH</p>
                      <p className="text-sm text-green-600">Confirmed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Recent Notifications
              </h2>
              <div className="space-y-4">
                {notifications.map((notification, index) => (
                  <NotificationItem
                    key={index}
                    title={notification.title}
                    description={notification.description}
                    time={notification.time}
                    type={notification.type}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Notification Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Email Notifications
                    </h4>
                    <p className="text-sm text-gray-600">
                      Receive updates via email
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Push Notifications
                    </h4>
                    <p className="text-sm text-gray-600">
                      Receive browser notifications
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Security Settings
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MdVerified className="w-6 h-6 text-green-600" />
                    <div>
                      <h4 className="font-medium text-green-900">
                        Account Verified
                      </h4>
                      <p className="text-sm text-green-700">
                        Your account has been verified
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable 2FA
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Login History</h4>
                    <p className="text-sm text-gray-600">
                      View your recent login activity
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View History
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Connected Apps
                    </h4>
                    <p className="text-sm text-gray-600">
                      Manage third-party app connections
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage Apps
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
