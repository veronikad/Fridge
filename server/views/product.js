var $ = require("jquery"),
    _ = require("underscore"),
    Backbone = require("backbone");

var ProductView = Backbone.View.extend({
    template: "templates/product",
    initialize: function() {
        this.listenTo(this.model, "change", this.render);
    },
    events: {},
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        $('#main').append(view.render().el);

        return this;
    }
});

var ProductItemView = Backbone.View.extend({
    template: "templates/productItem",
    initialize: function(){
        this.listenTo(this.model, "change", this.render);
    },
    events: {
        "click .delete-product-item": "deleteProductItem",
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        $("#productGrid").append(view.render().el);

        return this;
    },
    deleteProductItem: function(){
        console.log("deleting item");
    }
});
_.extend(exports, {
    ProductView: ProductView,
    ProductItemView: ProductItemView
});