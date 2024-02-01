
const iotAgentLib = require('iotagent-node-lib');
const config = require('./configService');
//const modbusServer = require('./modbusServer');
//const async = require('async');
//const apply = async.apply;
//const errors = require('./errors');

const context = {
    op: 'IoTAgentModbus.Core'
};


function updateConfigurationHandler(newConfiguration, callback) {
    config.getLogger().error(context, 'Unsupported configuration update received');
    callback();
}

function deviceProvisioningMiddleware(device, callback) {
    config.getLogger().debug(context, 'device provisioning handler %j', device.internalAttributes);

    callback()
}

function initialize(callback) {
    callback();
}

function start(newConfig, callback) {
    config.setLogger(iotAgentLib.logModule);
    config.setConfig(newConfig);

    // async.series(
    //     [apply(sigfoxServer.start, config.getConfig()), apply(iotAgentLib.activate, config.getConfig().iota)],
    //     function (error, results) {
    //         if (error) {
    //             callback(error);
    //         } else {
    //             config.getLogger().info(context, 'IoT Agent services activated');
    //             initialize(callback);
    //         }
    //     }
    // );
    callback();
}

function stop(callback) {
    config.getLogger().info(context, 'Stopping IoT Agent');

    //async.series([sigfoxServer.stop, iotAgentLib.deactivate], callback);
    callback();
}

exports.start = start;
exports.stop = stop;
