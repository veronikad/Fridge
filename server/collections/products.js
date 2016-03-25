var _ = require("underscore"),
    Backbone = require("backbone"),
    Product = require("./../models/product");

var ProductList = Backbone.Collection.extend({
    model: Product,
    url: "/products",
    comparator: "code"
});

_.extend(exports, {
    ProductList: ProductList
});