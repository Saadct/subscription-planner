import { PriceEuroPipe } from './price.pipe';

describe('PriceEuroPipe', () => {
    let pipe: PriceEuroPipe;

    beforeEach(() => {
        pipe = new PriceEuroPipe();
    });

    it('should format numbers correctly with € symbol', () => {
        expect(pipe.transform(10)).toBe('10.00 €');
        expect(pipe.transform(5.5)).toBe('5.50 €');
        expect(pipe.transform(0)).toBe('0.00 €');
    });

    it('should handle null or undefined gracefully', () => {
        expect(pipe.transform(null)).toBe('');
        expect(pipe.transform(undefined)).toBe('');
    });

    it('should handle decimal numbers correctly', () => {
        expect(pipe.transform(12.3456)).toBe('12.35 €');
    });
});
