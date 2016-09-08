/*thank you for taking the time to review this code. This was written with 
lots of help Udacity forums, courses, and Udacity members as well as stackoverflow
suggestions*/
//data object, array containing name, coordinates, and short description
var locations = [{
    name: 'Texas State Capitol',
    lat: 30.2746935,
    lng: -97.7402858,
    description: 'The biggest capitol building in the United States'
}, {
    name: 'University of Texas Tower',
    lat: 30.2861019,
    lng: -97.7394096,
    description: 'The primary landmark of the University of Texas'
}, {
    name: 'Texas State Cemetery',
    lat: 30.2660563,
    lng: -97.7260974,
    description: 'Many notable Texans and Confederates are buried here'
}, {
    name: 'Sixth Street Historic District',
    lat: 30.267026,
    lng: -97.7393645,
    description: 'Still a party hotspot'
}, {
    name: "Texas Governor's Mansion",
    lat: 30.272676,
    lng: -97.7431553,
    description: 'Located across the street from the Capitol'
}, {
    name: 'LBJ Presidential Library',
    lat: 30.2858235,
    lng: -97.7290749,
    description: 'Designed by a famous modernist architect'
}, {
    name: 'Congress Avenue Bridge',
    lat: 30.2616834,
    lng: -97.7449977,
    description: 'Largest urban bat colony'
}];

//initializes the map and defines the gmaps infowindow
function initMap() {
     var Map = document.getElementById('map');
     vm.map = new google.maps.Map(Map, {
         center: {
             lat: 30.2727573,
             lng: -97.7452755
         },
         zoom: 14,
         disableDefaultUI: false,
         clickableIcons: false,
     });
     vm.infowindow = new google.maps.InfoWindow({
         maxWidth: 200
     });

     //iterates through the ko.locationList array and creates a new marker
     vm.locationList().forEach(function(location) {
         var marker = new google.maps.Marker({
             position: new google.maps.LatLng(location.lat(), location.lng()),
             animation: google.maps.Animation.DROP,
             map: vm.map
         });
         location.marker = marker;
         //attaches a click event listener to the marker, opens the infowindow 
         //and executes the wiki search
         google.maps.event.addListener(marker, 'click', function() {
             WikiApi(location.name());
             animation(location.marker);
             vm.infowindow.setContent("" + location.description());
             vm.infowindow.open(vm.map, location.marker);
         });

     });
 }

 /*Wikipedia search function using the Wikipedia API, which performs 
 and AJAX request when executed. Gives a timeout Alert if request is not
 fulfilled 5000ms*/ 
 //based on the Udacity 'Intro to AJAX' course. 
 function WikiApi(param) {
     var name = param;
     var reqUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' 
        + name + '&limit=1&format=json&callback=wikiCallback';
     var wikiRequestTimeout = setTimeout(function() {
         alert("Failed to get Wikipedia information");
     }, 5000);
     // AJAX
     $.ajax({
         url: reqUrl,
         dataType: "jsonp",
         success: function(response) {
             var wikiList = response[1];
             for (var i = 0; i < wikiList.length; i++) {
                 wikiData = wikiList[i];
                 var url = 'https://en.wikipedia.org/wiki/' + wikiData;
             }
             windowContent = '<h4>Wikipedia</h4>' + '<h5><a href="' 
                + url + '">' + wikiData + '</a></h5>';
             $(".gm-style-iw").prepend(windowContent);
             console.log(windowContent);
             clearTimeout(wikiRequestTimeout);
         }
     });
     
 }


 //sets up animation for marker actions. 
 var animation = function(marker) {
     if (marker.getAnimation() !== null) {
         marker.setAnimation(null);
     } else {
         marker.setAnimation(google.maps.Animation.BOUNCE);
         setTimeout(function() {
             marker.setAnimation(null);
         }, 700);
     }
 };


//create error message if google maps API fails to load
 var apiError = function() {
     alert('Unfortunately, Google Maps is currently unavailable.');
 };


 //object to receive user input in search function
 var userInput = (" ");
 //sets up KO object
 var Location = function(data) {
    this.name = ko.observable(data.name),
    this.description = ko.observable(data.description),
    this.lat = ko.observable(data.lat),
    this.lng = ko.observable(data.lng),
    this.LatLng = ko.computed(function() {
        return this.lat() + "," + this.lng();
    }, this);
 };

 //sets up KO viewmodel
 var ViewModel = function() {
     var self = this;
     var location = ko.utils.arrayMap(locations, function(location) {
         return new Location(location);
     });
     self.locationList = ko.observableArray(location);
     self.filter = ko.observable('');

     //binds list item to marker action, also performs wiki search
     self.select = function(location) {
             WikiApi(location.name());
             animation(location.marker);
             vm.infowindow.setContent('' + location.description());
             vm.infowindow.open(vm.map, location.marker);
         };
     //KO function used to compute the search and eliminate list items. 
     //based on KO documentation
     self.filteredItems = ko.computed(function() {
         var listFilter = self.filter().toLowerCase();
         return ko.utils.arrayFilter(self.locationList(), function(item) {
             if (item.name().toLowerCase().indexOf(listFilter) > -1) {
                 if (item.marker) item.marker.setVisible(true);
                 return true;
             } else {
                 item.marker.setVisible(false);
                 vm.infowindow.close(vm.map, location.marker);
                 return false;
             }
         });
     }, self);

 }; 

 //defines viewmodel and applies binding
 var vm = new ViewModel();
 ko.applyBindings(vm);