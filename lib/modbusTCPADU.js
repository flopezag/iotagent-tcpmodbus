const mb_functions = require('./mb_functions.js');
const mb_fnc = mb_functions.mb_fnc;

const mb_header_description_length = require('./modbusHeaderDescriptionLength.js');


function extractData(data) {
    let totalLength = data.length
    console.log('Total length: ', totalLength);
    
    // MBAP Header
    let transactionID = data.slice(0,2);
    let protocolID = data.slice(2,4);
    let lengthPDU = data.slice(4,6).readUInt16BE(0);
    // Check that the length of the rest of the data is equal to this value
    // lengthPDU = length Unit Identifier + length Function Code + Length Data
    let unitID = data.slice(6,7);

    console.log('Transaction ID: ', transactionID);
    console.log('Protocol ID: ', protocolID);
    console.log('Length PDU: ', lengthPDU);
    console.log('Unit ID: ', unitID);
    console.log('')

    // PDU depends on function
    let mb_req_pdu = data.slice(7,totalLength);
    let mb_fnc_code = data.slice(7,8).toString('hex')
    console.log('MB Function Code: ', mb_fnc_code);


    mb_fnc[mb_fnc_code](mb_fnc_code, mb_req_pdu);
}

let buf = new Buffer.alloc(12);
// 1234 5678 9ABC DE - 05 00AC FF00
buf.write("123456780006DE0500ACFF00", "hex")

extractData(buf)