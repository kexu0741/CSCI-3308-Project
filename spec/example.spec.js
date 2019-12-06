describe('math functions', () => {
    it('get the sum of 2 numbers', () => { //it makes this a test
        // arrange 
        const num1 = 2;
        const num2 = 3;
        // act
        const result = add(num1,num2);
        // assert
        expect(result).toBe(5);
    })
})