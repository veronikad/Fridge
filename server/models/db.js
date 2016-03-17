var _ = require('underscore'),
    Q = require('Q');
var options = {
  promiseLib: Q
};
var pg = require('pg-promise')(options);

var conString = process.env.DATABASE_URL || 'postgres://localhost:5432/fridge';

//var client = new pg.Client(conString);
//client.connect();
//var query = client.query('CREATE TABLE item (itemId      SERIAL PRIMARY KEY, code      	varchar(80), name      	varchar(100) NOT NULL,  brand	varchar(100), UNIQUE (code, name, brand));');
//query.on('end', function() { client.end(); });

var db = pg(conString);

_.extend(exports, {
  getItems:function()
  {
    return db.manyOrNone('select code, name, brand, bestBefore from inventory inner join item on inventory.itemId = item.itemId order by bestBefore desc');
  },

  createItem: function (code, name, brand, bestBefore)
  {
    db.oneOrNone('select itemId, name, brand from item where ' + code ? 'code=$1' : 'name=$2 and brand=$3', code, name, brand)
      .then(data)
      {
        console.log(error, data);
        //item is known - update captions, insert to inventory
        if (data)
        {
          if (data.name == name && data.brand == brand)
          {
            return t.none('insert into inventory (itemId, bestBefore) values($1, $2)', [data.itemId, bestBefore])
          }
          else
          {
            //code is entered
            return db.tx(function(t)
            {
              return t.batch([
                t.none('update item set name=$2, brand=$3 where code=$1', [code, name, brand]),
                t.none('insert into inventory (itemId, bestBefore) values($1, $2)', [data.itemId, bestBefore])
              ]);
            })
          }
        }
        else
        {
          //item is unknown - insert into item + inventory
          db.one('insert into item (code, name, brand) values($1, $2, $3) returning itemId', [code, name, brand])
            .then(item)
            {
              return t.none('insert into inventory (itemId, bestBefore) values($1, $2)', [item.itemId, bestBefore])
            }
        }
      };
  },

  getItem: function (code)
  {
    return db.oneOrNone('select * from item where code=$1', code);
  },

  deleteItem: function (id)
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

  getItemsForCategory: function (id)
  {
    return db.manyOrNone('select code, name, brand from item inner join itemCategory on (item.itemId = itemCategory.itemId) and itemCategory.categoryId = $1', id);
  },
});

// $ createdb Fridge;
// CREATE TABLE item (
    // itemId      SERIAL PRIMARY KEY,
    // code      	varchar(80),
    // name      	varchar(100) NOT NULL,
    // brand	varchar(100),
    // UNIQUE (code, name, brand)
// );
// CREATE INDEX ON item (code);

// CREATE TABLE category (
    // categoryId  SERIAL PRIMARY KEY,
    // name 	varchar(100) NOT NULL,
    // UNIQUE (name)
// );

// CREATE TABLE itemCategory(
    // itemId       integer REFERENCES item(itemId),
    // categoryId integer REFERENCES category(categoryId) 
// );

// CREATE TABLE inventory(
    // inventoryId SERIAL PRIMARY KEY,
    // itemId      	integer REFERENCES item(itemId),
    // bestBefore 	date NOT NULL
// );
