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


// Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {
  const routeForm = document.getElementById('route-form');

  routeForm.addEventListener('submit', (e) => {
    // 1. Prevent the page from reloading immediately
    e.preventDefault();

    // 2. Capture the data from the inputs
    const tripDetails = {
      pickup: document.getElementById('pick-up').value,
      dropoff: document.getElementById('drop-off').value,
      date: document.getElementById('trip-date').value,
      time: document.getElementById('trip-time').value,
      passengers: document.getElementById('passenger-count').value,
      timestamp: new Date().getTime() // Good for backend tracking later
    };

    // 3. Professional Validation: Make sure no field is empty
    if (!tripDetails.pickup || !tripDetails.dropoff) {
      alert("Please fill in all locations!");
      return;
    }

    // 4. Save to LocalStorage (The "Memory")
    // We turn the object into a string so the browser can store it
    localStorage.setItem('userTripDetails', JSON.stringify(tripDetails));

    console.log("Trip Details Saved:", tripDetails);

    // 5. Move to the next page (Vehicle Selection)
    window.location.href = "../vehicle-selection/vehicle selection.html";
  });
});