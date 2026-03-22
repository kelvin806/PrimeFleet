// vehicle-edit.js

document.addEventListener('DOMContentLoaded', () => {
    // Vehicle Type Buttons
    const typeButtons = document.querySelectorAll('.vehicle-types button');
    typeButtons.forEach(button => {
        button.addEventListener('click', () => {
            typeButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    // Add styles for selected button
    const style = document.createElement('style');
    style.innerHTML = `
        .vehicle-types button.selected {
            background-color: #0b2a4a;
            color: white;
            border-color: #0b2a4a;
        }
    `;
    document.head.appendChild(style);
});

document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.querySelector('.add');
    addBtn.addEventListener('click', () => {

        // Selected vehicle type
        const selectedTypeBtn = document.querySelector('.vehicle-types button.selected');
        const vehicleType = selectedTypeBtn ? selectedTypeBtn.textContent : '';

        // Other input values
        const model = document.querySelector('input[type="text"]').value;
        const plate = document.querySelectorAll('input[type="text"]')[1].value;
        const capacity = document.querySelector('input[type="number"]').value;
        const driver = document.querySelector('.driver-select').value;
        const status = document.querySelector('input[name="status"]:checked')?.parentElement.textContent.trim();

        if (!vehicleType || !model || !plate || !capacity || !driver || !status) {
            alert('Please fill out all fields!');
            return;
        }

        // Show captured data (for now)
        console.log({
            vehicleType,
            model,
            plate,
            capacity,
            driver,
            status
        });

        alert(`Vehicle ${vehicleType} - ${model} added successfully!`);
    });
});

const cancelBtn = document.querySelector('.cancel');
cancelBtn.addEventListener('click', () => {
    document.querySelectorAll('input').forEach(input => input.value = '');
    document.querySelectorAll('input[name="status"]').forEach(r => r.checked = false);
    document.querySelector('.driver-select').selectedIndex = 0;
    document.querySelectorAll('.vehicle-types button').forEach(btn => btn.classList.remove('selected'));
});