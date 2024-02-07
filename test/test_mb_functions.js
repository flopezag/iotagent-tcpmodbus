const mb_functions = require('../lib/mb_functions');
const should = require('should');

const mb_fnc = mb_functions.mb_fnc
const extract_multiple_data = mb_functions.extract_multiple_data

describe('Function Code Field from well-known ModBus Function Code', function () {
    describe('Generate Function Code Field of a Function Code 0x05', function () {
        it('should return the same ModBus PDU', function () {
            const mb_fnc_code = Buffer.from('05', 'hex');
            const mb_req_pdu = Buffer.from("0500ACFF00", "hex");
            const expected_response = Buffer.from("0500ACFF00", "hex");

            let obtained_response = mb_fnc[mb_fnc_code.toString('hex')](mb_fnc_code, mb_req_pdu);

            should.equal(expected_response.toString('hex'), obtained_response.toString('hex'));
        });
    });

    describe('Generate Function Code Field of a Function Code 0x06', function () {
        it('should return the same ModBus PDU', function () {
            const mb_fnc_code = Buffer.from('06', 'hex');
            const mb_req_pdu = Buffer.from("0600010003", "hex");
            const expected_response = Buffer.from("0600010003", "hex");

            let obtained_response = mb_fnc[mb_fnc_code.toString('hex')](mb_fnc_code, mb_req_pdu);

            should.equal(expected_response.toString('hex'), obtained_response.toString('hex'));
        });
    });

});

describe('Get multiple data from mb_req_pdu', function () {
    describe('When a mb_req_pdu with value OF0013000A02CD01', function () {
        it('should return a valid starting address, quantity of outputs, byte count, and values', function() {
            const mb_req_pdu = Buffer.from('0F0013000A02CD01', 'hex');
            const expected_address = 19;
            const expected_quantity = 10;
            const expected_byteCount = 2;
            const expected_values = Buffer.from('CD01', 'hex');

            let [obtained_address, obtained_quantity, obtained_byteCount, obtained_values] =
                extract_multiple_data(mb_req_pdu);

            should.equal(expected_address, obtained_address);
            should.equal(expected_quantity, obtained_quantity);
            should.equal(expected_byteCount, obtained_byteCount);
            should.equal(expected_values.toString('hex'), obtained_values.toString('hex'));
        });
    });
});
