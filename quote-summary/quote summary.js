// Select the hamburger icon
const hamburger = document.getElementById("hamburger")

// Select the navigation menu
const navLinks = document.getElementById("navLinks")

// When hamburger is clicked
hamburger.addEventListener("click", function(){

  // If the menu is already visible
  if(navLinks.style.display === "flex"){
    navLinks.style.display = "none"  // hide it
  }

  // If the menu is hidden
  else{
    navLinks.style.display = "flex"  // show it
  }

})

/**
 * PrimeFleet Quote Summary Logic
 * Professional, Design-Safe, and API-Ready
 */

const CONFIG = {
    USE_API: false, // Set to true when backend is ready
    API_URL: "https://api.primefleet.com/v1/get-quote",
    CURRENCY: "₦" 
};

// Mock data matches your teammate's design exactly
const mockData = {
    pickup: "Lagos Airport",
    destination: "Ikoyi",
    distance: "(120)",
    service: "Airport Transfer",
    vehicle: "Lexus RX 350",
    date: "December 20, 2026",
    time: "12pm",
    duration: "1 day",
    passengers: "4",
    numvehicles: "3",
    prices: {
        base: 45000,
        distance: 18000,
        vehicles: 45000,
        duration: 500,
        total: 108500
    }
};

async function loadQuoteData() {
    let data = mockData;

    if (CONFIG.USE_API) {
        try {
            const response = await fetch(CONFIG.API_URL);
            if (!response.ok) throw new Error("API issues");
            data = await response.json();
        } catch (error) {
            console.error("Backend unreachable, using mock data.", error);
        }
    }

    renderQuote(data);
}

function renderQuote(data) {
    // Helper to format currency
    const formatPrice = (num) => `${CONFIG.CURRENCY}${num.toLocaleString()}`;

    // 1. Update Route and Header Details
    updateElement("pickup-val", data.pickup);
    updateElement("dest-val", data.destination);
    updateElement("dist-val", data.distance);
    updateElement("service-val", data.service);
    updateElement("vehicle-val", data.vehicle);
    updateElement("date-val", data.date);
    updateElement("time-val", data.time);
    updateElement("duration-val", data.duration)
    updateElement("passengers-val", data.passengers);
    updateElement("num-veh-val", data.numvehicles);

    // 2. Update Pricing Table
    updateElement("base-price-display", formatPrice(data.prices.base));
    updateElement("dist-cost-display", `+${formatPrice(data.prices.distance)}`);
    updateElement("veh-cost-display", `+${formatPrice(data.prices.vehicles)}`);
    updateElement("dur-cost-display", `+${formatPrice(data.prices.duration)}`);
    
    // 3. Update Total and Deposit Note
    const totalEl = document.getElementById("total-price");
    if (totalEl) totalEl.innerText = formatPrice(data.prices.total);

    const noteEl = document.getElementById("deposit-note");
    if (noteEl) {
        const deposit = data.prices.total * 0.30;
        noteEl.innerHTML = `Note: A 30% deposit is required to reserve your booking <br> Kindly proceed to deposit ${formatPrice(deposit)}`;
    }
}

// Safety wrapper to ensure code doesn't break if an ID is missing
function updateElement(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.innerText = value;
    }
}

// Initialize
document.addEventListener("DOMContentLoaded", loadQuoteData);

// Button Handlers
document.querySelector(".pay-btn")?.addEventListener("click", () => {
    alert("Initiating secure payment...");
});