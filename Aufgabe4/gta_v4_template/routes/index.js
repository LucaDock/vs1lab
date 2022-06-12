// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();
const gtStore = require('../models/geotag-store');
const memory = new gtStore();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');

// App routes (A3)
//A3
memory .loadExamples();

router.get('/', (req, res) => {
  res.render('index', { taglist: memory.getArr() , userLatValue: "", userLongValue: "", tagGeoTag: JSON.stringify(memory.getArr())})
});

router.post(`/tagging`, function(req, res){    
  memory.addGeoTag(new GeoTag(req.body.name, req.body.userLat, req.body.userLong, req.body.hashtag));
  let x = memory.getNearbyGeoTags(req.body.userLat, req.body.userLong);
    res.render("index", { 
      taglist: x,
      userLatValue: req.body.userLat,
      userLongValue: req.body.userLong,
      tagGeoTag: JSON.stringify(x)
    });   
});

router.post(`/discovery`, function(req, res){
  var kw = req.body.search;
  var arr = memory.searchNearbyGeoTags(kw);
  
  res.render("index", { 
    taglist: arr,
    userLatValue: req.body.hiddenUserLat,
    userLongValue: req.body.hiddenUserLong,
    tagGeoTag: JSON.stringify(arr)
  });   
});


/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  res.render('index', { taglist: [] })
});


// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

 router.get('/geotags/', function(req, res){ 
   
  console.log(req.query.search);
    if(req.query.search !== "")   
    {
      res.json(memory.searchNearbyGeoTags(req.query.search));
    }else if(req.body.userLat !== undefined && req.body.userLong !== undefined) {
      res.json(memory.getNearbyGeoTags(req.body.userLat, req.body.userLong));
    }
  }); 
   

/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */


 router.post('/geotags/', function(req, res){ 
  console.log(req.body);
  memory.addGeoTagToMap(req.body); 
  res.status(201).end(); 
  
  }); 

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */



 router.get('/geotags/:id', function(req, res){ 
    res.json(memory.map.get(parseInt(req.params.id)));   
}); 



/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

 router.put('/geotags/:id', function(req, res){ 
  console.log(req.params.id, req.body);
  memory.update(req.params.id, req.body);
  res.status(200).end();
  }); 

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

 router.delete('/geotags/:id', function(req, res){ 
  res.json(memory.delete(parseInt(req.params.id)));   
}); 







module.exports = router;
