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



    // 1. THIS IS YOUR DATA HOLDER
    // When you get your API, you will just update these values.
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
        vehiclesCount: "2",
        paymentStatus: "Deposit Paid" // Change to "Pending" or "Failed" to test
    };

    function updateBookingDetails() {
        // Update Text Content
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

        // 2. STATUS, COLOR & ICON LOGIC
        const statusText = document.getElementById('payment-status');
        const statusIcon = document.getElementById('status-icon');
        
        statusText.innerText = bookingData.paymentStatus;

        // Remove old icons to prevent stacking
        statusIcon.classList.remove('fa-check', 'fa-clock', 'fa-xmark');

        if (bookingData.paymentStatus === "Deposit Paid") {
            // GREEN
            statusText.style.setProperty('color', '#28a745', 'important');
            statusIcon.style.setProperty('color', '#28a745', 'important');
            statusIcon.classList.add('fa-check');
        } 
        else if (bookingData.paymentStatus === "Pending") {
            // ORANGE
            statusText.style.setProperty('color', '#ffc107', 'important');
            statusIcon.style.setProperty('color', '#ffc107', 'important');
            statusIcon.classList.add('fa-clock');
        } 
        else {
            // RED
            statusText.style.setProperty('color', '#dc3545', 'important');
            statusIcon.style.setProperty('color', '#dc3545', 'important');
            statusIcon.classList.add('fa-xmark');
        }
    }

    // 3. DOWNLOAD RECEIPT FUNCTION
    document.getElementById('download-btn').addEventListener('click', function() {
        window.print(); // Professional way to "Download" as PDF
    });

    // Run everything when page loads
    window.onload = updateBookingDetails;
