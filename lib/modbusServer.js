const net = require('net');
const config = require('./configService');

const logger = config.getLogger()

const context = {
    op: 'IoTAgentModbus.modbusServer'
};


function handleConnection(conn) {    
    var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;  
    logger.info(context, 'New client connection from %s', remoteAddress);

    conn.on('data', function(data) {
        logger.info(context, 'Connection data from %s: %j', remoteAddress, data);  
        conn.write(data);  
    });

    conn.once('close', function () {
        logger.info(context, 'Connection from %s closed', remoteAddress)
    });

    conn.on('error', function (error) {
        logger.error(context, 'Connection %s error: %s', remoteAddress, error)
    });
}

function start() {
    var server = net.createServer();
    var port = config.getConfig().modbus.port;

    server.on('connection', handleConnection);
    
    server.listen(port, function() {    
        logger.info(context, 'Server listening to %j', server.address());  
    });    
}

exports.start = start;
