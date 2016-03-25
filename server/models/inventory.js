var _ = require("underscore"),
   db = require("./../db");

_.extend(exports, {
    getProducts: function (req, res)
    {
      return db.getProducts()
          .then(function(products) {
              res.send(products.map(_taskToClient)); //todo: define mapping
          });
    },

    getProduct: function (req, res)
    {
      var id = req.params.code;
      return db.getProduct(code)
          .then(function (product)
          {
            res.send(product.toJSON());
          });
    },

    getProductById: function(req, res)
    {
        var productId = req.params.productId;
        return db.getProduct(productId)
            .then(function(product){
                res.send(product.toJSON());
            });
    },

    createProduct: function (req, res)
    {
      var product = req.body;

      return db.createProduct(product.code, product.name, product.brand, product.bestBeforeDate)
          .then(function(data){
              console.log("created product");
          });
    },

    removeProduct: function (req, res)
    {
        var id = req.param.productId;

        return db.deleteProduct(id);
    }
});
