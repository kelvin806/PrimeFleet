// API Endpoints
const PRICING_API = "https://primefleet-mvp.onrender.com/api/v1/bookings/quote";

// DOM Elements
const passengerForm = document.getElementById("passengerForm");
const proceedBtn = document.getElementById("proceedBtn");
const formMessage = document.getElementById("formMessage");

// Helper function to display messages
const displayMessage = (message, type = "error") => {
  if (!formMessage) return;

  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.style.display = "block";

  if (type === "success") {
    setTimeout(() => {
      formMessage.style.display = "none";
    }, 2000);
  }
};

// Helper function to set loading state
const setLoading = (isLoading) => {
  if (proceedBtn) {
    proceedBtn.disabled = isLoading;
    proceedBtn.textContent = isLoading ? "Loading..." : "Get Quote";
  }
};

// Clear all error messages
const clearErrors = () => {
  const errorElements = document.querySelectorAll(".error");
  errorElements.forEach((el) => (el.textContent = ""));
};

// Validate form inputs
const validateForm = () => {
  clearErrors();
  let isValid = true;

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const numPassengers = document.getElementById("numPassengers").value.trim();
  const pickupLocation = document.getElementById("pickupLocation").value.trim();
  const dropoffLocation = document
    .getElementById("dropoffLocation")
    .value.trim();
  const startDateTime = document.getElementById("startDateTime").value;
  const endDateTime = document.getElementById("endDateTime").value;

  // Full Name validation
  if (!fullName) {
    document.getElementById("fullNameError").textContent =
      "Full name is required";
    isValid = false;
  }

  // Email validation
  if (!email) {
    document.getElementById("emailError").textContent = "Email is required";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById("emailError").textContent =
      "Please enter a valid email";
    isValid = false;
  }

  // Phone validation
  if (!phone) {
    document.getElementById("phoneError").textContent =
      "Phone number is required";
    isValid = false;
  }

  // Number of passengers validation
  if (!numPassengers || parseInt(numPassengers) < 1) {
    document.getElementById("numPassengersError").textContent =
      "Please enter at least 1 passenger";
    isValid = false;
  }

  // Pickup location validation
  if (!pickupLocation) {
    document.getElementById("pickupLocationError").textContent =
      "Pickup location is required";
    isValid = false;
  }

  // Dropoff location validation
  if (!dropoffLocation) {
    document.getElementById("dropoffLocationError").textContent =
      "Dropoff location is required";
    isValid = false;
  }

  // Start date validation
  if (!startDateTime) {
    document.getElementById("startDateTimeError").textContent =
      "Start date & time is required";
    isValid = false;
  }

  // End date validation
  if (!endDateTime) {
    document.getElementById("endDateTimeError").textContent =
      "End date & time is required";
    isValid = false;
  }

  // Check if end date is after start date
  if (
    startDateTime &&
    endDateTime &&
    new Date(endDateTime) <= new Date(startDateTime)
  ) {
    document.getElementById("endDateTimeError").textContent =
      "End date must be after start date";
    isValid = false;
  }

  return isValid;
};

// Calculate distance using a simple formula (for demo purposes)
// In production, use Google Maps API or similar
const calculateDistance = (pickup, dropoff) => {
  // For demo, return a fixed distance
  // In production, integrate with Google Maps Distance Matrix API
  const distances = {
    lekki: { "victoria island": 14.5, ikoyi: 12.3, maryland: 8.5 },
    "victoria island": { lekki: 14.5, ikoyi: 5.2, maryland: 10.8 },
    ikoyi: { lekki: 12.3, "victoria island": 5.2, maryland: 15.6 },
    maryland: { lekki: 8.5, "victoria island": 10.8, ikoyi: 15.6 },
  };

  const pickupLower = pickup.toLowerCase();
  const dropoffLower = dropoff.toLowerCase();

  // Try to find the distance in our lookup table
  if (distances[pickupLower] && distances[pickupLower][dropoffLower]) {
    return distances[pickupLower][dropoffLower];
  }

  // Default distance for locations not in our lookup table
  return 14.5;
};

// Handle form submission
if (passengerForm) {
  passengerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      displayMessage("Please fill all required fields correctly", "error");
      return;
    }

    // Get form values
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const numPassengers = parseInt(
      document.getElementById("numPassengers").value,
    );
    const pickupLocation = document
      .getElementById("pickupLocation")
      .value.trim();
    const dropoffLocation = document
      .getElementById("dropoffLocation")
      .value.trim();
    const startDateTime = document.getElementById("startDateTime").value;
    const endDateTime = document.getElementById("endDateTime").value;
    const instructions = document.getElementById("instructions").value.trim();

    // Get booking data from localStorage
    let bookingData = JSON.parse(localStorage.getItem("bookingData")) || {};
    const vehicleId = bookingData.vehicleId;

    if (!vehicleId) {
      displayMessage(
        "Vehicle not selected. Please go back and select a vehicle.",
        "error",
      );
      return;
    }

    // Calculate distance
    const distance = calculateDistance(pickupLocation, dropoffLocation);

    // Prepare payload for pricing API
    const pricingPayload = {
      vehicleId: vehicleId,
      distance: distance,
      pickupLocation: pickupLocation,
    };

    setLoading(true);
    displayMessage("Calculating quote...", "info");

    try {
      // Call pricing endpoint
      const pricingResponse = await fetch(PRICING_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pricingPayload),
      });

      const pricingData = await pricingResponse.json();

      if (!pricingResponse.ok) {
        throw new Error(pricingData.message || "Failed to get quote");
      }

      // Extract pricing details from response
      const quote = pricingData.data || pricingData;
      const basePrice = Number(quote.basePrice) || 0;
      const distanceCost = Number(quote.distanceCost) || 0;
      const locationSurcharge = Number(quote.locationSurcharge) || 0;
      const timeSurcharge = Number(quote.timeSurcharge) || 0;
      const total =
        Number(quote.total) ||
        basePrice + distanceCost + locationSurcharge + timeSurcharge;

      // Helper function to convert datetime-local to ISO format
      const convertToISO = (dateTimeLocal) => {
        if (!dateTimeLocal) return "";
        // datetime-local format: "2026-04-01T08:00"
        // We need to convert to ISO format: "2026-04-01T08:00:00Z"
        const date = new Date(dateTimeLocal);
        return date.toISOString();
      };

      // Save all data to localStorage for the next step
      bookingData.passengerName = fullName;
      bookingData.passengerEmail = email;
      bookingData.passengerPhone = phone;
      bookingData.numberOfPassengers = numPassengers;
      bookingData.startDate = convertToISO(startDateTime);
      bookingData.endDate = convertToISO(endDateTime);
      bookingData.pickupLocation = pickupLocation;
      bookingData.dropoffLocation = dropoffLocation;
      bookingData.instructions = instructions;
      bookingData.distance = distance;

      // Save pricing details
      bookingData.pricing = {
        basePrice: basePrice,
        distanceCost: distanceCost,
        locationSurcharge: locationSurcharge,
        timeSurcharge: timeSurcharge,
        total: total,
        depositAmount: total * 0.3, // 30% deposit
      };

      console.log("✅ Quote Response:", quote);
      console.log("✅ Booking Data Pricing:", bookingData.pricing);

      localStorage.setItem("bookingData", JSON.stringify(bookingData));

      setLoading(false);
      displayMessage(
        "Quote calculated successfully! Redirecting...",
        "success",
      );

      // Redirect to deposit page after a short delay
      setTimeout(() => {
        window.location.href = "../deposit-payment/deposit.html";
      }, 1500);
    } catch (error) {
      console.error("Pricing API error:", error);
      setLoading(false);
      displayMessage(
        error.message || "Failed to get quote. Please try again.",
        "error",
      );
    }
  });
}

// Load saved data on page load
window.addEventListener("load", () => {
  const bookingData = JSON.parse(localStorage.getItem("bookingData"));

  if (bookingData) {
    if (bookingData.passengerName)
      document.getElementById("fullName").value = bookingData.passengerName;
    if (bookingData.passengerEmail)
      document.getElementById("email").value = bookingData.passengerEmail;
    if (bookingData.passengerPhone)
      document.getElementById("phone").value = bookingData.passengerPhone;
    if (bookingData.numberOfPassengers)
      document.getElementById("numPassengers").value =
        bookingData.numberOfPassengers;
    if (bookingData.pickupLocation)
      document.getElementById("pickupLocation").value =
        bookingData.pickupLocation;
    if (bookingData.dropoffLocation)
      document.getElementById("dropoffLocation").value =
        bookingData.dropoffLocation;
    if (bookingData.startDate)
      document.getElementById("startDateTime").value = bookingData.startDate;
    if (bookingData.endDate)
      document.getElementById("endDateTime").value = bookingData.endDate;
    if (bookingData.instructions)
      document.getElementById("instructions").value = bookingData.instructions;
  }
});
