// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");



/**
 * A class to help using the HTML5 Geolocation API.
 */
// eslint-disable-next-line no-unused-vars
/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation(newtags) {
    if (document.getElementById("latId").getAttribute("value") === "" || document.getElementById("longId").getAttribute("value") === ""){
        LocationHelper.findLocation(function (loc) {
            document.getElementById("hiddenLatitude").setAttribute("value", loc.latitude);
            document.getElementById("hiddenLongitude").setAttribute("value", loc.longitude);
            document.getElementById("latId").setAttribute("value", loc.latitude);
            document.getElementById("longId").setAttribute("value", loc.longitude);
            makeMap(loc.latitude, loc.longitude,newtags);
        });
    } else {
        let latitude = document.getElementById("latId").getAttribute("value");
        let longitude = document.getElementById("longId").getAttribute("value");
        makeMap(latitude, longitude,newtags);
    }
}

    //A4
    var addBtn = document.getElementById("addTag");
    var searchBtn = document.getElementById("search");
        
    addBtn.addEventListener("click",function(e) {
        e.preventDefault();
        if(document.getElementById("tag-form").reportValidity()){
        var obj =  {
            name: document.getElementById("name").value,
            latitude: document.getElementById("latId").getAttribute("value"),
            longitude:document.getElementById("longId").getAttribute("value"),
            hashtag: document.getElementById("hashtag").value
        };
                
            postGeotag(obj)
                .then(fun => updateView(await getGeotag()))
                .catch(error => console.log("Error: ", error));
        }
    });

    async function updateView(arr){
        document.getElementById('discoveryResults').innerHTML="";
        arr.forEach(function(gtag) {
            var newElem = document.createElement("li");
            newElem.innerHTML=gtag.name +" ( "+ gtag.latitude + "," + gtag.longitude +") " + gtag.hashtag;
            document.getElementById('discoveryResults').appendChild(newElem);
        });
        updateLocation(arr);   
    }

    
    searchBtn.addEventListener("click",function(e) {
    e.preventDefault();
    if(document.getElementById("discoveryFilterForm").reportValidity())
    {
    
    var searchVal = document.getElementById("searchvalue").value;
    searchGeotags(searchVal)
        .then(res => console.log(res))
        .catch(error => console.log("Error: ", error));
    }
    });

async function getGeotag(){
    const res = await fetch("http://localhost:3000/geotags", {
        method: "GET"
    });
    return res.json();
}

async function postGeotag(obj){
    const res = await fetch("http://localhost:3000/geotags", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body : JSON.stringify(obj)
    });
    return res;
}

async function searchGeotags(val){
const res = await fetch("http://localhost:3000/geotags?search="+val, {
    method: "GET",
});
return res.json();
}

function makeMap(latitude, longitude , newTags) {
    let tags = JSON.parse(document.getElementById("mapView").getAttribute("data-tags"));
    var mapManager = new MapManager("6AB9OiZEGTfSzxH1j99rJ5gdz2NyKlGw"); 
    let url = mapManager.getMapUrl(latitude, longitude, newTags == null ? tags : newTags ,16);
    console.log("se");
    document.getElementById("mapView").setAttribute("src", url);
}

document.addEventListener("DOMContentLoaded", updateLocation(null), true);