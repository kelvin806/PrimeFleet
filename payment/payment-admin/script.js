document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECT ELEMENTS
    const searchInput = document.querySelector('.search-bar');
    const tableRows = document.querySelectorAll('tbody tr');
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const filterBtn = document.querySelector('.filter-btn');

    // 2. SEARCH FUNCTIONALITY
    // This filters the table in real-time as you type
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        tableRows.forEach(row => {
            // Get text from Booking ID (1st cell) and Client Name (2nd cell)
            const bookingId = row.cells[0].textContent.toLowerCase();
            const clientName = row.cells[1].textContent.toLowerCase();

            if (bookingId.includes(searchTerm) || clientName.includes(searchTerm)) {
                row.style.display = ""; // Show row
            } else {
                row.style.display = "none"; // Hide row
            }
        });
    });

    // 3. SIDEBAR NAVIGATION TOGGLE
    // Handles changing the 'active' blue background when you click a menu item
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all
            sidebarItems.forEach(i => i.classList.remove('active'));
            // Add to the clicked one
            this.classList.add('active');
        });
    });

    // 4. DATE FILTER (SIMULATED)
    // In a real app, this would fetch new data. Here, we'll just show an alert.
    filterBtn.addEventListener('click', () => {
        const currentMonth = new Date().toLocaleString('default', { month: 'long' });
        alert(`Filtering records for ${currentMonth}...`);
    });

    // 5. RESPONSIVE MOBILE ADJUSTMENT
    // If on a small screen, auto-collapse the sidebar text for better view
    const adjustLayout = () => {
        if (window.innerWidth < 768) {
            console.log("Mobile View Active: Table is now scrollable.");
        }
    };

    window.addEventListener('resize', adjustLayout);
    adjustLayout();
});