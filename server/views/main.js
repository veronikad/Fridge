var _ = require("underscore"),
    Backbone = require("backbone"),
    Products ="collections/products",
    View ="views/product";

var MainView = Backbone.View.extend({
  template: "templates/index",

  events: {
    'click #new-product': 'createOnEnter'
  },

  initialize: function(){
    this.listenTo(Products, "add", this.addProduct);

    Products.fetch();
  },

  render: function(){
    //var expired = Products.expired().length;
    //var eatSoon = Products.willExpireSoon().length;

    Products.each(function(product){
      var itemView = new View.ProductItemView({model: product});
      $("#productGrid").append(itemView.render().el);
    });

    return this;
  },
  addProduct: function(product){
    var itemView = new View.ProductItemView({model:product});
    $("#productGrid").append(itemView.render().el);
  }
});

_.extend(exports, {
  MainView: MainView
});