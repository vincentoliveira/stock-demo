'use strict';

const AWS = require('aws-sdk');

if (process.env.AWS_SAM_LOCAL) {
    AWS.config.update({
        endpoint: 'http://docker.for.mac.localhost:8000'
    });
}

const dynamo = new AWS.DynamoDB.DocumentClient();

const eventTableName = process.env.EVENT_TABLE;
const modelTableName = process.env.MODEL_TABLE;

exports.saveStockEvent = (stockEvent, callback) => {

    let params = {
        TableName: eventTableName,
        Item: stockEvent
    };
    
    let dbPost = (params) => { return dynamo.put(params).promise(); };
    
    dbPost(params).then( (data) => {
        callback(null, data);
    }).catch( (err) => { 
        callback(err); 
    });
};

exports.getStockModel = (productId, callback) => {

    let getParams = {
        TableName: modelTableName,
        Key: {
            productId: productId
        }
    };

    let dbGet = (params) => { return dynamo.get(params).promise(); };
    
    dbGet(getParams).then( (data) => {
        callback(null, data.Item);
    }).catch( (err) => { 
        callback(err);
    });
};

exports.saveStockModel = (stockModel, callback) => {

    let putParams = {
        TableName: modelTableName,
        Item: stockModel
    };
    
    let dbPut = (params) => { return dynamo.put(params).promise(); };
    
    dbPut(putParams).then( (data) => {
        callback(null, data);
    }).catch( (err) => { 
        callback(err);
    });
};
