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
document.addEventListener('DOMContentLoaded', () => {
    const routeForm = document.getElementById('route-form');
    
    // Initialize a basic map centered on a general area (e.g., Nigeria)
    const map = L.map('map').setView([9.082, 8.675], 6); 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    let polyline;

    routeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const pickup = document.getElementById('pick-up').value;
        const destination = document.getElementById('drop-off').value;

        try {
            // 1. Get Coordinates for both locations
            const [resP, resD] = await Promise.all([
                fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pickup)}`),
                fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`)
            ]);
            
            const [dataP, dataD] = await Promise.all([resP.json(), resD.json()]);

            if (dataP.length > 0 && dataD.length > 0) {
                const loc1 = [dataP[0].lat, dataP[0].lon];
                const loc2 = [dataD[0].lat, dataD[0].lon];

                // 2. Draw on Map
                if (polyline) map.removeLayer(polyline);
                polyline = L.polyline([loc1, loc2], {color: 'blue'}).addTo(map);
                map.fitBounds(polyline.getBounds());

                // 3. Get Real Road Distance from OSRM
                const routeRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${loc1[1]},${loc1[0]};${loc2[1]},${loc2[0]}?overview=false`);
                const routeData = await routeRes.json();
                
                // Convert meters to Kilometers
                const distanceKM = (routeData.routes[0].distance / 1000).toFixed(2);

                // 4. Update the Snowball
                let bookingData = JSON.parse(localStorage.getItem('bookingData')) || {};
                
                bookingData.pickup = pickup;
                bookingData.destination = destination;
                bookingData.distance = parseFloat(distanceKM); 
                bookingData.date = document.getElementById('trip-date').value;
                bookingData.time = document.getElementById('trip-time').value;
                bookingData.duration = document.getElementById('trip-duration').value;
                bookingData.passengers = document.getElementById('passenger-count').value;

                localStorage.setItem('bookingData', JSON.stringify(bookingData));

                alert(`Distance calculated: ${distanceKM} km. Proceeding to vehicle selection...`);
                window.location.href = "../vehicle-selection/vehicle selection.html";
            } else {
                alert("Could not find one of the locations. Try adding the city or country name.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Connection error. Using default distance of 1.");
        }
    });
});