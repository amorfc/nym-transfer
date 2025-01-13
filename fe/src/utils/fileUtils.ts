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
