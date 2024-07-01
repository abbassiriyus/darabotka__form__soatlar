function connectScript(name) {
    var script = document.createElement('script');

    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', name);

    document.body.appendChild(script);
}



function googleMapEngine() {
    this.markers = [];
    this.pin = false;
}

function yandexMapEngine() {
    this.markers = [];
    this.pin = false;
}



googleMapEngine.prototype.show = function(block){
    var latlng = new google.maps.LatLng(55.791471,37.622816);
    var mapOptions = {
        zoom: 17,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false
        /*mapTypeControl: false,
        disableDefaultUI: true,
        */
    };

    mapOptions.styles = [
        {
            "featureType": "all",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": -40
                },
                {
                    "gamma": 0.8
                },
                {
                    "lightness": "2"
                },
            ]
        },
        {
            "featureType": "landscape.man_made",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "hue": "#180230"
                },

                {
                    "saturation": "-48"
                }
            ]
        }
    ];

    this.map = new google.maps.Map($(block).get(0), mapOptions);
}

googleMapEngine.prototype.setPin = function(newPin) {
    var pin = {
        size: { w: 25, h: 25 },
        point: { x: 0, y: 0 },
        position: { x: 0, y: 0 }
    };

    jQuery.extend(pin, newPin);

    this.pin = new google.maps.MarkerImage(pin.image,
        new google.maps.Size(108, 150),
        new google.maps.Point(pin.position.x, pin.position.y),
        new google.maps.Point(pin.point.x, pin.point.y),
        new google.maps.Size(pin.size.w, pin.size.h));

    /*
    this.pin = {
        image: pin.image,
        size: new google.maps.Size(108, 150),
        scaledSize: new google.maps.Size(pin.size.w, pin.size.h),
        anchor: new google.maps.Point(pin.point.x, pin.point.y),
        origin: new google.maps.Point(pin.position.x, pin.position.y)
    }
    */
}

googleMapEngine.prototype.addPoint = function(coords, address) {
    var markerOptions = {
        map: this.map,
        title: address,
        clickable: true,
        position: coords
    };

    if(this.pin) {
        markerOptions.icon = this.pin;
    }

    this.markers.push(new google.maps.Marker(markerOptions));

    this.map.setCenter(coords);
}

googleMapEngine.prototype.setFocus = function(coords) {
    this.map.setCenter(coords);
    this.map.panBy(-380,0);
}

yandexMapEngine.prototype.show = function(block){
    this.map = new ymaps.Map($(block).get(0), {
        center: [55.791471,37.622816],
        zoom: 6,
        controls: ['smallMapDefaultSet']
    });

    this.map.behaviors
        .disable(['scrollZoom']);
}


yandexMapEngine.prototype.setPin = function(newPin) {
    var pin = {
        size: { w: 25, h: 25 },
        point: { x: 0, y: 0 },
        position: { x: 0, y: 0 }
    };

    jQuery.extend(pin, newPin);

    this.pin = pin;
}

yandexMapEngine.prototype.addPoint = function(coords, address, color) {
    var markerOptions = {
    };

    if(this.pin) {
        $.extend(markerOptions, {
            iconLayout: 'default#image',
            iconImageHref: this.pin.image,
            iconImageSize: [this.pin.size.w, this.pin.size.h],
            iconImageOffset: [-this.pin.point.x, -this.pin.point.y]
        })
    }

    if(typeof color != "undefined") {
        $.extend(markerOptions, {
            preset: 'islands#icon',
            iconColor: color
        })
    }

    var marker = new ymaps.Placemark(coords, {balloonContent: address}, markerOptions);

    this.map.geoObjects.add(marker);

    /*
     this.map.balloon.open(coords, address, {
     closeButton: false
     });
     */




}

yandexMapEngine.prototype.setFocus = function(coords) {
    this.map.setCenter(coords);
    var position = this.map.getGlobalPixelCenter();
    this.map.setGlobalPixelCenter([ position[0] - 0.5, position[1]])

}
yandexMapEngine.prototype.setZoom = function(zoom) {
    this.map.setZoom(zoom);
}
yandexMapEngine.prototype.moveMap = function(x, y) {
    if(!x) {
        x = 0;
    }

    if(!y) {
        y = 0;
    }

    var position = this.map.getGlobalPixelCenter();
    this.map.setGlobalPixelCenter([ position[0] + x, position[1] + y ])
}

googleScheduler = function(onReady) {
    var _this = this;

    google.maps.event.addDomListener(window, 'load', function() {
        _this.onReady.call(_this);
    });

    this.onReady = onReady;
    this.onFinish = null;
    this.addresses = [];
    this.results = [];

    this.geoCoder = new google.maps.Geocoder();
}

googleScheduler.prototype.add = function(address) {
    if(address.length)
        this.addresses.push(address);
}

googleScheduler.prototype.run = function() {
    this.id = 0;

    this.nextRequest();
}

googleScheduler.prototype.nextRequest = function() {
    if(typeof this.addresses[this.id] == "undefined") {
        if(this.onFinish) {
            this.onFinish.call(this);
        }

        return;
    }

    var _this = this;

    function onResult(results, status) {
        _this.onResult(results, status);
    }

    this.geoCoder.geocode({ 'address' : this.addresses[this.id] }, onResult);
}

googleScheduler.prototype.onResult = function(results, status) {
    if(results && results.length) {
        this.results[this.id] = results[0].geometry.location;
    } else {
        this.results[this.id] = false;
    }

    this.id++;
    this.nextRequest();
}

yandexScheduler = function(onReady) {
    this.onFinish = null;
    this.addresses = [];
    this.results = [];
    this.onReady = onReady;

    var _this = this;

    ymaps.ready(function(){
        _this.onReady.call(_this);
    });
}

yandexScheduler.prototype.add = function(address) {
    if(address.length)
        this.addresses.push(address);
}

yandexScheduler.prototype.run = function() {
    this.id = 0;

    this.nextRequest();
}

yandexScheduler.prototype.nextRequest = function() {
    if(typeof this.addresses[this.id] == "undefined") {
        if(this.onFinish) {
            this.onFinish.call(this);
        }

        return;
    }

    var _this = this;

    function onResult(results) {
        _this.onResult(results);
    }

    ymaps.geocode(this.addresses[this.id], { results: 1 }).then(onResult);
}

yandexScheduler.prototype.onResult = function(results) {
    if(results.geoObjects) {
        this.results[this.id] = results.geoObjects.get(0).geometry.getCoordinates();
    } else {
        this.results[this.id] = false;
    }

    this.id++;
    this.nextRequest();
}

function Maps(){
    if(typeof google != "undefined" && typeof google.maps != "undefined") {
        return new googleMapEngine();
    }

    if(typeof ymaps != "undefined") {
        return new yandexMapEngine();
    }

    return false;
}
function Scheduler(onReady) {
    if(typeof google != "undefined" && typeof google.maps != "undefined") {
        return new googleScheduler(onReady);
    }

    if(typeof ymaps != "undefined") {
        return new yandexScheduler(onReady);
    }

    return false;
}