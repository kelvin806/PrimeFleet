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



// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const selectedService = button.getAttribute('data-service');

      // The Snowball Logic
      let bookingData = JSON.parse(localStorage.getItem('bookingData')) || {};
      bookingData.service = selectedService;
      localStorage.setItem('bookingData', JSON.stringify(bookingData));

      // Redirect
      window.location.href = '../passenger detail/passenger.html';
    });
  });

  
});



// document.querySelectorAll('.move-btn').forEach(button => {
//   button.addEventListener('click', () => {
//     window.location.href = '../passenger detail/index.html';
//   });
// });
