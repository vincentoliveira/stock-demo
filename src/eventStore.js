'use strict';

const Dynamo = require('./dynamo');

const eventTableName = process.env.EVENT_TABLE;

/**
 * Save a Stock event.
 */
exports.save = (stockEvent, callback) => {

    let params = {
        TableName: eventTableName,
        Item: stockEvent
    };
        
    Dynamo.dbPut(params).then( (data) => {
        callback(null, data);
    }).catch( (err) => { 
        callback(err); 
    });
};
