'use strict';

const uuidv4 = require('uuid/v4');
const EventStore = require('./EventStore');

/**
 * Get quantity from request
 */
let getProduct = (lambdaEvent) => {
    return parseInt(lambdaEvent.pathParameters.productId);
};

/**
 * Get quantity from request
 */
let getQuantity = (lambdaEvent) => {

    let body = JSON.parse(lambdaEvent.body);
    return body && body.quantity ? parseInt(body.quantity) : 1;
};

/**
 * Generate and persist stock event. 
 */
let generateStockEvent = (eventName, productId, quantity, callback) => {

    let stockEvent = {
        uuid: uuidv4(),
        happenOn: new Date().toISOString(),
        productId: productId,
        type: eventName,
        quantity: quantity
    };
    
    EventStore.save(stockEvent, (err, data) => {
        if (err) callback(null, { statusCode: 500 });
        else callback(null, { statusCode: 202, body: JSON.stringify(data), headers: {'Content-Type': 'application/json'}});
    });
};

/**
 * Product Consume Lambda Function
 */
exports.productConsumed = (event, context, callback) => {

    let product = getProduct(event);
    let quantity = getQuantity(event);
    generateStockEvent('ProductConsumed', product, quantity, callback);
};

/**
 * Product Received Lambda Function
 */
exports.productReceived = (event, context, callback) => {

    let product = getProduct(event);
    let quantity = getQuantity(event);
    generateStockEvent('ProductReceived', product, quantity, callback);
};
