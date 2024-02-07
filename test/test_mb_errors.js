const mb_errors = require('../lib/mb_errors');
const should = require('should');
const expect = require('expect');

const generate_fnc_code_field = mb_errors.generate_fnc_code_field;
const mb_exception_response = mb_errors.mb_exception_response;

describe('Function Code Field from well-known ModBus Function Code', function () {
    describe('Generate Function Code Field of a Function Code 0x05', function () {
        it('should return a hexadecimal number equal to 0x85', function () {
            const byte = Buffer.from('05', 'hex');
            const expected = Buffer.from('85', 'hex');
            const obtained = generate_fnc_code_field(byte);
            should.equal(obtained.toString('hex'), expected.toString('hex'));
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

describe('Generate modbus exception response', function () {
    describe('Generate a error message with concatenate function code 0x05 and exception code 0x01', function() {
        it('should return a concatenate Buffer with content 0x8501', function() {
            const code = Buffer.from('05', 'hex');
            const exception = Buffer.from('01', 'hex');
            const expected_exception_rsp = Buffer.from('8501', 'hex')
            const obtained_exception_rsp = mb_exception_response(code, exception);
            should.equal(expected_exception_rsp.toString('hex'), obtained_exception_rsp.toString('hex'));
        });
    });
});
