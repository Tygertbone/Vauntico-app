/**
 * Webhook Audit Log Component
 * 
 * A purified JSX component that renders the sacred scroll of webhook validations.
 * Each entry in the audit trail tells the story of a webhook's journey through
 * the validation gauntlet.
 */

import { type WebhookValidationResult } from "../lib/webhook-validator";

export interface AuditEntry {
  id: string;
  timestamp: string;
  source: string;
  signature: string;
  result: WebhookValidationResult;
  payload?: string;
}

interface WebhookAuditLogProps {
  entries: AuditEntry[];
  maxEntries?: number;
}

export function WebhookAuditLog({ entries, maxEntries = 50 }: WebhookAuditLogProps) {
  const displayEntries = entries.slice(0, maxEntries);

  return (
    <div className="webhook-audit-log">
      <header className="audit-header">
        <h2>Audit Scroll: Webhook Validation Chronicle</h2>
        <p className="audit-subtitle">
          Every webhook validation ritual, inscribed for posterity
        </p>
      </header>

      <div className="audit-entries">
        {displayEntries.length === 0 ? (
          <EmptyState />
        ) : (
          displayEntries.map((entry) => (
            <AuditEntryCard key={entry.id} entry={entry} />
          ))
        )}
      </div>

      {entries.length > maxEntries && (
        <footer className="audit-footer">
          <p>
            Showing {maxEntries} of {entries.length} entries
          </p>
        </footer>
      )}
    </div>
  );
}

function AuditEntryCard({ entry }: { entry: AuditEntry }) {
  const { result, timestamp, source, signature } = entry;
  const outcomeIcon = getOutcomeIcon(result.reason);
  const outcomeClass = result.valid ? "outcome-success" : "outcome-failure";

  return (
    <article className={`audit-entry ${outcomeClass}`}>
      <div className="entry-header">
        <span className="outcome-badge" title={result.reason}>
          {outcomeIcon} {result.reason}
        </span>
        <time className="entry-timestamp" dateTime={timestamp}>
          {formatTimestamp(timestamp)}
        </time>
      </div>

      <div className="entry-body">
        <dl className="entry-details">
          <div className="detail-row">
            <dt>Source</dt>
            <dd className="source-name">{source}</dd>
          </div>

          <div className="detail-row">
            <dt>Signature</dt>
            <dd className="signature-hash" title={signature}>
              {truncateHash(signature)}
            </dd>
          </div>

          {result.metadata?.timestamp && (
            <div className="detail-row">
              <dt>Webhook Time</dt>
              <dd>{formatTimestamp(result.metadata.timestamp)}</dd>
            </div>
          )}

          {result.metadata?.timestampAge !== undefined && (
            <div className="detail-row">
              <dt>Age</dt>
              <dd>{result.metadata.timestampAge}s</dd>
            </div>
          )}
        </dl>

        <div className="entry-message">
          <p>{result.message}</p>
        </div>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="audit-empty-state">
      <p className="empty-message">The scroll is pristine. No webhooks have been received yet.</p>
      <p className="empty-hint">
        When webhooks arrive, their validation journey will be chronicled here.
      </p>
    </div>
  );
}

/**
 * Returns an icon representing the validation outcome
 */
function getOutcomeIcon(reason: string): string {
  switch (reason) {
    case "VERIFIED":
      return "✅";
    case "TIMESTAMP_EXPIRED":
      return "⏰";
    case "SIGNATURE_MISMATCH":
      return "🔐";
    case "MISSING_SIGNATURE":
    case "MISSING_TIMESTAMP":
    case "MISSING_SECRET":
      return "⚠️";
    default:
      return "❌";
  }
}

/**
 * Formats ISO timestamp to human-readable format
 */
function formatTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return isoString;
  }
}

/**
 * Truncates hash for display while maintaining recognizability
 */
function truncateHash(hash: string, length: number = 16): string {
  if (hash.length <= length) {
    return hash;
  }
  const start = hash.slice(0, length / 2);
  const end = hash.slice(-length / 2);
  return `${start}...${end}`;
}
