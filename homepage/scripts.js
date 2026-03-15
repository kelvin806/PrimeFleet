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