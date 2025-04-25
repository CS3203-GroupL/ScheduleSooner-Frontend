function isValidOU4x4(input) {
    const regex = /^[A-Za-z]{4}[0-9]{4}$/;
    return regex.test(input);
}

// Unit Tests
describe('OU 4x4 Input Validation', () => {
    
    test('Validates correct format - 4 letters and 4 numbers', () => {
        expect(isValidOU4x4('ABCD1234')).toBe(true);
    });
    
    test('Fails if less than 4 letters', () => {
        expect(isValidOU4x4('ABC1234')).toBe(false);
    });
    
    test('Fails if less than 4 numbers', () => {
        expect(isValidOU4x4('ABCD123')).toBe(false);
    });
    
    test('Fails if input contains special characters', () => {
        expect(isValidOU4x4('ABC!1234')).toBe(false);
    });
    
    test('Fails if numbers come before letters', () => {
        expect(isValidOU4x4('1234ABCD')).toBe(false);
    });
});