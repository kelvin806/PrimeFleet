const VEHICLE_API_BASE = "https://primefleet-mvp.onrender.com/api/v1/vehicles";
const VEHICLE_FALLBACK_IMAGE = "images/select 1.png";

function getVehicleIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function setError(message) {
  const errorEl = document.getElementById("vehicle-error");
  const loadingEl = document.getElementById("vehicle-loading");
  const detailEl = document.getElementById("vehicle-detail");

  if (loadingEl) loadingEl.style.display = "none";
  if (detailEl) detailEl.style.display = "none";

  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = "block";
  }
}

function renderVehicle(vehicle) {
  const loadingEl = document.getElementById("vehicle-loading");
  const errorEl = document.getElementById("vehicle-error");
  const detailEl = document.getElementById("vehicle-detail");

  if (!detailEl) return;

  const title = `${vehicle.make || "Unknown"} ${vehicle.model || "Vehicle"}`;
  const pricePerDay = Number(vehicle.pricePerDay || 0).toLocaleString();
  const vehicleType = vehicle.vehicleType || "N/A";
  const availability = vehicle.isAvailable ? "Available" : "Unavailable";

  detailEl.innerHTML = `
    <img class="vehicle-image" src="${vehicle.photoUrl || VEHICLE_FALLBACK_IMAGE}" alt="${title}">
    <div class="vehicle-content">
      <h1 class="vehicle-title">${title}</h1>
      <p class="vehicle-price">₦${pricePerDay}/day</p>

      <div class="vehicle-meta">
        <div class="meta-item">
          <p class="meta-label">Vehicle Type</p>
          <p class="meta-value">${vehicleType}</p>
        </div>
        <div class="meta-item">
          <p class="meta-label">Year</p>
          <p class="meta-value">${vehicle.year || "N/A"}</p>
        </div>
        <div class="meta-item">
          <p class="meta-label">Plate Number</p>
          <p class="meta-value">${vehicle.plateNumber || "N/A"}</p>
        </div>
        <div class="meta-item">
          <p class="meta-label">Base Price</p>
          <p class="meta-value">₦${Number(vehicle.basePrice || 0).toLocaleString()}</p>
        </div>
        <div class="meta-item">
          <p class="meta-label">Price Per Km</p>
          <p class="meta-value">₦${Number(vehicle.pricePerKm || 0).toLocaleString()}</p>
        </div>
        <div class="meta-item">
          <p class="meta-label">Status</p>
          <p class="meta-value">${availability}</p>
        </div>
      </div>
    </div>
  `;

  if (loadingEl) loadingEl.style.display = "none";
  if (errorEl) errorEl.style.display = "none";
  detailEl.style.display = "block";
}

async function fetchSingleVehicle() {
  const vehicleId = getVehicleIdFromQuery();

  if (!vehicleId) {
    setError("Vehicle id is missing in the URL.");
    return;
  }

  try {
    const response = await fetch(
      `${VEHICLE_API_BASE}/${encodeURIComponent(vehicleId)}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch vehicle details");
    }

    const result = await response.json();
    const vehicle = result && result.data ? result.data : null;

    if (!vehicle) {
      setError("Vehicle details not found.");
      return;
    }

    renderVehicle(vehicle);
  } catch (error) {
    console.error("Error fetching single vehicle:", error);
    setError("Could not load vehicle details right now. Please try again.");
  }
}

document.addEventListener("DOMContentLoaded", fetchSingleVehicle);
