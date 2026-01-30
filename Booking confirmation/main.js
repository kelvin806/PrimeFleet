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
 * PrimeFleet Booking Confirmation Logic - FINAL VERSION
 */

const formatNaira = (num) => {
    const val = parseFloat(num);
    if (isNaN(val)) return "₦0.00";
    return "₦" + val.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const updateElement = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.innerText = value || "N/A";
};

function displayBookingDetails() {
    const data = JSON.parse(localStorage.getItem('bookingData'));

    if (!data) {
        console.error("No booking data found.");
        return;
    }

    // 1. Basic Trip Details
    updateElement('service-val', data.service);
    updateElement('pickup-val', data.pickup);
    updateElement('dest-val', data.destination);
    updateElement('vehicle-val', data.vehicle);
    updateElement('date-val', data.date);
    updateElement('time-val', data.time);
    updateElement('passengers-val', data.passengers);

    // 2. The Missing Fields: Number of Vehicles, Duration, and Distance
    updateElement('num-veh-val', data.numvehicles); 
    updateElement('duration-val', data.duration);
    
    // For distance, we ensure it shows "km"
    const distanceText = data.distance ? `${data.distance} km` : "N/A";
    updateElement('distance-val', distanceText);

    // 3. Pricing Logic
    const total = parseFloat(data.totalAmount) || 0;
    const deposit = parseFloat(data.depositAmount) || 0;
    const balance = total - deposit;

    updateElement('total-price', formatNaira(total));
    updateElement('deposit-paid', formatNaira(deposit));
    updateElement('balance-due', formatNaira(balance));

    // 4. Payment Status UI
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const statusLabel = document.getElementById('payment-status');

    if (status === 'paid') {
        if (statusLabel) {
            statusLabel.innerText = "Confirmed & Paid";
            statusLabel.style.color = "#28a745";
        }
    } else {
        if (statusLabel) {
            statusLabel.innerText = "Pending Verification";
            statusLabel.style.color = "#ffc107";
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayBookingDetails();

    // 5. Home Button Logic
    // This will work for both a standard button or a "Back to Home" link
    const homeBtn = document.getElementById('backHomeBtn');
    if (homeBtn) {
        homeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Clear storage so the next booking starts fresh
            localStorage.removeItem('bookingData');
            window.location.href = '../homepage/index.html'; 
        });
    }
});