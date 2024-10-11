var net = require('net');
const tcp_apu = require('./modbusTCPADU');

var client = new net.Socket();

client.connect(502, '127.0.0.1', function() {
	console.log('Connected');
    
    let buf = new Buffer.alloc(12);
    
    // 1234 5678 9ABC DE - 05 00AC FF00
    buf.write("000100000006010300000008", "hex")
	
    client.write(buf);
});

client.on('data', function(data) {
    tcp_apu.extractData(data);
	client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});