'use strict';

const AWS = require('aws-sdk');

if (process.env.AWS_SAM_LOCAL) {
    AWS.config.update({
        endpoint: 'http://docker.for.mac.localhost:8000'
    });
}

const dynamo = new AWS.DynamoDB.DocumentClient();

/**
 * Perform a dynamo db put request.
 */
exports.dbPut = (params) => {

    return dynamo.put(params).promise(); 
};

/**
 * Perform a dynamo db get request.
 */
exports.dbGet = (params) => {

    return dynamo.get(params).promise();
};
