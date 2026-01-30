const bookings = [
    { id: "PF-20237", client: "Ubong Eze", service: "Event", date: "12/3/2026", time: "03:25PM", status: "pending", deposit: "Pending" },
    { id: "PF-20238", client: "Tola Adeyemi", service: "Airport", date: "25/3/2026", time: "07:00AM", status: "cancelled", deposit: "Pending" },
    { id: "PF-20239", client: "Mallam Saliu", service: "Airport", date: "28/3/2026", time: "11:00AM", status: "assigned", deposit: "Confirmed" },
    { id: "PF-20240", client: "Abbey Idowu", service: "Event", date: "31/3/2026", time: "06:30PM", status: "completed", deposit: "Completed" },
    { id: "PF-20240", client: "Abbey Idowu", service: "Event", date: "31/3/2026", time: "06:30PM", status: "completed", deposit: "Completed" },
    { id: "PF-20240", client: "Abbey Idowu", service: "Event", date: "31/3/2026", time: "06:30PM", status: "completed", deposit: "Completed" },
    { id: "PF-20240", client: "Abbey Idowu", service: "Event", date: "31/3/2026", time: "06:30PM", status: "completed", deposit: "Completed" },
    { id: "PF-20240", client: "Abbey Idowu", service: "Event", date: "31/3/2026", time: "06:30PM", status: "completed", deposit: "Completed" },

    // Add as many as you want here...
];


const tableBody = document.getElementById('booking-table-body');

function loadTableData(data) {
    tableBody.innerHTML = ""; // Clear existing content

    data.forEach(booking => {
        const row = `
            <tr>
                <td>${booking.id}</td>
                <td class="client-name">${booking.client}</td>
                <td>${booking.service}</td>
                <td>${booking.date}</td>
                <td>${booking.time}</td>
                <td><span class="status ${booking.status}">${capitalize(booking.status)}</span></td>
                <td class="deposit-status">${booking.deposit}</td>
                <td><a href="booking-details.html?id=${booking.id}" class="view-details">Booking Details</a></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Simple helper to capitalize the first letter for the UI
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Run the function
loadTableData(bookings);



// 1. Get references to the input and the table body
const searchInput = document.getElementById('booking-search');

// 2. Create the Search Function
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase(); // Get text and make it lowercase

    // 3. Filter the original bookings array
    const filteredBookings = bookings.filter(booking => {
        return (
            booking.client.toLowerCase().includes(searchTerm) ||
            booking.id.toLowerCase().includes(searchTerm) ||
            booking.service.toLowerCase().includes(searchTerm) ||
            booking.status.toLowerCase().includes(searchTerm)
        )
    });

    // 4. Re-render the table with the filtered results
    loadTableData(filteredBookings);
});


// Grab the button
const addBookingBtn = document.querySelector('.btn-add-booking');

// Add a temporary "Work in Progress" message
addBookingBtn.addEventListener('click', () => {
    alert("Add Booking System: This will open the entry form. (Waiting for final design templates)");
});

// Grab the button
const editBookingBtn = document.querySelector('.btn-edit-booking');

// Add a temporary "Work in Progress" message
editBookingBtn.addEventListener('click', () => {
    alert("edit Booking System: This will open the entry form. (Waiting for final design templates)");
});