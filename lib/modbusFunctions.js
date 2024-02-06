const mb_error_messages = require('./modbusErrors')
const mb_exception_response = mb_error_messages.mb_exception_response

const modbusFunctions = {
    '05': 'writeSingleCoil'
}

// Number of bytes of each of the ModBus Fields
mb_pdu_field_length = {
    'FUNCTION CODE': 1
}

const mb_fnc = {};

mb_fnc['05'] = function (mb_fnc_code, mb_req_pdu){
    /************************************
     * Write Single Coil
     ************************************/
    console.log(mb_req_pdu)

    let location = mb_pdu_field_length['FUNCTION CODE']
    let outputAddress = mb_req_pdu.slice(location,location+2).readUInt16BE(0);
    location = location + 2;

    let outputValue = mb_req_pdu.slice(location,location+2).readUInt16BE(0);

    console.log('Function Code: ', mb_fnc_code);
    console.log('Output Address: ', outputAddress);
    console.log('Output Value: ', outputValue);

    // mb_fnc_code = Buffer.from('85', 'hex');
    let mb_exception_rsp = check_fnc_code_supported(mb_fnc_code);
    if (mb_exception_rsp === true) {
        // The Function Code is supported
        mb_exception_rsp = check_output_value(mb_fnc_code, outputValue)
        if (mb_exception_rsp === true) {
            // The output value is supported
            mb_exception_rsp = check_address_value(mb_fnc_code, outputAddress)
            if (mb_exception_rsp === true) {
                // The address value is correct, Request processing
                // Save the data into MongoDB or Redis
                return save_registry(mb_req_pdu, outputAddress, outputValue);
            } else {
                return mb_exception_rsp;
            }
        } else {
            // ERROR: Output value is not allowed
            return mb_exception_rsp;
        }
    } else {
        // ERROR, ExceptionCode 01, The Function Code is not supported
        return mb_exception_rsp;
    }
}

// Implemented function codes
const mb_fnc_codes_supported = Object.keys(mb_fnc);

function save_registry(mb_req_pdu, outputAddress, outputValue) {
    // TODO: Need to process the operation to save the registry and report if there is an error, at the moment we return mb_req_pdu because we consider that the operation was correct
    return mb_req_pdu;
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

function check_output_value(mb_fnc_code, outputValue){
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
        return true;
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

const mb_fnc_code = Buffer.from('05', 'hex');

const mb_req_pdu = Buffer.alloc(5);
mb_req_pdu.write("0500ACFF00", "hex");

let mb_rsp = mb_fnc[mb_fnc_code.toString('hex')](mb_fnc_code, mb_req_pdu);
console.log("Response op:'05':", mb_rsp);

exports.mb_fnc = mb_fnc
