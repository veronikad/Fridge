var Q = require("q"),
    //authentication = require("./authentication"),
    items = require("./models/inventory");

var routes = {
    web: {
        endpoints: [
            //{ path: "/authenticate/init", method: authentication.web.authenticate, anonymous: true },
            //{ path: "/authenticate/info", method: authentication.web.info, anonymous: true },
            //{ path: "/logout", method: authentication.web.logout },
            { path: "/items", method: inventory.getItems, verb: "GET" },
            { path: "/items", method: inventory.createItem, verb: "POST" },
            { path: "/items/code/:code", method: inventory.getItem, verb: "GET" },
            { path: "/items/:item_id", method: inventory.deleteItem, verb: "DELETE" },
            { path: "/categories", method: inventory.getCategories, verb: "GET" },
            { path: "/categories", method: inventory.createCategory, verb: "POST" },
            { path: "/categories/:category_id", method: inventory.getCategory, verb: "GET" },
            { path: "/categories/:category_id", method: inventory.deleteCategory, verb: "DELETE" },
            { path: "/categories/:category_id/items", method: inventory.getItemsForCategory, verb: "GET" },
        ]
    }
};

exports.init = function(app, session) {
    app.use(function(req, res, next) {
        if (req.url.match(/\/ios/))
            next();
        else
            session(req, res, next);
    });
    app.use(app.router);

    routes["web"]["endpoints"].forEach(function(route)
    {
      var authFilter = function(req, res, next)
      {
        if (req.session.userId)
          return next();
        else
          res.send(403);
      };
      var errorFilter = function(req, res, err)
      {
        res.send(500, err.toString());
      };
      register(route, authFilter, errorFilter);
    });

    function register(route, authFilter, errorFilter) {
        var verb = (route.verb || "GET").toLowerCase();
        var args = [route.path];
        if (!route.anonymous)
            args.push(authFilter);

        args.push(function (req, res, next) {
            Q.try(function () { return route.method(req, res); })
                .catch(function (err) {
                    console.log(route.path + ": " + err.toString());
                    errorFilter(req, res, err);
                });
        });

        app[verb].apply(app, args);
    }
};
