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
/**
 * PrimeFleet Deposit Page Logic
 * Features: Payment method toggle, 30% deposit display, and transfer verification
 */

// API Endpoints
const BOOKINGS_API = "https://primefleet-mvp.onrender.com/api/v1/bookings";

// --- 1. GLOBAL HELPERS ---
function formatNaira(amount) {
  const val = parseFloat(amount);
  if (isNaN(val)) return "₦0.00";
  return (
    "₦" +
    val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

function showMessage(message, type = "info") {
  const messageEl = document.getElementById("paymentMessage");
  if (!messageEl) {
    const tempEl = document.createElement("div");
    tempEl.id = "paymentMessage";
    tempEl.style.cssText =
      "padding: 12px 16px; margin: 20px; border-radius: 8px; text-align: center;";
    document
      .querySelector("main")
      .insertBefore(tempEl, document.querySelector("main").firstChild);
  }

  const el = document.getElementById("paymentMessage");
  el.textContent = message;
  el.className = `payment-message payment-message-${type}`;
  el.style.display = "block";
}

function setCompleteButtonLoading(isLoading) {
  const completeBtn = document.getElementById("completeBtn");
  if (completeBtn) {
    completeBtn.disabled = isLoading;
    completeBtn.textContent = isLoading
      ? "Processing..."
      : "I have completed my transfer";
  }
}

// --- 2. CORE FUNCTIONS ---

function displayPaymentInfo() {
  // Get the data saved from the Quote Summary page bridge
  const savedData = JSON.parse(localStorage.getItem("bookingData"));
  const amtElem = document.getElementById("depositAmount");
  const accElem = document.getElementById("accountNumber");

  console.log("📊 Saved Booking Data:", savedData);

  // Display static account number from your HTML
  if (accElem) accElem.innerText = "9130395721";

  // Display the dynamic 30% deposit amount calculated on the summary page
  if (amtElem) {
    if (savedData && savedData.pricing && savedData.pricing.depositAmount) {
      const depositAmount = savedData.pricing.depositAmount;
      console.log("💳 Deposit Amount from pricing:", depositAmount);
      amtElem.innerText = formatNaira(depositAmount);
    } else if (savedData && savedData.depositAmount) {
      const depositAmount = savedData.depositAmount;
      console.log("💳 Deposit Amount from legacy field:", depositAmount);
      amtElem.innerText = formatNaira(depositAmount);
    } else {
      amtElem.innerText = "₦0.00";
      console.warn(
        "⚠️ No deposit amount found. Ensure you clicked 'Get Quote' on the passenger details page.",
      );
    }
  }
}

function setupPaymentToggle() {
  const cardRadio = document.getElementById("cardPayment");
  const bankRadio = document.getElementById("bankTransfer");
  const comingSoon = document.querySelector(".coming"); // Matches your class "coming"
  const transferSection = document.querySelector(".transfer"); // Matches your class "transfer"

  const updateVisibility = () => {
    if (cardRadio && cardRadio.checked) {
      if (comingSoon) comingSoon.style.display = "block";
      if (transferSection) transferSection.style.display = "none";
    } else if (bankRadio && bankRadio.checked) {
      if (comingSoon) comingSoon.style.display = "none";
      if (transferSection) transferSection.style.display = "block";
    }
  };

  // Add listeners to radio buttons
  if (cardRadio) cardRadio.addEventListener("change", updateVisibility);
  if (bankRadio) bankRadio.addEventListener("change", updateVisibility);

  // Run once on load to set default (Card = Coming Soon)
  updateVisibility();
}

async function handleCompletion() {
  const savedData = JSON.parse(localStorage.getItem("bookingData"));

  if (!savedData) {
    showMessage(
      "Booking data missing. Please restart from the home page.",
      "error",
    );
    return;
  }

  // Get required fields from savedData
  const vehicleId = savedData.vehicleId;
  const passengerName = savedData.passengerName;
  const passengerPhone = savedData.passengerPhone;
  const passengerEmail = savedData.passengerEmail;
  const numberOfPassengers = parseInt(savedData.numberOfPassengers) || 1;
  const startDate = savedData.startDate;
  const endDate = savedData.endDate;
  const pickupLocation = savedData.pickupLocation;
  const dropoffLocation = savedData.dropoffLocation;
  const distance = Number(savedData.distance);
  const instructions = savedData.instructions || "";

  // Ensure amount is a number
  let amount = 0;
  if (savedData.pricing && savedData.pricing.total) {
    amount = Number(savedData.pricing.total);
  } else if (savedData.totalAmount) {
    amount = Number(savedData.totalAmount);
  }

  // Validate amount is a valid number
  if (isNaN(amount) || amount <= 0) {
    showMessage(
      "Invalid booking amount. Please go back and recalculate the quote.",
      "error",
    );
    return;
  }

  // Validate required fields
  if (
    !vehicleId ||
    !passengerName ||
    !passengerPhone ||
    !passengerEmail ||
    !startDate ||
    !endDate ||
    !pickupLocation ||
    !dropoffLocation
  ) {
    showMessage(
      "Missing required booking information. Please go back and complete all fields.",
      "error",
    );
    return;
  }

  if (Number.isNaN(distance) || distance <= 0) {
    showMessage(
      "Trip distance is missing. Please go back and recalculate your quote.",
      "error",
    );
    return;
  }

  // Format dates to ISO format (convert from datetime-local to UTC)
  const formatDateToISO = (dateTimeLocal) => {
    // If already in ISO format, return as is
    if (typeof dateTimeLocal === "string" && dateTimeLocal.includes("Z")) {
      return dateTimeLocal;
    }
    // If it's a datetime-local format, convert to ISO
    const date = new Date(dateTimeLocal);
    return date.toISOString();
  };

  // Prepare payload for bookings API
  const bookingPayload = {
    vehicleId: vehicleId,
    passengerName: passengerName,
    passengerPhone: passengerPhone,
    passengerEmail: passengerEmail,
    numberOfPassengers: numberOfPassengers,
    startDate: formatDateToISO(startDate),
    endDate: formatDateToISO(endDate),
    pickupLocation: pickupLocation,
    dropoffLocation: dropoffLocation,
    distance: distance,
    instructions: instructions,
    amount: amount,
  };

  console.log("📤 Booking Payload:", bookingPayload);
  console.log("💰 Amount Being Sent:", amount);

  setCompleteButtonLoading(true);
  showMessage("Creating your booking...", "info");

  try {
    // Call bookings endpoint
    const bookingResponse = await fetch(BOOKINGS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingPayload),
    });

    const bookingData = await bookingResponse.json();

    if (!bookingResponse.ok) {
      throw new Error(bookingData.message || "Failed to create booking");
    }

    // Save booking response
    const bookingResult = bookingData.data || bookingData;
    localStorage.setItem("lastBooking", JSON.stringify(bookingResult));

    setCompleteButtonLoading(false);
    showMessage(
      "Booking created successfully! Redirecting to confirmation...",
      "success",
    );

    // Redirect to booking confirmation page after a short delay
    setTimeout(() => {
      window.location.href =
        "../Booking%20confirmation/booking-confirmation.html?status=confirmed&bookingId=" +
        (bookingResult.id || "");
    }, 1500);
  } catch (error) {
    console.error("Booking API error:", error);
    setCompleteButtonLoading(false);
    showMessage(
      error.message || "Failed to create booking. Please try again.",
      "error",
    );
  }
}

// --- 3. PAGE INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  // 1. Display the calculated money
  displayPaymentInfo();

  // 2. Setup the Card vs Bank Transfer toggle
  setupPaymentToggle();

  // 3. Setup Copy Button
  const copyBtn = document.getElementById("copyBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const num = document.getElementById("accountNumber").innerText;
      navigator.clipboard.writeText(num).then(() => {
        alert("Account number copied!");
      });
    });
  }

  // 4. Setup "I have done the payment" button
  const completeBtn = document.getElementById("completeBtn");
  if (completeBtn) {
    completeBtn.addEventListener("click", handleCompletion);
  }
});
