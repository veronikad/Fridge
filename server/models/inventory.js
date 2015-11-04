var _ = require("underscore"),
   db = require("./db");

_.extend(exports, {
    getItems: function (req, res)
    {
      return db.getItems()
          .then(function(items) {
              res.send(items.map(_taskToClient));
          });
    },

    getItem: function (req, res)
    {
      var id = req.params.code;
      return db.getItem(code)
          .then(function (item)
          {
            res.send(item.map(_taskToClient));
          });
    },
    
    createItem: function (req, res)
    {
      var item = req.body;

      return db.createItem(item.code, item.name, item.brand, item.bestBefore)
          .then();
    }
});
