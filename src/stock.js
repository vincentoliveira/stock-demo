'use strict';

const Repository = require('./repository');

/**
 * Product Consume Lambda Function
 */
exports.getStock = (event, context, callback) => {

    let productId = parseInt(event.pathParameters.productId);
    
    Repository.getStockModel(productId, (err, readModel) => {
        if (err) callback(null, 500);
        else callback(null, {
            statusCode: 200,
            body: JSON.stringify(readModel),
            headers: {
                'Content-Type': 'application/json',
            }
        });
    });
};
