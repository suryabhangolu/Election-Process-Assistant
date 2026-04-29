import { saveUserQuery, getRecentQueries } from '../js/firestore.js';
import { addDoc, getDocs } from 'firebase/firestore';

// Mock firebase db dependency
jest.mock('../js/firebase.js', () => ({
    db: {} // mock db instance
}));

jest.mock('firebase/firestore', () => {
    return {
        collection: jest.fn(),
        addDoc: jest.fn(),
        query: jest.fn(),
        orderBy: jest.fn(),
        limit: jest.fn(),
        getDocs: jest.fn()
    };
});

describe('Firestore Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should save a user query successfully', async () => {
        addDoc.mockResolvedValue({ id: '123' });
        
        await saveUserQuery("How to vote?", "You need to register.");
        
        expect(addDoc).toHaveBeenCalledTimes(1);
        expect(addDoc).toHaveBeenCalledWith(
            undefined, // We mocked db to {} and collection to jest.fn() returning undefined
            expect.objectContaining({
                query: "How to vote?",
                response: "You need to register.",
                timestamp: expect.any(Date)
            })
        );
    });

    it('should fetch recent queries', async () => {
        const mockDocs = [
            { id: '1', data: () => ({ query: 'Q1', response: 'A1' }) },
            { id: '2', data: () => ({ query: 'Q2', response: 'A2' }) }
        ];
        
        getDocs.mockResolvedValue(mockDocs);
        
        const results = await getRecentQueries(2);
        
        expect(results).toHaveLength(2);
        expect(results[0]).toEqual({ id: '1', query: 'Q1', response: 'A1' });
        expect(getDocs).toHaveBeenCalledTimes(1);
    });
});
