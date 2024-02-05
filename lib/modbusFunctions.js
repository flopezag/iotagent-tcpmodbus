const mb_error_messages = require('./modbusErrors')
const generate_fnc_code_field = mb_error_messages.generate_fnc_code_field
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

    var location = mb_pdu_field_length['FUNCTION CODE']
    outputAddress = mb_req_pdu.slice(location,location+2).readUInt16BE(0);
    location = location + 2;

    outputValue = mb_req_pdu.slice(location,location+2)

    console.log('Function Code: ', mb_fnc_code);
    console.log('Output Address: ', outputAddress);
    console.log('Output Value: ', outputValue);

    mb_fnc_code = '85'

    check_fnc_code_supported(mb_fnc_code)
    // var str1 = new Buffer.alloc(5)

    // str1.write("0500ACFF00", "hex")

    // console.log(str1)
}

//const mb_req_pdu = Buffer.alloc(5);
//mb_req_pdu.write("0500ACFF00", "hex");

//const rcv_fnc = modbusFunctions['05'];
//mb_fnc['05'](mb_req_pdu);

// Implemented function codes
const mb_fnc_codes_supported = Object.keys(mb_fnc);

function check_fnc_code_supported(mb_fnc_code) {
    const isInArray = mb_fnc_codes_supported.includes(mb_fnc_code);

    if (isInArray === false) {
        // ExceptionCode = 01, Unknown Function Code used
        response = mb_exception_response(mb_fnc_code, '01');

        console.log('Response: ', response)
    }
}


exports.mb_fnc = mb_fnc
exports.mb_fnc_codes_supported
