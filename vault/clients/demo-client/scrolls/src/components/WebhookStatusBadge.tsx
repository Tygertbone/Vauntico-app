/**
 * Webhook Status Badge Component
 * 
 * A compact, purified JSX component that displays the validation status
 * of a webhook in a visually clear way. Perfect for dashboards and quick scans.
 */

import { type WebhookValidationReason } from "../lib/webhook-validator";

interface WebhookStatusBadgeProps {
  reason: WebhookValidationReason;
  timestamp?: string;
  compact?: boolean;
}

export function WebhookStatusBadge({ 
  reason, 
  timestamp, 
  compact = false 
}: WebhookStatusBadgeProps) {
  const config = getStatusConfig(reason);

  return (
    <div 
      className={`webhook-status-badge status-${config.variant}`}
      role="status"
      aria-label={`Webhook status: ${config.label}`}
    >
      <span className="badge-icon" aria-hidden="true">
        {config.icon}
      </span>
      
      {!compact && (
        <>
          <span className="badge-label">{config.label}</span>
          
          {timestamp && (
            <time className="badge-timestamp" dateTime={timestamp}>
              {formatRelativeTime(timestamp)}
            </time>
          )}
        </>
      )}
      
      {compact && (
        <span className="sr-only">{config.label}</span>
      )}
    </div>
  );
}

interface StatusConfig {
  variant: "success" | "warning" | "error" | "expired";
  icon: string;
  label: string;
}

function getStatusConfig(reason: WebhookValidationReason): StatusConfig {
  const configs: Record<WebhookValidationReason, StatusConfig> = {
    VERIFIED: {
      variant: "success",
      icon: "✅",
      label: "Verified",
    },
    TIMESTAMP_EXPIRED: {
      variant: "expired",
      icon: "⏰",
      label: "Expired",
    },
    SIGNATURE_MISMATCH: {
      variant: "error",
      icon: "🔐",
      label: "Invalid Signature",
    },
    MISSING_SIGNATURE: {
      variant: "warning",
      icon: "⚠️",
      label: "Missing Signature",
    },
    MISSING_TIMESTAMP: {
      variant: "warning",
      icon: "⚠️",
      label: "Missing Timestamp",
    },
    MISSING_SECRET: {
      variant: "error",
      icon: "🔑",
      label: "Configuration Error",
    },
    INVALID_TIMESTAMP_FORMAT: {
      variant: "error",
      icon: "❌",
      label: "Invalid Format",
    },
  };

  return configs[reason];
}

/**
 * Formats timestamp as relative time (e.g., "2m ago")
 */
function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);

    if (diffSeconds < 60) {
      return `${diffSeconds}s ago`;
    }

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return "unknown";
  }
}
