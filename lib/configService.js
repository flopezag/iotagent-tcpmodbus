'use strict';

let config = {},
    logger = require('logops');
    
function anyIsSet(variableSet) {
    for (let i = 0; i < variableSet.length; i++) {
        if (process.env[variableSet[i]]) {
            return true;
        }
    }

    return false;
}

function processEnvironmentVariables() {
    let environmentVariables = ['IOTA_TCP_HOST', 'IOTA_TCP_PORT', 'IOTA_TCP_PERIODIC_REQUEST'],
        tcpVariables = ['IOTA_TCP_HOST', 'IOTA_TCP_PORT', 'IOTA_TCP_PERIODIC_REQUEST'];

    for (let i = 0; i < environmentVariables.length; i++) {
        if (process.env[environmentVariables[i]]) {
            logger.info(
                'Setting %s to environment value: %s',
                environmentVariables[i],
                process.env[environmentVariables[i]]
            );
        }
    }

    if (anyIsSet(tcpVariables)) {
        config.http = {};
    }

    if (process.env.IOTA_TCP_HOST) {
        config.http.host = process.env.IOTA_TCP_HOST;
    }

    if (process.env.IOTA_TCP_PORT) {
        config.http.port = process.env.IOTA_TCP_PORT;
    }

    if (process.env.IOTA_TCP_PERIODIC_REQUEST) {
        config.http.timeout = process.env.IOTA_TCP_PERIODIC_REQUEST;
    }
}

function setConfig(newConfig) {
    config = newConfig;

    processEnvironmentVariables();
}

function getConfig() {
    return config;
}

function setLogger(newLogger) {
    logger = newLogger;
}

function getLogger() {
    return logger;
}

exports.setConfig = setConfig;
exports.getConfig = getConfig;
exports.setLogger = setLogger;
exports.getLogger = getLogger;
