describe('Google Maps Integration', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="map"></div>
            <form id="booth-form">
                <input type="text" id="pin-input" />
            </form>
            <div id="map-error"></div>
            <ul id="sr-booth-list"></ul>
            <div id="map-fallback"></div>
        `;
        
        window.google = {
            maps: {
                Map: jest.fn(),
                Marker: jest.fn(),
                LatLngBounds: jest.fn(() => ({ extend: jest.fn() })),
                InfoWindow: jest.fn(),
                event: { addListener: jest.fn(), removeListener: jest.fn() }
            }
        };
        jest.resetModules();
    });

    it('should show error for invalid PIN code on form submit', async () => {
        // Dynamic import to avoid module state bleed across tests
        const { initMap } = await import('../js/maps.js');
        initMap();
        const form = document.getElementById('booth-form');
        const input = document.getElementById('pin-input');
        const errorDiv = document.getElementById('map-error');
        
        input.value = "123"; 
        form.dispatchEvent(new Event('submit'));
        
        expect(errorDiv.classList.contains('sr-only')).toBe(false);
        expect(errorDiv.textContent).toContain('Invalid PIN code format');
    });

    it('should show fallback cards if maps API is not loaded but search is valid', async () => {
        const { initMap } = await import('../js/maps.js');
        initMap();
        const form = document.getElementById('booth-form');
        const input = document.getElementById('pin-input');
        const fallback = document.getElementById('map-fallback');
        
        input.value = "141001";
        delete window.google;
        
        form.dispatchEvent(new Event('submit'));
        
        expect(fallback.classList.contains('hidden')).toBe(false);
        expect(fallback.innerHTML).toContain('Government School Booth 1');
    });
});
