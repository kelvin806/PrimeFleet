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

/**
 * PrimeFleet Payment Logic
 * Handles display, copying, and simulated API verification.
 */

// 1. Function to fill the details dynamically
function displayPaymentInfo() {
  // These would eventually come from the previous page or an API
  const accountNum = "9130395721";
  const totalAmount = "27,150";

  const accElem = document.getElementById('accountNumber');
  const amtElem = document.getElementById('depositAmount');

  if (accElem) accElem.innerText = accountNum;
  if (amtElem) amtElem.innerText = "₦" + totalAmount;
}

// 2. Simple Copy to Clipboard Feature
function setupCopyBtn() {
  const btn = document.getElementById('copyBtn');

  if (btn) {
    btn.addEventListener('click', () => {
      const num = document.getElementById('accountNumber').innerText;
      navigator.clipboard.writeText(num);

      // Visual feedback for the user
      const originalText = btn.innerText;
      btn.innerText = "Saved!";
      setTimeout(() => { btn.innerText = originalText; }, 2000);
    });
  }
}

// 3. The "Completed" Button with Simulated API Check
function handleTransferCompletion() {
  const mainBtn = document.getElementById('completeBtn');

  if (mainBtn) {
    mainBtn.addEventListener('click', () => {
      // Show the user we are "talking" to the server
      mainBtn.innerText = "Checking Server...";
      mainBtn.disabled = true;

      /**
       * This 'apiResponse' simulates a real backend check.
       * Change it to "fail" to see how the code protects the app!
       */
      const apiResponse = "fail";

      // Simulate the time it takes for a server to respond (2 seconds)
      setTimeout(() => {
        if (apiResponse === "success") {
          alert("Success! PrimeFleet has received your payment notification.");
          // Move to the next page
          window.location.href = "../Booking confirmation/index.html";
        } else {
          // This blocks the user if the "server" says no
          alert("Verification Failed: We haven't seen the transfer yet. Please try again in a few minutes.");
          mainBtn.innerText = "I have completed my transfer";
          mainBtn.disabled = false;
        }
      }, 2000);
    });
  }
}

// Run everything once the page is fully loaded
window.onload = () => {
  displayPaymentInfo();
  setupCopyBtn();
  handleTransferCompletion();
};