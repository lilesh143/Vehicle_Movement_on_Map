const map = L.map('map').setView([37.7749, -122.4194], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

const carIcon = L.divIcon({
    className: 'car-icon',
    html: '<i class="fas fa-car"></i>',
    iconSize: [64, 64],
    iconAnchor: [32, 32],
});

const vehicleMarker = L.marker([37.7749, -122.4194], { icon: carIcon }).addTo(map);

let routeControl;
let routePoints = [];
const mapboxAccessToken = 'pk.eyJ1IjoibGlsZXNoIiwiYSI6ImNsemp4ZTc0MzB0aDIya3IxMXF1NWJvbzgifQ.E4mLxZLZCph5ohJB6rtW9w';

document.getElementById('show-route').addEventListener('click', () => {
    const tripType = document.getElementById('trip-select').value;
    let start, end;

    switch (tripType) {
        case 'today':
            start = [37.7749, -122.4194];
            end = [37.8049, -122.2711];
            break;
        case 'yesterday':
            start = [37.7700, -122.4300];
            end = [37.7740, -122.4340];
            break;
        case 'last-week':
            start = [37.7600, -122.4100];
            end = [37.7640, -122.4140];
            break;
        default:
            start = [37.7749, -122.4194];
            end = [37.8049, -122.2711];
            break;
    }

    if (routeControl) {
        map.removeControl(routeControl);
    }

    routeControl = L.Routing.control({
        waypoints: [
            L.latLng(start),
            L.latLng(end)
        ],
        router: L.Routing.mapbox(mapboxAccessToken),
        routeWhileDragging: true,
        lineOptions: {
            styles: [{
                color: 'blue',
                opacity: 0.8,
                weight: 5
            }]
        }
    }).addTo(map);

    routeControl.on('routesfound', function(e) {
        routePoints = e.routes[0].coordinates;
    });

    vehicleMarker.setLatLng(start);
    map.panTo(start);
});

document.getElementById('start-movement').addEventListener('click', () => {
    if (routePoints.length === 0) return;

    const totalDuration = 10000;
    const stepTime = totalDuration / routePoints.length;

    let index = 0;

    function move() {
        if (index < routePoints.length) {
            const latlng = L.latLng(routePoints[index].lat, routePoints[index].lng);

            vehicleMarker.setLatLng(latlng);
            map.panTo(latlng);

            index++;
            setTimeout(move, stepTime);
        }
    }

    move();
});