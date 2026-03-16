// When the page loads, check if we already have data saved
window.onload = () => {
    const savedData = sessionStorage.getItem('currentPassenger');

    if (savedData) {
        const data = JSON.parse(savedData);
        // Put the saved data back into the input boxes
        document.getElementById('fullName').value = data.name || "";
        document.getElementById('email').value = data.email || "";
        document.getElementById('phone').value = data.phone || "";
        document.getElementById('notes').value = data.notes || "";
    }
};

// Grab the form and the button
const bookingForm = document.querySelector('.booking-form');
const proceedBtn = document.querySelector('.btn-proceed');

proceedBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Stop page from refreshing

    // 1. Collect the data from her IDs
    const passengerData = {
        name: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        notes: document.getElementById('notes').value
    };

    // 2. Validate (Leader move: don't send empty data!)
    if (!passengerData.name || !passengerData.email) {
        alert("Please fill in the required fields!");
        return;
    }

    // 3. Save to Session (Bridge to the next page)
    sessionStorage.setItem('currentPassenger', JSON.stringify(passengerData));

    console.log("Data saved! Ready for API:", passengerData);

    //  Move to the next page (Quote Summary)
    // window.location.href = "../homepage/homepage.html"; 

    // Show a success message instead
    alert("Passenger details saved successfully! Navigation will be linked after the merge.");
    console.log("READY FOR MERGE: Data is stored in session.");
});