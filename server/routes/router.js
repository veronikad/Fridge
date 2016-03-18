var Promise = require("promise"),
    //authentication = require("./authentication"),
    inventory = require(__base + "server/models/inventory");
    index = require(__base + "server/models/index");

var routes = {
    web: {
        endpoints: [
            //{ path: "/authenticate/init", method: authentication.web.authenticate, anonymous: true },
            //{ path: "/authenticate/info", method: authentication.web.info, anonymous: true },
            //{ path: "/logout", method: authentication.web.logout },
            { path: "/products", method: inventory.getProducts, verb: "GET" },
            { path: "/products", method: inventory.createProduct, verb: "POST" },
            { path: "/products/code/:code", method: inventory.getProduct, verb: "GET" },
            { path: "/products/:product_id", method: inventory.deleteProduct, verb: "DELETE" },
            { path: "/categories", method: inventory.getCategories, verb: "GET" },
            { path: "/categories", method: inventory.createCategory, verb: "POST" },
            { path: "/categories/:category_id", method: inventory.getCategory, verb: "GET" },
            { path: "/categories/:category_id", method: inventory.deleteCategory, verb: "DELETE" },
            { path: "/categories/:category_id/products", method: inventory.getProductsForCategory, verb: "GET" },
        ],
        pages: [
            { path: "/", method: index.render },
            { path: "/product", method: index.product }
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
        return next();
        // if (req.session.userId)
        //   return next();
        // else
        //   res.send(403);
      };
      var errorFilter = function(req, res, err)
      {
        res.send(500, err.toString());
      };
      register(route, authFilter, errorFilter);
    });

    routes["web"]["pages"].forEach(function(route)
    {
        var authFilter = function(req, res, next)
        {
            return next();
            // if (req.session.userId)
            //   return next();
            // else
            //   res.send(403);
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
        //if (!route.anonymous)
        //    args.push(authFilter);

        args.push(function (req, res, next) {

            try {
                var promise = route.method(req, res);
                if (promise)
                    promise.catch(function (err) {
                        console.log(route.path + ": " + err.toString());
                        errorFilter(req, res, err);
                    });
            }
            catch (err) {
                errorFilter(req, res, err);
            }
        });

        app[verb].apply(app, args);
    }
};
