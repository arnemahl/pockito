jest.unmock('./leet');

describe('leet', () => {
    it('returns 1337', () => {
        const leet = require('./leet');
        expect(leet()).toBe(1337);
    });
});
