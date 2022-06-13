// File origin: VS1LAB A3

const GeoTag = require("./geotag");
const GeoTagExamples = require("./geotag-examples");
/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore {
    #array = [];

    map = new Map();

    loadExamples()
    {
        let array = GeoTagExamples.tagList;
        for (let i = 0; i < array.length; i++) {
                this.addGeoTag(new GeoTag(array[i][0], array[i][1],array[i][2],array[i][3]));
        }
    }

    #radius = 1000;

    getArr()
    {
        return this.#array;
    }

    getMap()
    {
        return this.map;
    }


    /**
     * 
     * 
     * @param {GeoTag} tag 
     */
    addGeoTag(tag) {
        this.#array.push(tag);
        let length = this.#array.length;
        this.map.set(length, {latitude: tag.latitude, longitude: tag.longitude, name: tag.name, hashtag: tag.hashtag});
    }

    /**
     * 
     * @param {String} name 
     */
    removeGeoTag(name) {
        for (let i = 0; i < this.#array.length; i++) {
            if (name === this.#array[i].name) {
                this.array.splice(i);
                break;
            }
        }
    }

    
    getNearbyGeoTags(latitude, longitude) {
        var radius = this.#radius;
        var res = [];
        var x = latitude;
        var y = longitude;
        this.#array.forEach(function (current) {
            var curX = current.latitude-x;
            var curY=current.longitude-y;
            var sqrX = curX*curX ;
            var sqrY =  curY*curY;
            var sqrR = radius * radius;
            if((sqrX+sqrY) <= sqrR) 
            {
                res.push(current);
            }
        });
        return res;
    }

    /**
     *
     * @param {String} searchVal
     */
    searchNearbyGeoTags(searchVal) {
        var newArray = [];
        this.#array.forEach(function (current) {
            if (current.name.includes(searchVal) | current.hashtag.includes(searchVal)) newArray.push(current); 
        });
        return newArray;
    }

    // A4

addGeoTagToMap(tag) {
    this.map.set(this.#array.length+1, tag);
    this.#array.push(new GeoTag(tag.name, tag.latitude,tag.longitude,tag.hashtag));
}

update(id, tag) {
    var mapGT = this.map.get(parseInt(id));
    this.map.set(id, tag);
    var newGT = new GeoTag(tag.name, tag.latitude,tag.longitude,tag.hashtag);
    var index = 0;
    var res=-1;
    this.#array.forEach(function (current){
        if(current.name === mapGT.name && current.latitude === mapGT.latitude
             && current.longitude === mapGT.longitude && current.hashtag === mapGT.hashtag)
        {
            res = index;
        }
        index++;
    });
    this.#array[res] = newGT;
}

delete(id, tag) {
    var mapGT = this.map.get(parseInt(id));
    this.map.delete(parseInt(id));
    var index = 0;
    var res =-1;
    this.#array.forEach(function (current){
        if(current.name === mapGT.name && current.latitude === mapGT.latitude
             && current.longitude === mapGT.longitude && current.hashtag === mapGT.hashtag)
        {
            res = index;
        }
        index++;
    });
    this.#array.splice(res);
}

}

module.exports = InMemoryGeoTagStore
