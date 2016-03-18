var _ = require('underscore'),
    promise = require("promise");

var options = {
  promiseLib: promise
};
var pg = require('pg-promise')(options);

var conString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/Fridge';

//var client = new pg.Client(conString);
//client.connect();
//var query = client.query('CREATE TABLE product (productId      SERIAL PRIMARY KEY, code      	varchar(80), name      	varchar(100) NOT NULL,  brand	varchar(100), UNIQUE (code, name, brand));');
//query.on('end', function() { client.end(); });

var db = pg(conString);

_.extend(exports, {
  getProducts:function()
  {
      return db.manyOrNone('select code, name, brand, bestBefore from inventory inner join product on inventory.productId = product.productId order by bestBefore desc');
  },

  createProduct: function (code, name, brand, bestBefore)
  {
      return db.oneOrNone('select productId, name, brand from product where ' + (code ? 'code=$1' : 'name=$2 and brand=$3'), code, name, brand)
      .then(function(data)
      {
        //product is known - update captions, insert to inventory
        if (data)
        {
          if (data.name == name && data.brand == brand)
          {
            return db.none('insert into inventory (productId, bestBefore) values($1, $2)', [data.productId, bestBefore])
          }
          else
          {
            //code is entered
            return db.tx(function(t)
            {
              return t.batch([
                t.none('update product set name=$2, brand=$3 where code=$1', [code, name, brand]),
                t.none('insert into inventory (productId, bestBefore) values($1, $2)', [data.productId, bestBefore])
              ]);
            })
          }
        }
        else
        {
          //product is unknown - insert into product + inventory
          return db.one('insert into product (code, name, brand) values($1, $2, $3) returning productId', [code, name, brand])
            .then(function(product)
            {
              return db.none('insert into inventory (productId, bestBefore) values($1, $2)', [product.productid, bestBefore])
            })
        }
      });
  },

  getProduct: function (code)
  {
    return db.oneOrNone('select * from product where code=$1', code);
  },

  deleteProduct: function (id)
  {
    return db.none('delete from inventory where inventoryId=$1', id);
  },

  getCategories: function ()
  {
    return db.manyOrNone('select * from category');
  },

  createCategory: function (name)
  {
    return db.none('insert into category (name) values ($1)', name);
  },

  getCategory: function (id)
  {
    return db.oneOrNone('select * from category where categoryId=$1', id);
  },

  deleteCategory: function (id)
  {
    return db.none('delete from category where categoryId=$1', id);
  },

  getProductsForCategory: function (id)
  {
    return db.manyOrNone('select code, name, brand from product inner join productCategory on (product.productId = productCategory.productId) and productCategory.categoryId = $1', id);
  },
});

// $ createdb Fridge;
// CREATE TABLE product (
    // productId      SERIAL PRIMARY KEY,
    // code      	varchar(80),
    // name      	varchar(100) NOT NULL,
    // brand	varchar(100),
    // UNIQUE (code, name, brand)
// );
// CREATE INDEX ON product (code);

// CREATE TABLE category (
    // categoryId  SERIAL PRIMARY KEY,
    // name 	varchar(100) NOT NULL,
    // UNIQUE (name)
// );

// CREATE TABLE productCategory(
    // productId       integer REFERENCES product(productId),
    // categoryId integer REFERENCES category(categoryId) 
// );

// CREATE TABLE inventory(
    // inventoryId SERIAL PRIMARY KEY,
    // productId      	integer REFERENCES product(productId),
    // bestBefore 	date NOT NULL
// );
