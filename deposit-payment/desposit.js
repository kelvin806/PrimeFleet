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


// Select the radio buttons
const card = document.getElementById("cardPayment");
const bank = document.getElementById("bankTransfer");

// Select the sections we want to show or hide
const coming = document.querySelector(".coming");
const transfer = document.querySelector(".transfer");


// When CARD payment is selected
card.addEventListener("change", function () {

    // Show the coming soon message
    coming.style.display = "block";

    // Hide the bank transfer section
    transfer.style.display = "none";

});


// When BANK TRANSFER is selected
bank.addEventListener("change", function () {

    // Hide the coming soon message
    coming.style.display = "none";

    // Show the bank transfer section
    transfer.style.display = "block";

});