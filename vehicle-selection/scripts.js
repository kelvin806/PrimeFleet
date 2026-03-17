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


// 1. MOCK DATA: This is the data the API will eventually provide
const vehicleData = [
    { id: 1, brand: "Nissan", model: "Rogue", price: 45000, passengers: 5, luggages: 3, type: "suv", img: "images/select 1.png" },
    { id: 2, brand: "Honda", model: "Pilot", price: 30000, passengers: 3, luggages: 2, type: "suv", img: "images/select 2.png" },
    { id: 3, brand: "Infiniti", model: "QX80", price: 25000, passengers: 5, luggages: 3, type: "suv", img: "images/select 3.png" },
    { id: 4, brand: "Lexus", model: "RX 350", price: 45000, passengers: 4, luggages: 3, type: "suv", img: "images/select 4.png" },
    { id: 5, brand: "BMW", model: "X5", price: 50000, passengers: 3, luggages: 3, type: "suv", img: "images/select 5.png" },
    { id: 6, brand: "Mercedes", model: "Sprinter", price: 55000, passengers: 10, luggages: 10, type: "van", img: "images/select 6.png" },
    { id: 7, brand: "Toyota", model: "Hiace", price: 40000, passengers: 14, luggages: 5, type: "bus", img: "images/select 2.png" }
];

// This array stores the cars the user selects
let selectedFleet = [];

// 2. RENDER FUNCTION: This builds the HTML cards dynamically
function displayVehicles(cars) {
    const container = document.getElementById('vehicle-container');
    if (!container) return; // Safety check
    
    container.innerHTML = ""; // Clear the section first

    cars.forEach(car => {
        // We use the exact HTML structure from your teammate's code
        const cardHTML = `
            <div class="car-card">
                <img src="${car.img}" alt="${car.brand} ${car.model}">
                <h3>${car.brand} ${car.model}</h3>
                <p>${car.passengers} Passengers • ${car.luggages} Luggages</p>
                <h4>₦${car.price.toLocaleString()}</h4>
                <button class="add-btn" onclick="addToFleet(${car.id})">Add</button>
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
function addToFleet(vehicleId) {
    const car = vehicleData.find(v => v.id === vehicleId);
    selectedFleet.push(car);
    
    // Save to LocalStorage so the Deposit Page can see it
    localStorage.setItem('userFleet', JSON.stringify(selectedFleet));
    
    // Make the "Confirm Fleet" button visible
    const checkoutArea = document.getElementById('checkout-area');
    if (checkoutArea) checkoutArea.style.display = 'block';
    
    alert(`${car.brand} added to fleet! Total: ${selectedFleet.length}`);
}

// 5. INITIALIZE: Run this when the page loads
document.addEventListener('DOMContentLoaded', () => {
    displayVehicles(vehicleData);
});

function goToPayment() {
    window.location.href = "../deposit-payment/deposit.html";
}