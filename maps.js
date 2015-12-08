var mapLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {minZoom: 17, maxZoom: 18, attribution: 'Map data � <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'});
var map = L.map('map', {layers: [mapLayer]}).setView([43.08433, -77.6767], 11);
var polygon = [];
var baseMaps = {
    'RIT': mapLayer
}
var locs = new Array();
locs.push({name:"Java's", min_time:1, max_time:3, lat:43.08402064117729, long:-77.6761668920517});
locs.push({name:"Midnight Oil / Cross Roads", min: 1, max: 3, lat: 43.08265719062045, lng: -77.68001854419708});
locs.push({name:"Library", min: 1, max: 4, lat: 43.08265719062045, lng: -77.68001854419708});
locs.push({name:"Gracie's", min: 1, max: 1, lat: 43.08402064117729, lng: -77.6761668920517});
locs.push({name:"Ctrl-Alt-Deli", min: 1, max: 1, lat: 43.08265719062045, lng: -77.68001854419708});
locs.push({name:"Freshen's", min: 1, max: 2, lat: 43.08402064117729, lng: -77.6761668920517});
locs.push({name:"Dorms", min: 3, max: 100, lat: 43.08265719062045, lng: -77.68001854419708});
locs.push({name:"Global Village Grille", min: 1, max: 2, lat: 43.08402064117729, lng: -77.6761668920517});

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
  var smin = Math.floor(start.split(":")[1].split(" ")[0]);
  var t = (start.indexOf("pm") > -1 && !(shour == 12));
  if(t) {
    var smorning = 1200;
  } else {
    var smorning = 0;
  }
  var end = prompt("Enter what time you class ends", "" + (shour + 1) + ":00" + " am");
  var ehour = Math.floor(end.split(":")[0]);
  var emin = Math.floor(end.split(":")[1].split(" ")[0]);
  t = (end.indexOf("pm") > -1 && !(ehour == 12));
  if(t) {
    var emorning = 1200;
  } else {
    var emorning = 0;
  }
  classes.push({start_time: shour*100 + smin + smorning, end_time: ehour*100 + emin + emorning, lat: e.latlng.lat, lng: e.latlng.lng});
  popup.setLatLng(e.latlng)
  .setContent("Class created at " + shour + ":" + smin + " till " + ehour + ":" + emin)
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
  /*for(i=0;i<classes.length;i++) {
    str += classes[i].start_time + ', ' + classes[i].end_time + ', ' + classes[i].lat  + ', ' + classes[i].lng +'<br>';
  }
  document.getElementById("sched").innerHTML = str;*/
  var time_diff;
  var t;
  var temp;
  var dist_sorted = locs;
  var min;
  var min_dist;
  for(i=1;i<classes.length;i++) {
    time_diff = classes[i].start_time - classes[i-1].end_time;
    t = Math.round(time_diff / 100);
    dist_sorted = locs;
    for(j=0;j<locs.length;j++) {
      min = j;
      min_dist = 99999999.9;
      for(k=j;k<locs.length;k++) {
        dist = Math.sqrt(Math.pow(classes[i].lat - locs[k].lat,2) + Math.pow(classes[i].long - locs[k].long,2)) + Math.sqrt(Math.pow(classes[i-1].lat - locs[k].lat,2) + Math.pow(classes[i-1].long - locs[k].long,2));
        if(dist < min_dist) {
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
