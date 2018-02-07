'use strict';

const Repository = require('./repository');

let updateReadModel = (event) => {

    let productId = parseInt(event.productId.N);
    let quantity = parseInt(event.quantity.N);
    let type = event.type.S;
    let inQuantity = type === 'ProductReceived' ? quantity : 0;
    let outQuantity = type === 'ProductConsumed' ? quantity : 0;

    Repository.getStockModel(productId, (err, item) => {

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


        Repository.saveStockModel(item, (err, item) => {
            if (err) console.error(err);
        });
    });
};

exports.listener = (event, context, callback) => {


    if (!event.Records) {
        return;
    }

    event.Records.forEach( (record) => {

        var Image = record.dynamodb.NewImage;
        if (Image === undefined) {
            return;
        }

        updateReadModel(Image);
    });
};