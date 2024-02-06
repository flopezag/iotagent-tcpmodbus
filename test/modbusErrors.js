const mb_errors = require('../lib/modbusErrors');
const should = require('should');
const expect = require('expect')

const generate_fnc_code_field = mb_errors.generate_fnc_code_field

describe('Function Code Field from well-known ModBus Function Code', function () {
    describe('Generate Function Code Field of a Function Code 0x05', function () {
        it('should return a hexadecimal number equal to 0x85', function () {
            const byte = Buffer.from('05', 'hex');
            const expected = Buffer.from('85', 'hex');
            const obtained = generate_fnc_code_field(byte);
            should.equal(obtained, expected);
        });
    });

    describe('Generate Function Code Field of a Function Code equal to 0x00', function () {
        it('should return an error, unsupported function code', function () {
            (function() {
                const byte = Buffer.from('00', 'hex');
                generate_fnc_code_field(byte);
            }).should.throw('The function code should be between ["01", "7F"]');
        });
    });

    describe('Exception Testing', function() {
        it('should return an error, unsupported function code', function() {
            (function() {
                const byte = Buffer.from('80', 'hex');
                generate_fnc_code_field(byte);
            }).should.throw('The function code should be between ["01", "7F"]');
        });
    });
});
