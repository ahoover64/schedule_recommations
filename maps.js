var mapLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {minZoom: 17, maxZoom: 18, attribution: 'Map data � <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'});
var map = L.map('map', {layers: [mapLayer]}).setView([43.08433, -77.6767], 11);
var polygon = [];
var baseMaps = {
    'RIT': mapLayer
}
var locs = new Array();
locs.push({name:"Java's", min_time:1, max_time:3, lat:43.08412, lng: -77.67627});
locs.push({name:"Midnight Oil / Cross Roads", min: 1, max: 3, lat: 43.08258, lng: -77.67972});
locs.push({name:"Library", min: 1, max: 4, lat: 43.08393, lng: -77.6763});
locs.push({name:"Gracie's", min: 1, max: 1, lat: 43.08386, lng: -77.66904});
locs.push({name:"Ctrl-Alt-Deli", min: 1, max: 1, lat: 43.08461, lng: -77.6801});
locs.push({name:"Freshen's", min: 1, max: 2, lat: 43.08551, lng: -77.67913});
locs.push({name:"Dorms", min: 3, max: 100, lat: 43.08542, lng: -77.66897});
locs.push({name:"Global Village Grille", min: 1, max: 2, lat: 43.08305, lng: -77.68046});

var classes = new Array();


var popup = L.popup();
function getActiveLayer() {
    var elements = document.getElementsByName('layer');
    for (i=0;i<elements.length;i++) {
        if(elements[i].checked === true) {
            return elements[i].value;
        }
    }
}

function onMapClick(e) {
  var start = prompt("Enter what time you class starts", "8:00 am");
  var shour = Math.floor(start.split(":")[0]);
  if(shour > 99) {
    var smin = shour % 100;
    shour = shour / 100;
    var t = false;
  } else if(shour>12) {
    shour = shour - 12;
    var smin = Math.floor(start.split(":")[1].split(" ")[0]);
    var t = true;
  } else {
    var smin = Math.floor(start.split(":")[1].split(" ")[0]);
    var t = (start.indexOf("pm") > -1 && !(shour == 12));
  }
  if(t) {
    var smorning = 1200;
  } else {
    var smorning = 0;
  }
  var end = prompt("Enter what time you class ends", "" + (shour + 1) + ":00" + " am");
  var ehour = Math.floor(end.split(":")[0]);
  if(ehour > 99) {
    var emin = ehour % 100;
    ehour = ehour / 100;
    var t = false;
  } else if(ehour>12) {
    ehour = ehour - 12;
    var emin = Math.floor(end.split(":")[1].split(" ")[0]);
    var t = true;
  } else {
    var emin = Math.floor(end.split(":")[1].split(" ")[0]);
    var t = (end.indexOf("pm") > -1 && !(ehour == 12));
  }
  if(t) {
    var emorning = 1200;
  } else {
    var emorning = 0;
  }
  var st = shour*100 + smin + smorning;
  var et = ehour*100 + emin + emorning;
  classes.push({start_time: st, end_time: et, lat: e.latlng.lat, lng: e.latlng.lng});
  popup.setLatLng(e.latlng)
  .setContent("Class created from " + st + " till " + et)
  .openOn(map);
  L.marker(e.latlng).addTo(map);
}
map.on('click', onMapClick);

function sortClasses() {
  var min = 0;
  var t;
  for (i=0;i<classes.length;i++) {
    min = i;
    for(j=i;j<classes.length;j++) {
      if(classes[j].start_time < classes[min].start_time) {
        min = j;
      }
    }
    t = classes[min];
    classes[min] = classes[i];
    classes[i] = t;
  }
}

function makeSchedule() {
  sortClasses();
  var str = "";
  var time_diff;
  var t;
  var temp;
  var dist_sorted = locs;
  var min;
  var min_dist;
  for(i=1;i<classes.length;i++) {
    time_diff = classes[i].start_time - classes[i-1].end_time;
    t = Math.round(time_diff / 100.0);
    dist_sorted = locs;
    for(j=0;j<locs.length;j++) {
      min = j;
      min_dist = -1.0;
      for(k=j;k<locs.length;k++) {
        dist = Math.sqrt(Math.pow(classes[i].lat - locs[k].lat,2) + Math.pow(classes[i].lng - locs[k].lng,2)) + Math.sqrt(Math.pow(classes[i-1].lat - locs[k].lat,2) + Math.pow(classes[i-1].lng - locs[k].lng,2));
        if(dist < min_dist || min_dist == -1.0) {
          min_dist = dist;
          min = k;
        }
      }
      temp = locs[j];
      locs[j] = locs[min];
      locs[min] = temp;
    }
    str += "From " + classes[i-1].end_time + " till " + classes[i].start_time + " you should go to: "
    for(j=0;j<locs.length;j++) {
      if(locs[j].min <= t && locs[j].max >= t) {
        str += locs[j].name + ", ";
      }
    }
    if(t < 1) {
	str += "Straight to class";
    }
    str += "<br>";
  }
  document.getElementById("sched").innerHTML = str;
}

function whatToDo(class1, class2) {

}
