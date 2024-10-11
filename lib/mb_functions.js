const mb_error_messages = require('./mb_errors')
const mb_check = require('./mb_checks')


const mb_exception_response = mb_error_messages.mb_exception_response

// Number of bytes of each of the ModBus Fields
const mb_pdu_field_length = {
    'FUNCTION CODE': 1
}

const mb_fnc = {};

function extract_data(mb_req_pdu) {
    console.log(mb_req_pdu)

    let start = mb_pdu_field_length['FUNCTION CODE'];
    let end = start + 2;

    let function_code = mb_req_pdu.slice(0, start).readUInt8();
    let address = mb_req_pdu.slice(start, end).readUInt16BE(0);

    start = end;
    end = start + 2;
    let value = mb_req_pdu.slice(start, end).readUInt16BE(0);

    console.log('Function Code: ', function_code);
    console.log('Address: ', address);
    console.log('Value: ', value);

    return [function_code, address, value];
}

function extract_multiple_data(mb_req_pdu) {
    console.log(mb_req_pdu)

    let start = mb_pdu_field_length['FUNCTION CODE']
    let end = start + 2;
    let address = mb_req_pdu.slice(start, end).readUInt16BE(0);

    start = end;
    end = start + 2;
    let quantity = mb_req_pdu.slice(start, end).readUInt16BE(0);

    start = end;
    end = start + 1;
    let bytesCount = mb_req_pdu.slice(start, end).readInt8();

    start = end;
    end = start + bytesCount;
    let values = mb_req_pdu.slice(start, end);

    console.log('Address: ', address);
    console.log('Quantity: ', quantity);
    console.log('bytesCount: ', bytesCount);
    console.log('Values: ', values)

    return [address, quantity, bytesCount, values];
}

mb_fnc['02'] = function (mb_req_pdu) {
    /************************************
     * Read Discrete Inputs
     ************************************/
    let [mb_fnc_code, address, quantity] = extract_data(mb_req_pdu);
    console.log('Function Code: ', mb_fnc_code);

    let mb_exception_rsp = mb_check.check_fnc_code_supported(mb_fnc_code);
    if (mb_exception_rsp === true) {
        // The Function Code is supported
        mb_exception_rsp = mb_check.check_quantity_of_inputs(mb_fnc_code, quantity);
        if (mb_exception_rsp === true) {
            // The quantity of inputs is correct
            mb_exception_rsp = mb_check.check_address_range(mb_fnc_code, address, quantity);
            if (mb_exception_rsp === true) {
                // The address and quantity of inputs are correct
                // TODO: request process send the data to the Modbus Server
                console.log('Send request to the Modbus slave');
                const data = Buffer.from("0203ACDB35", "hex");
                return data
            } else {
                // ERROR, Exception Code 02, illegal data address
                return mb_exception_rsp;
            }
        } else {
            // ERROR, Exception Code 03, illegal data value
            return mb_exception_rsp;
        }
    } else {
        // ERROR, Exception Code 01, Illegal function code
        return mb_exception_rsp;
    }
}

mb_fnc['03'] = function (mb_req_pdu) {
    /************************************
     * Read Discrete Inputs
     ************************************/
    let [mb_fnc_code, address, quantity] = extract_data(mb_req_pdu);
    console.log('Function Code: ', mb_fnc_code);

    let mb_exception_rsp = mb_check.check_fnc_code_supported(mb_fnc_code);
    if (mb_exception_rsp === true) {
        // The Function Code is supported
        mb_exception_rsp = mb_check.check_quantity_of_registers(mb_fnc_code, quantity);
        if (mb_exception_rsp === true) {
            // The quantity of registers is correct
            mb_exception_rsp = mb_check.check_address_range(mb_fnc_code, address, quantity*2);
            if (mb_exception_rsp === true) {
                // The address and quantity of inputs are correct
                // TODO: request process send the data to the Modbus Slave
                console.log('Send request to the Modbus slave');
                return read_discrete_inputs(mb_req_pdu);
            } else {
                // ERROR, Exception Code 02, illegal data address
                return mb_exception_rsp;
            }
        } else {
            // ERROR, Exception Code 03, illegal data value
            return mb_exception_rsp;
        }
    } else {
        // ERROR, Exception Code 01, Illegal function code
        return mb_exception_rsp;
    }
}

mb_fnc['05'] = function (mb_req_pdu) {
    /************************************
     * Write Single Coil
     ************************************/
    let [mb_fnc_code, address, value] = extract_data(mb_req_pdu);
    console.log('Function Code: ', mb_fnc_code);

    let mb_exception_rsp = mb_check.check_fnc_code_supported(mb_fnc_code);
    if (mb_exception_rsp === true) {
        // The Function Code is supported
        [mb_exception_rsp, value] = mb_check.check_output_value(mb_fnc_code, value);
        if (mb_exception_rsp === true) {
            // The output value is supported
            mb_exception_rsp = mb_check.check_address_value(mb_fnc_code, address);
            if (mb_exception_rsp === true) {
                // The address value is correct, Request processing
                // Save the data into Redis
                return save_registry(mb_req_pdu, address, value);
            } else {
                // ERROR, Exception Code 02, The address is not ok
                return mb_exception_rsp;
            }
        } else {
            // ERROR, Exception Code 3, Output value is not allowed
            return mb_exception_rsp;
        }
    } else {
        // ERROR, ExceptionCode 01, The Function Code is not supported
        return mb_exception_rsp;
    }
}

mb_fnc['06'] = function (mb_req_pdu) {
    /************************************
     * Write Single Holding Register
     ************************************/
    let [mb_fnc_code, address, value] = extract_data(mb_req_pdu);
    console.log('Function Code: ', mb_fnc_code);

    let mb_exception_rsp = mb_check.check_fnc_code_supported(mb_fnc_code);
    if (mb_exception_rsp === true) {
        // The Function Code is supported
        mb_exception_rsp = mb_check.check_register_value(mb_fnc_code, value);
        if (mb_exception_rsp === true) {
            // The output value is supported
            mb_exception_rsp = mb_check.check_address_value(mb_fnc_code, address);
            if (mb_exception_rsp === true) {
                // The address value is correct, Request processing
                // Save the data into Redis
                return save_registry(mb_req_pdu, address, value);
            } else {
                // ERROR, Exception Code 02, The address is not ok
                return mb_exception_rsp;
            }
        } else {
            // ERROR, Exception Code 3, Output value is not allowed
            return mb_exception_rsp;
        }
    } else {
        // ERROR, ExceptionCode 01, The Function Code is not supported
        return mb_exception_rsp;
    }
}

mb_fnc['0F'] = function (mb_req_pdu) {
    /************************************
     * Write Single Holding Register
     ************************************/
    let [mb_fnc_code, address, quantity, byteCount, values] = extract_multiple_data(mb_req_pdu);

    let mb_exception_rsp = mb_check.check_fnc_code_supported(mb_fnc_code);
    if (mb_exception_rsp === true) {
        // The Function Code is supported
        mb_exception_rsp = mb_check.check_quantity_of_outputs(quantity, byteCount)
        if (mb_exception_rsp === true) {
            // The output value is supported
        } else {
            // ERROR, Exception Code 3, Quantity of Outputs (Q) are wrong OR Byte Count (B) is not N (B=Q/8)
            return mb_exception_rsp;
        }
    } else {
        // ERROR, ExceptionCode 01, The Function Code is not supported
        return mb_exception_rsp;
    }


}

mb_check.mb_fnc_codes(mb_fnc);

function save_registry(mb_req_pdu, outputAddress, outputValue) {
    // TODO: Need to process the operation to save the registry and report if there is an error, at the moment we return mb_req_pdu because we consider that the operation was correct
    return mb_req_pdu;
}

function read_discrete_inputs(mb_req_pdu) {
    // TODO: Need to send the request process to the Modbus Server to get the data and report if there is an error, at the moment we return mb_req_pdu because we consider that the operation was correct
    const data = Buffer.from("0306022B00000064", "hex");

    return data
}

exports.mb_fnc = mb_fnc
exports.extract_multiple_data = extract_multiple_data
