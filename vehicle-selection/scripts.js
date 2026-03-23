// Select the hamburger icon
const hamburger = document.getElementById("hamburger");

// Select the navigation menu
const navLinks = document.getElementById("navLinks");

// When hamburger is clicked
hamburger.addEventListener("click", function () {
  // If the menu is already visible
  if (navLinks.style.display === "flex") {
    navLinks.style.display = "none"; // hide it
  }

  // If the menu is hidden
  else {
    navLinks.style.display = "flex"; // show it
  }
});

const API_URL = "https://primefleet-mvp.onrender.com/api/v1/vehicles";
const FALLBACK_IMAGE = "images/select 1.png";

let vehicleData = [];
let currentCategory = "all";

// This array stores the cars the user selects
let selectedFleet = [];

function setLoadingState(isLoading, message = "Loading vehicles...") {
  const loadingEl = document.getElementById("vehicles-loading");
  if (!loadingEl) return;

  loadingEl.textContent = message;
  loadingEl.style.display = isLoading ? "block" : "none";
}

function showEmptyState(message) {
  const container = document.getElementById("vehicle-container");
  if (!container) return;

  container.innerHTML = `<p class="status-message">${message}</p>`;
}

// 2. RENDER FUNCTION: This builds the HTML cards dynamically
function displayVehicles(cars) {
  const container = document.getElementById("vehicle-container");
  if (!container) return; // Safety check

  if (!cars.length) {
    showEmptyState("No vehicles found for this category.");
    return;
  }

  container.innerHTML = ""; // Clear the section first

  cars.forEach((car) => {
    const title = `${car.make} ${car.model}`;
    const vehicleImage = car.photoUrl || FALLBACK_IMAGE;
    const formattedType = car.vehicleType || "UNKNOWN";

    const cardHTML = `
            <div class="car-card">
                <a class="car-image-link" href="vehicle-detail.html?id=${encodeURIComponent(car.id)}" aria-label="View ${title} details">
                  <img src="${vehicleImage}" alt="${title}">
                </a>
                <h3>${title}</h3>
                <p>${car.year} • ${formattedType}</p>
                <h4>₦${Number(car.pricePerDay || 0).toLocaleString()}/day</h4>
                <button class="add-btn" onclick="addToFleet('${car.id}')">Add</button>
            </div>
        `;
    container.innerHTML += cardHTML;
  });
}

// 3. FILTER LOGIC: Triggered by your All, SUV, Sedan, Van, Bus buttons
function filterVehicles(category) {
  currentCategory = category;

  // Update button visual state
  const buttons = document.querySelectorAll(".buttons button");
  buttons.forEach((btn) => {
    const buttonCategory = btn.textContent.trim().toLowerCase();
    const normalizedButtonCategory =
      buttonCategory === "all" ? "all" : buttonCategory;
    btn.classList.toggle("active", normalizedButtonCategory === category);
  });

  if (category === "all") {
    displayVehicles(vehicleData);
  } else {
    const filtered = vehicleData.filter(
      (car) => (car.vehicleType || "").toLowerCase() === category,
    );
    displayVehicles(filtered);
  }
}

// 4. ADD TO FLEET LOGIC
// Keep your global array at the top of scripts.js
function addToFleet(vehicleId) {
  const car = vehicleData.find((v) => v.id === vehicleId);
  if (!car) return;

  // 1. Get the snowball
  let bookingData = JSON.parse(localStorage.getItem("bookingData")) || {};

  // 2. Store the vehicle ID and details
  bookingData.vehicleId = car.id;
  bookingData.vehicle = `${car.make} ${car.model}`;
  bookingData.vehicleType = car.vehicleType;
  bookingData.pricePerDay = Number(car.pricePerDay || 0);

  localStorage.setItem("bookingData", JSON.stringify(bookingData));

  document.getElementById("checkout-area").style.display = "block";
  alert(`${car.make} selected! Click the button below to proceed.`);
}

function goToPayment() {
  window.location.href = "../passenger-detail/passenger.html";
}

async function fetchVehicleData() {
  try {
    setLoadingState(true);
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    const vehicles = Array.isArray(result.data) ? result.data : [];

    // Keep only vehicles the user can currently select.
    vehicleData = vehicles.filter((vehicle) => vehicle.isAvailable);

    if (!vehicleData.length) {
      showEmptyState("No available vehicles at the moment.");
      return;
    }

    filterVehicles(currentCategory);
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
    showEmptyState("Could not load vehicles right now. Please try again.");
  } finally {
    setLoadingState(false);
  }
}

// 5. INITIALIZE: Run this when the page loads
document.addEventListener("DOMContentLoaded", () => {
  fetchVehicleData();
});
