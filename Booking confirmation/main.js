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



    // 1. Your Mock API Data
    const bookingData = {
        pickup: "Lagos Airport",
        dropoff: "Ikoyi",
        distance: "120Km",
        service: "Airport Transfer",
        vehicle: "Lexus RX 350",
        date: "December 20, 2026",
        time: "12pm",
        duration: "1 day",
        passengers: "4",
        vehiclesCount: "8",
        paymentStatus: "Deposit Paid" // Try changing this to "Pending" to see the color change!
    };

    // 2. Function to Update Text and Colors
    function updateUI() {
        // Update Text Fields
        document.getElementById('pickup-location').innerText = bookingData.pickup;
        document.getElementById('dropoff-location').innerText = bookingData.dropoff;
        document.getElementById('trip-distance').innerText = bookingData.distance;
        document.getElementById('service-type').innerText = bookingData.service;
        document.getElementById('vehicle-type').innerText = bookingData.vehicle;
        document.getElementById('trip-date').innerText = bookingData.date;
        document.getElementById('trip-time').innerText = bookingData.time;
        document.getElementById('trip-duration').innerText = bookingData.duration;
        document.getElementById('passenger-count').innerText = bookingData.passengers;
        document.getElementById('vehicle-count').innerText = bookingData.vehiclesCount;
      
    }

    const statusText = document.getElementById('payment-status');
    const statusIcon = document.getElementById('status-icon');
    const statusVal = bookingData.paymentStatus;

    statusText.innerText = statusVal;

    // Reset icons first so they don't stack (remove all possible icons)
    statusIcon.classList.remove('fa-check', 'fa-clock', 'fa-xmark');

    if (statusVal === "Deposit Paid") {
        // GREEN STYLE
        statusText.style.setProperty('color', '#28a745', 'important');
        statusIcon.style.setProperty('color', '#28a745', 'important');
        statusIcon.classList.add('fa-check'); 

    } else if (statusVal === "Pending") {
        // ORANGE STYLE
        statusText.style.setProperty('color', '#ffc107', 'important');
        statusIcon.style.setProperty('color', '#ffc107', 'important');
        statusIcon.classList.add('fa-clock'); 

    } else {
        // RED STYLE
        statusText.style.setProperty('color', '#dc3545', 'important');
        statusIcon.style.setProperty('color', '#dc3545', 'important');
        statusIcon.classList.add('fa-xmark');
    }

    // 4. Function for the Download Button
    function setupDownload() {
        const btn = document.getElementById('download-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                window.print(); // Opens the "Save as PDF" / Print dialog
            });
        }
    }

    // Initialize everything when page loads
    window.addEventListener('DOMContentLoaded', () => {
        updateUI();
        setupDownload();
    })