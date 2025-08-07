import { MdCheckCircle, MdNotifications, MdWarning } from "react-icons/md";

const NotificationAlert = ({
  type,
  message,
  onDismiss,
}: {
  type: "success" | "warning" | "error";
  message: string;
  onDismiss: () => void;
}) => {
  const getAlertStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case "error":
        return "bg-red-50 text-red-800 border-red-200";
      default:
        return "bg-blue-50 text-blue-800 border-blue-200";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <MdCheckCircle className="w-5 h-5" />;
      case "warning":
        return <MdWarning className="w-5 h-5" />;
      case "error":
        return <MdWarning className="w-5 h-5" />;
      default:
        return <MdNotifications className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`flex items-center p-4 rounded-lg border ${getAlertStyles()}`}
    >
      <div className="flex items-center">
        {getIcon()}
        <span className="ml-3 text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={onDismiss}
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 hover:bg-black/10 transition-colors"
      >
        <span className="sr-only">Dismiss</span>
        <svg className="w-3 h-3" viewBox="0 0 14 14">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
};

export default NotificationAlert;
