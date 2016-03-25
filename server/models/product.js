var _ = require("underscore"),
    moment = require("moment"),
    Backbone = require("backbone");

var _dateFormat = "DD.MM.YYYY HH:mm";

var Product = Backbone.Model.extend({
    properties: "productId,name,brand,categories,bestBeforeDate",
    idAttribute: "productId",
    urlRoot: "/products",
    hasExpired: function () {
        return this.besBeforeDate ? moment() > moment(this.bestBeforeDate) : false;
    },
    save: function (tasks) {
        var product = {
            name: this.name,
            brand: this.brand,
            categories: this.categories,
            bestBeforeDate: this.bestBeforeDate
        };

        return inventory.createProduct(product)
            .then(function(data) {
                console.log("productCreated");
                //if (exTask)
                //    exTask.set(data.task);
                //else
                //    tasks.add(new Task(data.task));
            });
    },
    remove: function () {
        return inventory.removeProduct(this.productId);
    },
});

_.extend(exports, {
    Product: Product
});