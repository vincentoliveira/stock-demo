'use strict';

const StockRepository = require('./StockRepository');

/**
 * Apply Stock Event to update Stock Read Model
 */
let applyEvent = (event) => {

    let productId = parseInt(event.productId.N);
    let quantity = parseInt(event.quantity.N);
    let type = event.type.S;
    let inQuantity = type === 'ProductReceived' ? quantity : 0;
    let outQuantity = type === 'ProductConsumed' ? quantity : 0;

    StockRepository.getStock(productId, (err, item) => {

        if (err) {
            console.error(err);
            return;
        }

        if (!item) {
            item = {
                productId: productId,
                quantity: inQuantity - outQuantity,
                in: inQuantity,
                out: outQuantity,
            };
        } else {
            item.quantity += inQuantity - outQuantity;
            item.in += inQuantity;
            item.out += outQuantity;
        }

        StockRepository.saveStock(item, (err, item) => {
            if (err) console.error(err);
        });
    });
};

/**
 * Stock event listener (streamer) lambda function
 */
exports.listener = (event, context, callback) => {

    if (!event.Records) {
        return;
    }

    event.Records.forEach( (record) => {

        var Image = record.dynamodb.NewImage;
        if (Image === undefined) {
            return;
        }

        applyEvent(Image);
    });
};