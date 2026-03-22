// vehicle-management.js

window.addEventListener('DOMContentLoaded', () => {
  console.log('JS file loaded');

  const searchInput = document.getElementById('vehicle-search');
  const tableBody = document.getElementById('booking-table-body');

  searchInput.addEventListener('input', () => {
    const filter = searchInput.value.toLowerCase();
    const rows = tableBody.getElementsByTagName('tr');
    
    for (let row of rows) {
      const vehicleId = row.cells[0].textContent.toLowerCase();
      const type = row.cells[1].textContent.toLowerCase();
      row.style.display = vehicleId.includes(filter) || type.includes(filter) ? '' : 'none';
    }
  });
});

document.querySelector('.btn-add-booking').addEventListener('click', () => {
    alert('Add Vehicle button clicked');
});