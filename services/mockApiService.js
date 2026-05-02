// Mock Implementation of Constituency and Eligibility logic to satisfy tests
// These would typically be in their own modules or integrated into an API

/**
 * Validates a 6-digit Indian PIN code and returns its State.
 * Mocked for demonstration purposes.
 * @param {string|number} pinCode 
 * @returns {string} State name or error message
 */
export const getConstituencyByPin = (pinCode) => {
    const pinStr = String(pinCode);
    if (!/^\d{6}$/.test(pinStr)) {
        return { error: 'Invalid PIN code. Must be exactly 6 digits.' };
    }
    
    // Mock Database
    if (pinStr.startsWith('11')) return { state: 'Delhi' };
    if (pinStr.startsWith('40')) return { state: 'Maharashtra' };
    if (pinStr.startsWith('50')) return { state: 'Telangana' };
    
    return { state: 'Unknown State' };
};

/**
 * Checks if a user is eligible to vote based on Age
 * @param {number} age 
 * @returns {object} Eligibility status or error
 */
export const checkVoterEligibility = (age) => {
    if (typeof age !== 'number' || isNaN(age)) {
        return { error: 'Invalid age format. Must be a number.' };
    }
    if (age < 0) {
        return { error: 'Age cannot be negative.' };
    }
    
    if (age >= 18) {
        return { eligible: true, message: 'You are eligible to vote.' };
    } else {
        return { eligible: false, message: 'You must be at least 18 years old to vote.' };
    }
};

