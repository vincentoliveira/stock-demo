'use strict';

const StockRepository = require('./StockRepository');

/**
 * Product Consume Lambda Function
 */
exports.getStock = (event, context, callback) => {

    let productId = parseInt(event.pathParameters.productId);
    
    StockRepository.getStock(productId, (err, readModel) => {
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
