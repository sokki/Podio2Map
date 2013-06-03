function hashCode(str) {// java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function intToARGB(i) {
    return ((i >> 16) & 0xFF).toString(16) + ((i >> 8) & 0xFF).toString(16) + (i & 0xFF).toString(16);
}

function initialize() {


   /* var myLatlng = new google.maps.LatLng(-25.363882, 131.044922);
    var mapOptions = {
        zoom : 4,
        //center: myLatlng,
        mapTypeId : google.maps.MapTypeId.ROADMAP
    }
    var marker = null;
    var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    var infowindow = new google.maps.InfoWindow();
    //Example values of min & max latlng values
    var lat_min = 100;
    var lat_max = 0;
    var lng_min = 100;
    var lng_max = 0;*/
   
   $('#map_canvas').gmap({'disableDefaultUI':true}).bind('init', function(evt, map) { 

    jQuery.each(leads.items, function(index, lead) {
        lead.arrayFields = lead.fields;
        lead.fields = {};

        $.each(lead.arrayFields, function(i, field) {
            lead.fields[field.external_id] = field;
        });
        if(!lead.fields['latlon'] || !lead.fields['status']) return true;

        var latlon = lead.fields['latlon'].values[0].value.split(',');

        var lat = Number(latlon[0]);
        var lon = Number(latlon[1]);

        lat_min = (lat_min > lat) ? lat : lat_min;
        lat_max = (lat_max < lat) ? lat : lat_max;

        lng_min = (lng_min > lon) ? lon : lng_min;
        lng_max = (lng_max < lon) ? lon : lng_max;
console.log(lead.fields['status'].values[0].value);
        var marker = new StyledMarker({
            styleIcon : new StyledIcon(StyledIconTypes.MARKER, {
                color : '#ff0000' //+ intToARGB(hashCode(lead.fields['status'].values[0].value))
            }),
            position: new google.maps.LatLng(lat,lon),
            info : '<div><iframe src="https://basobude.podio.com/lead-verwaltung/item/<?php echo $lead->item_id?>/print" width="800" height="100%"></iframe></div>',
            map : map,
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(this.info);
            infowindow.open(map, this);
        });

    });
    
    });

    map.setCenter(new google.maps.LatLng(((lat_max + lat_min) / 2.0), ((lng_max + lng_min) / 2.0)));
    map.fitBounds(new google.maps.LatLngBounds(
    //bottom left
    new google.maps.LatLng(lat_min, lng_min),
    //top right
    new google.maps.LatLng(lat_max, lng_max)));

}