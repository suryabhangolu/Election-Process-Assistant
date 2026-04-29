import { fetchGeminiResponse } from '../js/gemini.js';

describe('Gemini API Integration', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return fallback message if key is missing', async () => {
        const response = await fetchGeminiResponse("Hello", "MISSING_KEY");
        expect(response).toContain("offline fallback mode");
    });

    it('should return specific fallback for keywords if key is missing', async () => {
        const response = await fetchGeminiResponse("what is the age to vote?", "MISSING_KEY");
        expect(response).toContain("minimum voting age in India is 18");
    });

    it('should fetch AI response successfully', async () => {
        const mockResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({
                candidates: [{ content: { parts: [{ text: "Mock response" }] } }]
            })
        };
        global.fetch.mockResolvedValue(mockResponse);

        const response = await fetchGeminiResponse("Hello", "TEST_KEY");
        expect(response).toBe("Mock response");
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should handle Hindi queries', async () => {
        const mockResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({
                candidates: [{ content: { parts: [{ text: "नमस्ते" }] } }]
            })
        };
        global.fetch.mockResolvedValue(mockResponse);

        const response = await fetchGeminiResponse("चुनाव प्रक्रिया क्या है?", "TEST_KEY");
        expect(response).toBe("नमस्ते");
        expect(global.fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                body: expect.stringContaining("चुनाव प्रक्रिया क्या है?")
            })
        );
    });

    it('should return fallback message on API failure', async () => {
        global.fetch.mockResolvedValue({ ok: false });
        const response = await fetchGeminiResponse("Hello", "TEST_KEY");
        expect(response).toContain('offline fallback mode');
    });
});
