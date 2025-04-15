// Google Maps Integration
function initMap() {
    if (!document.getElementById('map')) return;
    
    // Elevator installation locations
    const locations = [
        { 
            name: 'Skyline Tower', 
            position: { lat: 25.2048, lng: 55.2708 }, // Dubai
            icon: 'building',
            address: '123 Business Avenue, Dubai, UAE'
        },
        { 
            name: 'Grand Plaza Hotel',
            position: { lat: 51.5074, lng: -0.1278 }, // London
            icon: 'hotel',
            address: '456 Hospitality Blvd, London, UK'
        },
        { 
            name: 'Innovation Center',
            position: { lat: 1.3521, lng: 103.8198 }, // Singapore
            icon: 'city',
            address: '789 Tech Park, Singapore'
        },
        { 
            name: 'MetroTech',
            position: { lat: 40.7128, lng: -74.0060 }, // New York
            icon: 'subway',
            address: '321 Metro Station, New York, USA'
        },
        { 
            name: 'Residence Heights',
            position: { lat: 48.8566, lng: 2.3522 }, // Paris
            icon: 'home',
            address: '567 Luxury Blvd, Paris, France'
        }
    ];
    
    // Default map center (world view)
    const mapCenter = { lat: 25, lng: 10 };
    
    // Map styles for dark mode
    const darkMapStyle = [
        { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
        },
        {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#263c3f' }]
        },
        {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#6b9a76' }]
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e' }]
        },
        {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37' }]
        },
        {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca5b3' }]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#746855' }]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#1f2835' }]
        },
        {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#f3d19c' }]
        },
        {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#2f3948' }]
        },
        {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }]
        },
        {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#515c6d' }]
        },
        {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#17263c' }]
        }
    ];
    
    // Create map
    const map = new google.maps.Map(document.getElementById('map'), {
        center: mapCenter,
        zoom: 2,
        styles: document.body.classList.contains('dark-mode') ? darkMapStyle : [],
        mapTypeControl: false,
        streetViewControl: false
    });
    
    // Create markers for each location
    const markers = locations.map(location => {
        const marker = new google.maps.Marker({
            position: location.position,
            map: map,
            title: location.name,
            animation: google.maps.Animation.DROP,
            icon: {
                url: `assets/icons/${location.icon}.svg`,
                scaledSize: new google.maps.Size(30, 30)
            }
        });
        
        // Info window for each marker
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div class="map-info-window">
                    <h3>${location.name}</h3>
                    <p>${location.address}</p>
                    <a href="projects.html#${location.name.toLowerCase().replace(/\s+/g, '-')}" class="info-window-link">View Details</a>
                </div>
            `
        });
        
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
        
        return { marker, location };
    });
    
    // Location search functionality
    const searchBtn = document.getElementById('search-btn');
    const locationInput = document.getElementById('location-input');
    const locationsList = document.getElementById('locations-list');
    
    if (searchBtn && locationInput) {
        searchBtn.addEventListener('click', function() {
            const address = locationInput.value;
            if (!address) return;
            
            // Geocode the entered address
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address: address }, function(results, status) {
                if (status === 'OK' && results[0]) {
                    const userLocation = results[0].geometry.location;
                    
                    // Center map on user location
                    map.setCenter(userLocation);
                    map.setZoom(6);
                    
                    // Calculate distances to all elevator locations
                    markers.forEach(({ marker, location }) => {
                        const distance = google.maps.geometry.spherical.computeDistanceBetween(
                            userLocation,
                            marker.getPosition()
                        );
                        
                        // Convert distance to kilometers
                        location.distance = (distance / 1000).toFixed(1);
                    });
                    
                    // Sort locations by distance
                    const sortedLocations = [...markers].sort((a, b) => 
                        parseFloat(a.location.distance) - parseFloat(b.location.distance)
                    );
                    
                    // Update the locations list
                    locationsList.innerHTML = '';
                    sortedLocations.slice(0, 3).forEach(({ location }) => {
                        locationsList.innerHTML += `
                            <li class="location-item">
                                <div class="location-icon"><i class="fas fa-${location.icon}"></i></div>
                                <div class="location-details">
                                    <h4>${location.name}</h4>
                                    <p>${location.address}</p>
                                    <span class="location-distance">${location.distance} km away</span>
                                </div>
                            </li>
                        `;
                    });
                } else {
                    alert('Could not find that location. Please try a different address.');
                }
            });
        });
        
        // Allow enter key to trigger search
        locationInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
    
    // Switch map style when theme changes
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDarkMode = document.body.classList.contains('dark-mode');
            map.setOptions({
                styles: isDarkMode ? [] : darkMapStyle
            });
        });
    }
}
