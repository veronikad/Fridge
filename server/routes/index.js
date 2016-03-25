var _ = require("underscore"),
   db = require("./../db"),
   product = require("./../views/product"),
   MainView = require("./../views/main").MainView;

_.extend(exports, {
    render: function (req, res)
    {
        //var view = new MainView();

        return db.getProducts().then(function(items){
      	    res.render("./../views/templates/index", { title: "Items", items: items});
        });
    },

    product: function(req, res)
    {
        var view = new product.ProductView({model:product});
        $('#product-list').append(view.render().el);
    }
});
