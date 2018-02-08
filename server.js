// grab the packages we need
var express = require('express');
var util = require('util');
var app = express();
var port = process.env.PORT || 8081;
var dateFormat = require('dateformat');
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var MongoClient = require('mongodb').MongoClient;
// routes will go here

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);

function time(){
	return dateFormat(new Date(), "isoDateTime");
}

//CORS on ExpressJS
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

// routes will go here
app.get('/api/users', function(req, res) {
	console.log(time() + " : list databases " + util.inspect( req.params ) );
  	var user_id = req.param('id');
  	var token = req.param('token');
  	var geo = req.param('geo');  
  	res.status(200).json({ user : user_id , token :  token , geo : geo });
})

//list databases
app.get('/api/databases', function(req, res) {	
	console.log(time() + " : list databases " + util.inspect( req.params ) );
	MongoClient.connect("mongodb://localhost:27017", function (err, client){
	    if(err) throw err;
	    var db = client.db('carrier-data');
	    db.admin().listDatabases(function(err, dbs) {
    		res.status(200).json(dbs.databases);
  		});
	});
})

//list collections
app.get('/api/databases/:db', function(req, res) {
	console.log(time() + " : list collections " + util.inspect( req.params ) );
	var db_name = req.params.db;
	MongoClient.connect("mongodb://localhost:27017", function (err, client){
	    if(err) throw err;
		var db = client.db(db_name);
	    db.collections(function(err, collections){
	    	if(err) throw err; 
	    	var collections_js = { database : db_name , collections : []};
	    	collections.forEach(function (collection) {
    			console.log(time() + " : " + collection.s.namespace);
    			collections_js.collections.push(collection.s.namespace);
			});
			res.status(200).json(collections_js);
  		});
	});
})

//list collection
app.get('/api/databases/:db/:col', function(req, res) {
	console.log(time() + " : view collection " + util.inspect( req.params ) );
	var db_name = req.params.db;
	var col_name = req.params.col;
	
	MongoClient.connect("mongodb://localhost:27017", function (err, client){
	    if(err) throw err;
		var db = client.db(db_name);
	    db.collection(col_name, function (err, collection) {
	         collection.find().toArray(function(err, items) {
	            if(err) throw err;    
	            res.status(200).json(items);;            
	        });
    	});
	});
})

/*

*/
//list collection count
app.get('/api/databases/:db/:col/count', function(req, res) {
	console.log(time() + " : count records " + util.inspect( req.params ) );
	var db_name = req.params.db;
	var col_name = req.params.col;
	MongoClient.connect("mongodb://localhost:27017", function (err, client){
	    if(err) throw err;
		var db = client.db(db_name);
	    db.collection(col_name).count(function (err, count) {
	        if (err) throw err;
	       res.status(200).json({ count : count });

	    });
	});
})

//query collection
app.get('/api/databases/:db/:col/:qry', function(req, res) {
	console.log(time() + " : query a collection " + util.inspect( req.params ) );	
	var db_name = req.params.db;
	var col_name = req.params.col;
	var query = req.params.qry;
	query = JSON.parse(query);
	MongoClient.connect("mongodb://localhost:27017", function (err, client){
	    if(err) throw err;
		var db = client.db(db_name);
	    db.collection(col_name, function (err, collection) {
	         collection.find(query).toArray(function(err, items) {
	            if(err) throw err;    
	            res.status(200).json(items);;            
	        });
    	});
	});
})

app.post('/postapi/databases/:db/:col', function(req, res) {
	console.log(time() + " : post a collection " + util.inspect( req.params ) + util.inspect(req.body));	
	var db_name = req.params.db;
	var col_name = req.params.col;
	var id = "5a7b901a23b5a5dc794f4bc3";
	//req.params.id;
	var data = req.body;
	var updateValue = { $set : { _id : id , goals : data.goals }};
	MongoClient.connect("mongodb://localhost:27017", function (err, client){
	    if(err) throw err;
		var db = client.db(db_name);
	    db.collection(col_name, function (err, collection) {
	         collection.update({_id : id} , updateValue, function(err, res1) {
    			if (err) throw err;
    			console.log(res1);
    			res.status(200).json(res1);
 			});
    	});
	});
})

