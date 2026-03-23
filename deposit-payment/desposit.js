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
 * PrimeFleet Deposit Page Logic
 * Features: Payment method toggle, 30% deposit display, and transfer verification
 */


// const API_URL = "https://primefleet-mvp.onrender.com/api/v1";

// --- 1. GLOBAL HELPERS ---
function formatNaira(amount) {
    const val = parseFloat(amount);
    if (isNaN(val)) return "₦0.00";
    return "₦" + val.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// --- 2. CORE FUNCTIONS ---

function displayPaymentInfo() {
    // Get the data saved from the Quote Summary page bridge
    const savedData = JSON.parse(localStorage.getItem('bookingData'));
    const amtElem = document.getElementById('depositAmount');
    const accElem = document.getElementById('accountNumber');

    // Display static account number from your HTML
    if (accElem) accElem.innerText = "9130395721";

    // Display the dynamic 30% deposit amount calculated on the summary page
    if (amtElem) {
        if (savedData && savedData.depositAmount) {
            amtElem.innerText = formatNaira(savedData.depositAmount);
        } else {
            amtElem.innerText = "₦0.00";
            console.warn("No deposit amount found. Ensure you clicked 'Proceed' on the summary page.");
        }
    }
}

function setupPaymentToggle() {
    const cardRadio = document.getElementById('cardPayment');
    const bankRadio = document.getElementById('bankTransfer');
    const comingSoon = document.querySelector('.coming'); // Matches your class "coming"
    const transferSection = document.querySelector('.transfer'); // Matches your class "transfer"

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
    if (cardRadio) cardRadio.addEventListener('change', updateVisibility);
    if (bankRadio) bankRadio.addEventListener('change', updateVisibility);

    // Run once on load to set default (Card = Coming Soon)
    updateVisibility();
}

async function handleCompletion() {
    const savedData = JSON.parse(localStorage.getItem('bookingData'));
    if (!savedData || !savedData.depositAmount) {
        alert("Booking data missing. Please restart from the home page.");
        return;
    }

    const required = parseFloat(savedData.depositAmount);
    const userEntry = prompt("Please enter the exact amount you transferred:");

    if (!userEntry) return;

    // Clean input: remove ₦, commas, and spaces
    const entryNumber = parseFloat(userEntry.replace(/[^\d.]/g, ''));

    if (isNaN(entryNumber)) {
        alert("Please enter a valid number.");
        return;
    }

    // Verification check (allowing for tiny rounding differences)
    if (Math.abs(entryNumber - required) < 1) {
        alert(`Success! Your payment of ${formatNaira(required)} is being verified.`);
        window.location.href = '../Booking%20Confirmation/booking-confirmation.html?status=paid';
    } else {
        alert(`Amount mismatch! Expected: ${formatNaira(required)}\nYou entered: ${formatNaira(entryNumber)}`);
    }
}

// --- 3. PAGE INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Display the calculated money
    displayPaymentInfo();

    // 2. Setup the Card vs Bank Transfer toggle
    setupPaymentToggle();

    // 3. Setup Copy Button
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const num = document.getElementById('accountNumber').innerText;
            navigator.clipboard.writeText(num).then(() => {
                alert("Account number copied!");
            });
        });
    }
});

const API_URL = "https://primefleet-mvp.onrender.com/api/v1";

document.addEventListener('DOMContentLoaded', () => {
    const confirmBtn = document.querySelector('.payment-btn');

    confirmBtn.addEventListener('click', async () => {
        const bookingData = JSON.parse(localStorage.getItem('bookingData'));

        if (!bookingData || !bookingData.vehicles || bookingData.vehicles.length === 0) {
            alert("No booking found.");
            return;
        }

        // 🔥 GET REFERENCE FROM FIRST VEHICLE
        const reference = bookingData.vehicles[0].reference;

        if (!reference) {
            alert("Booking reference not found.");
            console.log("bookingData:", bookingData);
            return;
        }
        const deposit = bookingData.depositAmount;

        const input = prompt(`Enter amount you sent (Deposit: N${Math.round(deposit).toLocaleString()})`);
        const amount = Number(input?.replace(/,/g, ''));

        if (isNaN(amount)) {
            alert("Invalid amount.");
            return;
        }

        if (amount < deposit) {
            alert(`Amount is less than required deposit of N${Math.round(deposit).toLocaleString()}`);
            return;
        }

        // 🔥 THIS IS THE REAL BACKEND CALL YOU HAVE
        try {
            const res = await fetch(`${API_URL}/bookings/reference/${reference}`);
            const data = await res.json();

            console.log("Booking lookup:", data);

            if (res.ok && data.success) {
                alert("Payment submitted. Booking is being processed.");
                localStorage.removeItem('bookingData');

                // 👉 Move to confirmation page
                window.location.href = "../Booking confirmation/booking-confirmation.html";
            } else {
                alert("Could not verify booking. Try again.");
            }

        } catch (err) {
            console.error(err);
            alert("Network error. Try again.");
        }
    });
});