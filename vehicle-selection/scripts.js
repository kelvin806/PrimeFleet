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


// 1. MOCK DATA: This is the data the API will eventually provide
let vehicleData = [];

const API_URL = "https://primefleet-mvp.onrender.com/api/v1";

async function loadVehicles() {
    try {
        const res = await fetch(`${API_URL}/vehicles`);
        const data = await res.json();

        console.log("API RESPONSE:", data);

        // 🔥 Find the actual array dynamically
        const vehiclesArray = Array.isArray(data)
            ? data
            : data.data || data.vehicles || [];

        if (!Array.isArray(vehiclesArray)) {
            throw new Error("Vehicles data is not an array");
        }

        vehicleData = vehiclesArray.map(vehicle => ({
            id: vehicle.id || vehicle._id,
            brand: vehicle.make,
            model: vehicle.model,
            price: vehicle.pricePerDay,
            passengers: 4,
            luggages: 2,
            type: vehicle.vehicleType?.toLowerCase(),
            img: vehicle.photoUrl
        }));

        displayVehicles(vehicleData);

    } catch (err) {
        console.error("Failed to load vehicles:", err);
    }
}
// This array stores the cars the user selects
let selectedFleet = [];

// 2. RENDER FUNCTION: This builds the HTML cards dynamically
function displayVehicles(cars) {
    const container = document.getElementById('vehicle-container');
    if (!container) return;

    container.innerHTML = "";

    cars.forEach(car => {

        const imageUrl = car.img && car.img !== "null"
            ? car.img
            : "./images/select 2.png";

        const cardHTML = `
            <div class="car-card">
                <img src="${imageUrl}" alt="${car.brand} ${car.model}">
                <h3>${car.brand} ${car.model}</h3>
                <p>${car.passengers} Passengers • ${car.luggages} Luggages</p>
                <h4>N${car.price.toLocaleString()}</h4>
                <button class="add-btn" onclick="addToFleet('${car.id}')">Add</button>
            </div>
        `;

        container.innerHTML += cardHTML;
    });
}

// 3. FILTER LOGIC: Triggered by your All, SUV, Sedan, Van, Bus buttons
function filterVehicles(category) {
    // Update button visual state
    const buttons = document.querySelectorAll('.buttons button');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'all') {
        displayVehicles(vehicleData);
    } else {
        const filtered = vehicleData.filter(car => car.type === category);
        displayVehicles(filtered);
    }
}

// 4. ADD TO FLEET LOGIC
// Keep your global array at the top of scripts.js

async function addToFleet(vehicleId) {
    // Find the car object
    const car = vehicleData.find(v => v.id === vehicleId);
    if (!car) return alert("Car not found!");

    // Ensure token exists
    const token = localStorage.getItem("token");
    if (!token) return alert("No token found. Please login.");


    // Load bookingData safely
    let bookingData = JSON.parse(localStorage.getItem('bookingData')) || {};
    if (!Array.isArray(bookingData.vehicles)) bookingData.vehicles = [];
    if (typeof bookingData.total !== 'number') bookingData.total = 0;

    const distance = bookingData.distance || 1;
    const pickupLocation = bookingData.pickupLocation || "Lekki";

    console.log("updated bookingData:", bookingData);
    localStorage.setItem('bookingData', JSON.stringify(bookingData));

    try {
        // Fetch quote from API
        const res = await fetch(`${API_URL}/bookings/quote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                vehicleId: car.id,
                distance: distance,
                pickupLocation: pickupLocation
            })
        });

        const quote = await res.json();
        console.log("Quote response:", quote);

        const price = quote.data?.total ?? 0;

        console.log(quote.data);

        // Add car to vehicles array with actual price
        bookingData.vehicles.push({
            vehicle: `${car.brand} ${car.model}`,
            vehicleId: car.id,
            price: price,
            basePrice : quote.data.basePrice,
            distanceCost: quote.data.distanceCost,
            durationCost: quote.datatimeSurcharge || 0
        });

        // Recalculate total
        bookingData.total = bookingData.vehicles.reduce((sum, v) => sum + v.price, 0);

        // Save updated bookingData
        localStorage.setItem('bookingData', JSON.stringify(bookingData));

        // Show checkout area
        document.getElementById('checkout-area').style.display = 'block';

        updateFleetSummary(bookingData);

    } catch (err) {
        console.error("Quote error:", err);
        alert("Failed to calculate price. Try again.");
    }
}


function updateFleetSummary(bookingData) {
    const countEl = document.getElementById('car-count');
    const totalEl = document.getElementById('total-price');

    const totalCars = bookingData.vehicles.length;
    const totalPrice = bookingData.total;

    if (countEl) countEl.textContent = totalCars;
    if (totalEl) totalEl.textContent = totalPrice.toLocaleString();
}

// 5. INITIALIZE: Run this when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadVehicles();

    let bookingData = JSON.parse(localStorage.getItem('bookingData')) || {};

    bookingData.vehicles = [];
    bookingData.total = 0;

    localStorage.setItem('bookingData', JSON.stringify(bookingData));

    updateFleetSummary(bookingData);

    document.getElementById('checkout-area').style.display = 'block';

});

function goToPayment() {
    window.location.href = "../quote-summary/quote summary.html";
}