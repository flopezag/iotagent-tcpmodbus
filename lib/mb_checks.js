
const mb_functions = {
    '05': 'Write Single Coil',
    '06': 'Write Single Register',
    '0F': 'Write Multiple Coils'
}

// Implemented function codes
let mb_fnc_codes_supported = {};

function mb_fnc_codes(mb_fnc) {
    mb_fnc_codes_supported = Object.keys(mb_fnc);
}

function check_quantity_of_outputs(quantity, byteCount) {
    return undefined;
}

function check_register_value(mb_fnc_code, registerValue) {
    /*
    The register values should be between 0x0000 and 0xFFFF (0000 -> 0, FFFF -> 65535)
     */
    if (registerValue < 0 && registerValue > 65535) {
        // ERROR, ExceptionCode 03, The Output Value is not supported
        const exception_code = Buffer.from('03', 'hex')
        const response = mb_exception_response(mb_fnc_code, exception_code);

        console.log('Response: ', response.toString('hex'));

        return response;
    } else {
        return true;
    }
}

function check_address_value(mb_fnc_code, outputAddress) {
    /*
    The outputAddress MUST be between 0000 and FFFF -> 0000:0, FFFF:65535
     */
    if (outputAddress < 0 || outputAddress > 65535) {
        // ERROR, ExceptionCode 02, The Output Value is not supported
        const exception_code = Buffer.from('02', 'hex')
        const response = mb_exception_response(mb_fnc_code, exception_code);

        console.log('Response: ', response.toString('hex'));

        return response;
    } else {
        return true;
    }
}

function check_output_value(mb_fnc_code, outputValue) {
    /*
    The output values MUST be either 0000 -> OFF or FF00 -> ON, 0000 -> 0, FF00 -> 65280
     */
    const values = {
        0: 0,
        65280: 1
    };

    const value = values[outputValue];
    if (value !== 0 && value !== 1) {
        // ERROR, ExceptionCode 03, The Output Value is not supported
        const exception_code = Buffer.from('03', 'hex')
        const response = mb_exception_response(mb_fnc_code, exception_code);

        console.log('Response: ', response.toString('hex'));

        return response;
    } else {
        return [true, value];
    }

}

function check_fnc_code_supported(mb_fnc_code) {
    const isInArray = mb_fnc_codes_supported.includes(mb_fnc_code.toString('hex'));

    if (isInArray === false) {
        // ExceptionCode = 01, Unknown Function Code used
        const exception_code = Buffer.from('01', 'hex')
        const response = mb_exception_response(mb_fnc_code, exception_code);

        console.log('Response: ', response.toString('hex'));

        return response;
    } else {
        return true;
    }
}

exports.check_register_value = check_register_value;
exports.check_address_value = check_address_value;
exports.check_output_value = check_output_value;
exports.check_fnc_code_supported = check_fnc_code_supported;
exports.check_quantity_of_outputs = check_quantity_of_outputs;
exports.mb_fnc_codes = mb_fnc_codes;
