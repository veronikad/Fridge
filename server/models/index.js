var _ = require("underscore"),
   db = require("./db");

_.extend(exports, {
    render: function (req, res)
    {
    	var items = db.getItems();
      	res.render("index", { title: "Express", items: items});
    },
    item: function(req, res)
    {
    	res.render("item", {});
    }
});
