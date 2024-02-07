const mb_exception_codes = {
    '01': {
        'name': 'Illegal Function',
        'description': 'The function code received in the query is not an allowable action for the server. This may be \
because the function code is only applicable to newer devices, and was not implemented in the \
unit selected. It could also indicate that the server is in the wrong state to process a request \
of this type, for example because it is unconfigured and is being asked to return register values.'
    },
    '02': {
        'name': 'Illegal Data Address',
        'description': 'The data address received in the query is not an allowable address for the server. More \
specifically, the combination of reference number and transfer length is invalid. For a \
controller with 100 registers, the PDU addresses the first register as 0, and the last \
one as 99. If a request is submitted with a \starting register address of 96 and a quantity \
of registers of 4, then this request will successfully operate (address-wise at least) on \
registers 96, 97, 98, 99. If a request is submitted with a starting register address of 96 \
and a quantity of registers of 5, then this request will fail with Exception Code 0x02 \
“Illegal Data Address” since it attempts to operate on registers 96, 97, 98, 99 and 100, \
and there is no register with address 100.'
    },
    '03': {
        'name': 'Illegal Data Value',
        'description': 'A value contained in the query data field is not an allowable value for server. This \
indicates a fault in the structure of the remainder of a complex request, such as that \
the implied length is incorrect. It specifically does NOT mean that a data item submitted \
for storage in a register has a value outside the expectation of the application \
program, since the MODBUS protocol is unaware of the significance of any particular value \
of any particular register.'
    },
    '04': {
        'name': 'Server Device Failure',
        'description': 'An unrecoverable error occurred while the server was attempting to perform the requested \
action.'
    },
    '05': {
        'name': 'Acknowledge',
        'description': ''
    },
    '06': {        
        'name': 'Server Device Busy',
        'description': ''
    },
    '08': {
        'name': 'Memory Parity Error',
        'description': ''
    },
    '0A': {
        'name': 'Gateway Path Unavailable',
        'description': ''
    },
    '0B': {
        'name': 'Gateway Target Device Failed to Respond',
        'description': ''
    }
};

function generate_fnc_code_field(mb_fnc_code) {
    /******************************************
     * Generate the Function Code Field, based on a bit operation 1000 0000 or mb_fnc_code
     ******************************************/
    const byte1 = Buffer.from('01', 'hex');
    const byte2 = Buffer.from('7F', 'hex');
    const bitmask = '80';

    if (mb_fnc_code < byte1 || mb_fnc_code > byte2) {
        throw new Error('The function code should be between ["01", "7F"]')
    } else {
        // const bitmask = '80'; // Bitmask in hexadecimal
        let code = mb_fnc_code.toString('hex');
        code = (bitmask | code)

        return Buffer.from(code.toString(), 'hex');
    }
}

function mb_exception_response(code, exception_code) {
    let failed_fnc_code = generate_fnc_code_field(code);
    return Buffer.concat([failed_fnc_code, exception_code]);
}

exports.generate_fnc_code_field = generate_fnc_code_field
exports.mb_exception_codes = mb_exception_codes
exports.mb_exception_response = mb_exception_response
