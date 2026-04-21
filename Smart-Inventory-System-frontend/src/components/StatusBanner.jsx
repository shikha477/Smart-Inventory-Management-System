function StatusBanner({ kind = "info", message }) {
  if (!message) return null;
  return <div className={`status-banner status-${kind}`}>{message}</div>;
}

export default StatusBanner;
