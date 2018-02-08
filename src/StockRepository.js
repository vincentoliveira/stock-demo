'use strict';

const Dynamo = require('./dynamo');

const modelTableName = process.env.MODEL_TABLE;

exports.getStock = (productId, callback) => {

    let getParams = {
        TableName: modelTableName,
        Key: {
            productId: productId
        }
    };
    
    Dynamo.dbGet(getParams).then( (data) => {
        callback(null, data.Item);
    }).catch( (err) => { 
        callback(err);
    });
};

exports.saveStock = (stockModel, callback) => {

    let putParams = {
        TableName: modelTableName,
        Item: stockModel
    };
        
    Dynamo.dbPut(putParams).then( (data) => {
        callback(null, data);
    }).catch( (err) => { 
        callback(err);
    });
};
