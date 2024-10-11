const mb_functions = require('./mb_functions.js');
const mb_fnc = mb_functions.mb_fnc;

const mb_header_description_length = require('./modbusHeaderDescriptionLength.js');


function extractData(data) {
    let totalLength = data.length
    console.log('Total length: ', totalLength);
    
    // MBAP Header
    let transactionID = data.subarray(0,2);
    let protocolID = data.subarray(2,4);
    let lengthPDU = data.subarray(4,6).readUInt16BE(0);
    // Check that the length of the rest of the data is equal to this value
    // lengthPDU = length Unit Identifier + length Function Code + Length Data
    let unitID = data.subarray(6,7);

    console.log('Transaction ID: ', transactionID);
    console.log('Protocol ID: ', protocolID);
    console.log('Length PDU: ', lengthPDU);
    console.log('Unit ID: ', unitID);
    console.log('')

    // PDU depends on function
    let mb_res_pdu = data.subarray(7,totalLength);
    let mb_fnc_code = data.subarray(7,8).toString('hex')
    console.log('MB Function Code: ', mb_fnc_code);


    extract_pdu(mb_fnc_code, mb_res_pdu)
}

function get_number_responses(func_code, byte_counts) {
    var step;
    var number_of_responses;
    var func;

    switch(func_code) {
        case 3:
            step = 2;
            number_of_responses = byte_counts >>> 1;
            break;
        case 2:
            step = 1;
            number_of_responses = byte_counts;
            break;
    }

    return [step, number_of_responses, func]
}

function extract_pdu(mb_fnc_code, mb_res_pdu) {
    var step;
    var number_of_responses;
    var func;
    var pdu_header = mb_header_description_length.pdu_header;

    var func_code = mb_res_pdu.subarray(0, pdu_header['func_code']).readUInt8();
    var byte_counts = mb_res_pdu.subarray(pdu_header['func_code'], pdu_header['byte_count']).readUInt8();

    // console.log('Byte counts: ', + byte_counts);

    [step, number_of_responses, func] = get_number_responses(func_code, byte_counts);

    // console.log('steps: ' + step);
    // console.log('number of responses: ' + number_of_responses);


    // We need to create a buffer with the number of items eq to byte counts
    // starting from position 3, with a extension of 2 bytes for func_code 03 and 1 byte for func_code 02
    pdu_responses = [...Array(number_of_responses).keys()]
            .map(i => mb_res_pdu.subarray(
                pdu_header['values']+step*i-1,
                pdu_header['values']+step*i+1
                )
            );

    switch(step) {
        case 1:
            for (let i = 0; i < pdu_responses.length; i++) {
                pdu_responses[i] = pdu_responses[i].readUInt8();
            }            
            break;
        case 2:
            for (let i = 0; i < pdu_responses.length; i++) {
                pdu_responses[i] = pdu_responses[i].readUInt16BE();
            }            
            break;
    }

    console.log('responses: ' + pdu_responses);
}

// let buf = new Buffer.alloc(12);
// 1234 5678 9ABC DE - 05 00AC FF00
// buf.write("123456780006DE0500ACFF00", "hex")

// extractData(buf)

exports.extractData = extractData
