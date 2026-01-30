// Select the hamburger icon
const hamburger = document.getElementById("hamburger")

// Select the navigation menu
const navLinks = document.getElementById("navLinks")

// When hamburger is clicked
hamburger.addEventListener("click", function () {

    // If the menu is already visible
    if (navLinks.style.display === "flex") {
        navLinks.style.display = "none"  // hide it
    }

    // If the menu is hidden
    else {
        navLinks.style.display = "flex"  // show it
    }

})


/**
 * PrimeFleet Quote Summary Logic - FINAL FIXED
 */

const formatNaira = (num) => `₦${Number(num).toLocaleString()}`;

const updateText = (id, value) => {
    const el = document.getElementById(id);
    if (el) {
        el.innerText = value || "N/A";
    } else {
        console.warn(`Element with ID "${id}" not found in HTML.`);
    }
};

function renderQuote(data) {
    if (!data) return;

    // 1. Math Calculations
    // Ensure data.prices.base exists, otherwise default to 0
    const basePrice = (data.prices && data.prices.base) ? Number(data.prices.base) : 0;
    
    // Parse distance (removes "km" if present) and calculate cost (150 per km)
    const distanceKM = parseFloat(data.distance) || 0;
    const distCost = distanceKM * 150;

    // Parse duration and calculate cost (500 per day)
    const durationDays = parseInt(data.duration) || 1;
    const durationCost = durationDays * 500;

    // Totals
    const total = basePrice + distCost + durationCost;
    const deposit = total * 0.30;

    // 2. Update Pricing UI
    updateText("base-price-display", formatNaira(basePrice));
    updateText("dist-cost-display", `+${formatNaira(distCost)}`);
    updateText("dur-cost-display", `+${formatNaira(durationCost)}`);
    updateText("veh-cost-display", `+${formatNaira(basePrice)}`); // Or specific vehicle cost
    updateText("total-price", formatNaira(total));

    // 3. Update Detail Labels (Ensure these IDs exist in your HTML)
    updateText("service-val", data.service);
    updateText("pickup-val", data.pickup);
    updateText("dest-val", data.destination);
    updateText("vehicle-val", data.vehicle); // This updates the "Booked Vehicles" small tag
    updateText("duration-val", data.duration); // This updates the "Duration Estimate" small tag
    updateText("date-val", data.date);
    updateText("time-val", data.time);
    updateText("passengers-val", data.passengers);
    updateText("num-veh-val", data.numvehicles);

    // 4. Update Deposit Note
    const depositNote = document.getElementById("deposit-note");
    if (depositNote) {
        depositNote.innerHTML = `Note: A 30% deposit of <strong>${formatNaira(deposit)}</strong> is required to reserve your booking. Kindly proceed to deposit <strong>${formatNaira(deposit)}</strong>.`;
    }

    // 5. Save Calculated Totals back to Storage for the Payment Page
    data.totalAmount = total;
    data.depositAmount = deposit;
    localStorage.setItem("bookingData", JSON.stringify(data));
}

// Initialization Logic
document.addEventListener('DOMContentLoaded', () => {
    const rawData = localStorage.getItem('bookingData');
    const data = rawData ? JSON.parse(rawData) : null;

    if (data) {
        renderQuote(data);
    } else {
        console.error("No booking data found in localStorage.");
    }

    // Fix: Redirection Logic for Payment Button
    const payBtn = document.querySelector('.pay-btn');
    if (payBtn) {
        payBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '../deposit-payment/deposit.html';
        });
    }
});