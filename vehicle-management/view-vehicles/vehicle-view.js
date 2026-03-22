// vehicle-view.js

// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {

    // 1. Highlight ongoing/completed trips
    const rows = document.querySelectorAll('table tbody tr');
    rows.forEach(row => {
        const statusCell = row.cells[3]; // 4th column = Status
        if (statusCell.textContent.toLowerCase() === 'completed') {
            statusCell.style.color = 'green';
            statusCell.style.fontWeight = 'bold';
        } else if (statusCell.textContent.toLowerCase() === 'ongoing') {
            statusCell.style.color = 'orange';
            statusCell.style.fontWeight = 'bold';
        }
    });

    // 2. Sidebar active menu click (example)
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // 3. Example: alert vehicle info
    const vehicleHeader = document.querySelector('.vehicle-header');
    vehicleHeader.addEventListener('click', () => {
        alert('Vehicle details are displayed below.');
    });

});