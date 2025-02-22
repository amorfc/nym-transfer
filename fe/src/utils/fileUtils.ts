export const downloadFileToLocal = (content: number[], filename: string) => {
  // Create blob from content
  const blob = new Blob([new Uint8Array(content)]);

  try {
    // Try to use modern download API first
    if ("download" in HTMLAnchorElement.prototype && window.URL) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;

      // Append only if needed for iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        document.body.appendChild(a);
      }

      a.click();

      // Cleanup
      if (isIOS) {
        document.body.removeChild(a);
      }
      window.URL.revokeObjectURL(url);
    } else {
      // Fallback for older browsers
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error("Download failed:", error);
    // Fallback to direct blob URL
    const url = window.URL.createObjectURL(blob);
    window.location.href = url;
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const formatKilobytesToHuman = (kilobytes: number): string => {
  if (kilobytes === 0) return "0 KB";
  if (kilobytes < 1024) return `${kilobytes.toFixed(2)} KB`;
  if (kilobytes < 1024 * 1024) return `${(kilobytes / 1024).toFixed(2)} MB`;
  return `${(kilobytes / (1024 * 1024)).toFixed(2)} GB`;
};

export const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return timestamp; // Return original timestamp if parsing fails
  }
};
