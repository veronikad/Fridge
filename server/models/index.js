var _ = require("underscore"),
   db = require("./db");

_.extend(exports, {
    render: function (req, res)
    {
    	return db.getProducts().then(function(items){
      	    res.render("index", { title: "Items", items: items});
        });
    },
    product: function(req, res)
    {
    	res.render("product", {});
    }
});
