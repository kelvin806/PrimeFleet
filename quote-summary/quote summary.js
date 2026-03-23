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

const API_URL = "https://primefleet-mvp.onrender.com/api/v1";


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

    const vehicles = data.vehicles || [];

    // 🔹 VEHICLE INFO
    const vehicleNames = vehicles.map(v => v.vehicle).join(", ");
    const vehicleCount = vehicles.length;

    // 🔹 VEHICLE TOTAL (this is what you actually stored)
    const vehicleTotal = vehicles.reduce((sum, v) => sum + (v.price || 0), 0);

    // 🔹 DISTANCE
    const distanceKM = parseFloat(data.distance) || 0;
    const distanceTotal = distanceKM * 150;

    // 🔹 DURATION
    const durationDays = parseInt(data.duration) || 1;
    const durationTotal = durationDays * 500;

    // 🔹 BASE PRICE (optional if you have it)
    const baseTotal = data.basePrice || 0;

    // 🔹 FINAL TOTAL
    const total = vehicleTotal + distanceTotal + durationTotal + baseTotal;

    // 🔹 DEPOSIT
    const deposit = total * 0.30;

    // ================= UI =================

    updateText("vehicle-val", vehicleNames || "N/A");
    updateText("num-veh-val", vehicleCount);

    updateText("service-val", data.service);
    updateText("pickup-val", data.pickupLocation || data.pickup);
    updateText("date-val", data.date);
    updateText("time-val", data.time);
    updateText("passengers-val", data.passengers);
    updateText("dest-val", data.destination);

    // 🔥 FIXED DURATION DISPLAY
    updateText("duration-val", `${durationDays} day(s)`);

    // 🔹 PRICING DISPLAY
    updateText("base-price-display", formatNaira(baseTotal));
    updateText("dist-cost-display", `+ ${formatNaira(distanceTotal)}`);
    updateText("dur-cost-display", `+ ${formatNaira(durationTotal)}`);
    updateText("veh-cost-display", `+ ${formatNaira(vehicleTotal)}`);
    updateText("total-price", formatNaira(total));

    // 🔹 DEPOSIT NOTE
    const depositNote = document.getElementById("deposit-note");
    if (depositNote) {
        depositNote.innerHTML = `Note: A 30% deposit of <strong>${formatNaira(deposit)}</strong> is required`;
    }

    // 🔹 SAVE (IMPORTANT: MERGE, DON’T DESTROY DATA)
    const updatedData = {
        ...data,
        totalAmount: total,
        depositAmount: deposit
    };

    localStorage.setItem("bookingData", JSON.stringify(updatedData));
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
});

// Fix: Redirection Logic for Payment Button
// Make sure this is at the top
// Make sure API_URL is defined at the top

const proceedBtn = document.querySelector('.pay-btn');
proceedBtn.addEventListener('click', async () => {
    let bookingData = JSON.parse(localStorage.getItem('bookingData'));
    if (!bookingData || !bookingData.vehicles?.length) return alert("No vehicles selected.");

    try {
        // Loop over each vehicle
        for (let v of bookingData.vehicles) {
            const res = await fetch(`${API_URL}/bookings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    vehicleId: v.vehicleId,           // single vehicle
                    passengerName: bookingData.passengerName,
                    passengerPhone: bookingData.passengerPhone,
                    passengerEmail: bookingData.passengerEmail,
                    numberOfPassengers: bookingData.passengers,
                    startDate: bookingData.startDate,
                    endDate: bookingData.endDate,
                    pickupLocation: bookingData.pickupLocation,
                    dropoffLocation: bookingData.destination,
                    distance: bookingData.distance,
                    instructions: bookingData.instructions,
                    amount: v.price                   // price for this vehicle
                })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                console.log("FULL BACKEND RESPONSE:", data);

                // 🔥 Extract reference properly
                const reference = data.data?.reference;

                if (!reference) {
                    alert("Booking created but no reference returned!");
                    console.error("Missing reference:", data);
                    return;
                }

                // 🔥 Load existing bookingData
                let bookingData = JSON.parse(localStorage.getItem('bookingData')) || {};

                // 🔥 Save reference + deposit
                bookingData.reference = reference;
                bookingData.depositAmount = bookingData.depositAmount; // keep your 30%
                bookingData.totalAmount = bookingData.totalAmount;

                // 🔥 SAVE IT BACK
                localStorage.setItem('bookingData', JSON.stringify(bookingData));

                console.log("SAVED bookingData:", bookingData);

                alert("Booking successful!");

                // 👉 NOW go to deposit page
                window.location.href = "../deposit-payment/deposit.html";
            } else {
                alert("Booking failed: " + (data.message || "Unknown error"));
            }
            // Save the booking reference returned by backend
            v.reference = data.data?.reference;
        }

        // Save updated bookingData with references
        localStorage.setItem('bookingData', JSON.stringify(bookingData));

        alert("All vehicles booked successfully! Proceeding to deposit payment.");
        window.location.href = '../deposit-payment/deposit.html';



    } catch (err) {
        console.error("Booking error:", err);
        alert("Network or server error. Try again later.");
    }
});
// Fix: Redirection Logic for Modifying booking Button
const modifybtn = document.querySelector('.modify-btn');
if (modifybtn) {
    modifybtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '../route-schedule/route.html';
    });
}