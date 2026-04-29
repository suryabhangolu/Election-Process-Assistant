import { CONFIG } from './config.js';
import { sanitizeInput } from './app.js';
import { trackSearch } from './analytics.js';

/**
 * @module maps
 * Google Maps integration for finding polling booths.
 */

const MOCK_BOOTHS = [
  { name: "Government School Booth 1", lat: 30.9010, lng: 75.8573, address: "Model Town, Ludhiana" },
  { name: "Community Hall Booth 2", lat: 30.8900, lng: 75.8700, address: "Sarabha Nagar, Ludhiana" },
  { name: "Panchayat Ghar Booth 3", lat: 30.9100, lng: 75.8400, address: "Dugri, Ludhiana" }
];

let mapLoaded = false;
let googleMap = null;
let mapMarkers = [];

/**
 * Initializes the Google Map instance and loads the API script dynamically.
 * Validates API key and handles fallback mode if unavailable.
 */
export const initMap = () => {
    if (mapLoaded) return;
    mapLoaded = true;
    
    try {
        const apiKey = CONFIG.MAPS_API_KEY || "MISSING_KEY";
        const mapElement = document.getElementById('map');
        const boothForm = document.getElementById('booth-form');
        
        if (boothForm) {
            boothForm.addEventListener('submit', handleBoothSearch);
        }
        
        if (apiKey === "MISSING_KEY") {
            handleMapFailure("Google Maps API Key is missing. Operating in fallback mode. Please submit PIN to view text locations.");
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMapCallback`;
        script.async = true;
        script.defer = true;
        script.setAttribute('nonce', 'secure_nonce_123'); 
        script.onerror = () => handleMapFailure("Failed to connect to Google Maps API due to network/CSP error. Fallback mode enabled.");

        window.initMapCallback = () => {
            if (!mapElement) return;
            mapElement.innerHTML = ""; 
            
            try {
                googleMap = new google.maps.Map(mapElement, {
                    zoom: 5,
                    center: { lat: 20.5937, lng: 78.9629 },
                    disableDefaultUI: false,
                    styles: [
                        { elementType: "geometry", stylers: [{ color: "#2b1141" }] },
                        { elementType: "labels.text.stroke", stylers: [{ color: "#2b1141" }] },
                        { elementType: "labels.text.fill", stylers: [{ color: "#f0ebf5" }] }
                    ]
                });
                mapElement.setAttribute('aria-label', 'Google Map loaded. Awaiting PIN code search.');
            } catch (err) {
                console.error("Error creating Google Map instance:", err);
                handleMapFailure("Error initializing map.");
            }
        };
        
        document.head.appendChild(script);
    } catch (error) {
        console.error("Map initialization error:", error);
    }
};

/**
 * Handles the booth search form submission.
 * Validates input, tracks the search, and renders results.
 * @param {Event} e - The form submit event.
 */
const handleBoothSearch = (e) => {
    e.preventDefault();
    try {
        const pinInput = document.getElementById('pin-input');
        const errorDiv = document.getElementById('map-error');
        
        if (!pinInput || !errorDiv) return;

        const rawPin = sanitizeInput(pinInput.value); 
        
        errorDiv.classList.add('sr-only');
        errorDiv.textContent = "";

        if (!/^\d{6}$/.test(rawPin)) {
            errorDiv.textContent = "Invalid PIN code format. Please enter a 6-digit number.";
            errorDiv.classList.remove('sr-only');
            return;
        }

        if (rawPin !== "141001") {
            errorDiv.textContent = `No booths found for PIN ${rawPin}. Try '141001' for the demo.`;
            errorDiv.classList.remove('sr-only');
            trackSearch(rawPin);
            return;
        }

        trackSearch(rawPin);

        if (googleMap && typeof google !== 'undefined') {
            renderMapMarkers(MOCK_BOOTHS);
        } else {
            renderFallbackCards(MOCK_BOOTHS);
        }
        
        renderScreenReaderList(MOCK_BOOTHS);
    } catch (error) {
        console.error("Booth search handling error:", error);
    }
};

/**
 * Renders markers on the Google Map for the given booths.
 * @param {Array<Object>} booths - Array of booth data objects.
 */
const renderMapMarkers = (booths) => {
    if (!Array.isArray(booths)) return;
    
    try {
        mapMarkers.forEach(m => m.setMap(null));
        mapMarkers = [];
        
        const bounds = new google.maps.LatLngBounds();
        const infoWindow = new google.maps.InfoWindow();

        booths.forEach(booth => {
            const position = { lat: booth.lat, lng: booth.lng };
            const marker = new google.maps.Marker({
                position,
                map: googleMap,
                title: booth.name
            });
            
            bounds.extend(position);
            mapMarkers.push(marker);

            marker.addListener('click', () => {
                const content = `
                    <div style="color: black; padding: 5px;">
                        <h3 style="margin-bottom:5px; color:#12051f;">${booth.name}</h3>
                        <p><strong>Address:</strong> ${booth.address}</p>
                        <p><strong>Timing:</strong> 7:00 AM - 6:00 PM</p>
                    </div>
                `;
                infoWindow.setContent(content);
                infoWindow.open(googleMap, marker);
            });
        });

        googleMap.fitBounds(bounds);
        
        const listener = google.maps.event.addListener(googleMap, "idle", () => { 
            if (googleMap.getZoom() > 15) googleMap.setZoom(15); 
            google.maps.event.removeListener(listener); 
        });
    } catch (error) {
        console.error("Map markers rendering error:", error);
    }
};

/**
 * Renders fallback cards when the map API is unavailable.
 * @param {Array<Object>} booths - Array of booth data objects.
 */
const renderFallbackCards = (booths) => {
    if (!Array.isArray(booths)) return;

    try {
        const mapElement = document.getElementById('map');
        const fallbackDiv = document.getElementById('map-fallback');
        
        if (!fallbackDiv) return;

        if (mapElement) mapElement.style.display = 'none';
        fallbackDiv.classList.remove('hidden');
        
        fallbackDiv.innerHTML = booths.map(booth => `
            <article class="card" tabindex="0">
                <h3>${booth.name}</h3>
                <p style="margin-bottom:0.5rem;"><strong>📍 Location:</strong> ${booth.address}</p>
                <p><strong>🕒 Timing:</strong> 7:00 AM - 6:00 PM</p>
            </article>
        `).join('');
    } catch (error) {
        console.error("Fallback cards rendering error:", error);
    }
};

/**
 * Renders a list of booths for screen readers.
 * @param {Array<Object>} booths - Array of booth data objects.
 */
const renderScreenReaderList = (booths) => {
    if (!Array.isArray(booths)) return;

    try {
        const srList = document.getElementById('sr-booth-list');
        if (srList) {
            srList.innerHTML = booths.map(booth => `
                <li>${booth.name}, located at ${booth.address}. Open 7 AM to 6 PM.</li>
            `).join('');
        }
    } catch (error) {
        console.error("Screen reader list rendering error:", error);
    }
};

/**
 * Handles map initialization failures by displaying an error placeholder.
 * @param {string} errorMessage - The error message to display.
 */
const handleMapFailure = (errorMessage) => {
    if (typeof errorMessage !== 'string') return;
    try {
        const mapElement = document.getElementById('map');
        if (mapElement) {
            mapElement.innerHTML = `<div class='map-placeholder' style='color: var(--accent);'>${errorMessage}</div>`;
        }
    } catch (error) {
        console.error("Map failure handling error:", error);
    }
};
