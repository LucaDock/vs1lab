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
function updateLocation() {
    if (document.getElementById("latId").getAttribute("value") === "" || document.getElementById("longId").getAttribute("value") === ""){
        LocationHelper.findLocation(function (loc) {
            document.getElementById("hiddenLatitude").setAttribute("value", loc.latitude);
            document.getElementById("hiddenLongitude").setAttribute("value", loc.longitude);
            document.getElementById("latId").setAttribute("value", loc.latitude);
            document.getElementById("longId").setAttribute("value", loc.longitude);
            makeMap(loc.latitude, loc.longitude);
        });
    } else {
        let latitude = document.getElementById("latId").getAttribute("value");
        let longitude = document.getElementById("longId").getAttribute("value");
        makeMap(latitude, longitude);
    }

    //A4
    var addBtn = document.getElementById("addTag");
    var searchBtn = document.getElementById("search");
        
    addBtn.addEventListener("click",function(e) {
        e.preventDefault();
        var nameVal = document.getElementById("name").getAttribute("value");
        console.log(nameVal);
        if(document.getElementById("tag-form").reportValidity())
        {
        var obj =  {
            name: nameVal,
            latitude: document.getElementById("latId").getAttribute("value"),
            longitude:document.getElementById("longId").getAttribute("value"),
            hashtag: document.getElementById("hashtag").getAttribute("value")
        };
  
        
        fetch("http://localhost:3000/geotags", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body : JSON.stringify(obj)
        })
            .then(function(res){console.log(res)})
            .catch(error => console.log("Error: ", error));
        
        }else{
        }
    });
}


function makeMap(latitude, longitude) {
    let tags = JSON.parse(document.getElementById("mapView").getAttribute("data-tags"));
    var mapManager = new MapManager("6AB9OiZEGTfSzxH1j99rJ5gdz2NyKlGw"); 
    let url = mapManager.getMapUrl(latitude, longitude, tags,16);
    document.getElementById("mapView").setAttribute("src", url);
}

document.addEventListener("DOMContentLoaded", updateLocation(), true);
