// Number of bytes of each of the ModBus Fields
const mbap_header = {
    'TRANSACTION IDENTIFIER': 2,
    'PROTOCOL IDENTIFIER': 2,
    'LENGTH': 2,
    'UNIT IDENTIFIER': 1,
    'FUNCTION CODE': 2
}

// Position (in bytes) of the data to be extracted from the Modbus PDU
const pdu_header = {
    'func_code': 1,
    'byte_count': 2,
    'values': 3
}

exports.mbap_header = mbap_header;
exports.pdu_header = pdu_header;
