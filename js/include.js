// Simple component loader with cache-busting version support
// Bump this on every deploy to force browsers to fetch fresh files
const ASSET_VERSION = "2025-08-20"; // YYYY-MM-DD

function withVersion(url) {
  // Append ?v=... or &v=... depending on existing query
  return (
    url +
    (url.includes("?") ? "&" : "?") +
    "v=" +
    encodeURIComponent(ASSET_VERSION)
  );
}

function loadComponent(id, file) {
  // Check if element exists before trying to load
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Element with id '${id}' not found`);
    return;
  }

  fetch(withVersion(file))
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      element.innerHTML = data;
    })
    .catch((error) => {
      console.error("Error loading component:", file, error);
      // Optional: Set fallback content (kept minimal to avoid layout shifts)
      element.innerHTML = "";
    });
}

// Load all components after DOM is fully loaded
window.addEventListener("DOMContentLoaded", () => {
  // Only load components if their target elements exist
  const componentsToLoad = [
    { id: "navbar", file: "components/navbar.html" },
    { id: "footer", file: "components/footer.html" },
    { id: "HomeBanner", file: "components/HomeBanner.html" },
    { id: "banner", file: "components/banner.html" },
  ];

  componentsToLoad.forEach((component) => {
    if (document.getElementById(component.id)) {
      loadComponent(component.id, component.file);
    }
  });
});
