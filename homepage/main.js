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



// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the service type from the data attribute
            const selectedService = button.getAttribute('data-service');

            // Save it to localStorage
            localStorage.setItem('userSelection', selectedService);

            console.log("Saved selection:", selectedService);

            // Optional: Redirect to the next page
            // window.location.href = 'booking.html'; 
        });
    });
});