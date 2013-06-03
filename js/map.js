function initialize() {
    var images = {
        Einzelhandel : "supermarket.png",
        Gastronomie : "restaurant.png",
        Großhandel : "days-mar.png",
        Hersteller : "prison.png",
        Internethandel : "atv.png",
        "Multiplikator (Seminare/Workshops etc)" : "bankeuro.png"
    };

    $('#map_canvas').gmap({
        'disableDefaultUI' : false
    }).bind('init', function(evt, map) {

        $('#map_canvas').gmap('addControl', 'radios', google.maps.ControlPosition.TOP_LEFT);
        $('#map_canvas').gmap('addControl', 'radios2', google.maps.ControlPosition.BOTTOM_LEFT);
        var southWest = map.getBounds().getSouthWest();
        var northEast = map.getBounds().getNorthEast();
        var lngSpan = northEast.lng() - southWest.lng();
        var latSpan = northEast.lat() - southWest.lat();
        var tags = {}; // == lead-status
        var types = {};

        jQuery.each(leads.items, function(index, lead) {

            // gimme a usable field array
            lead.arrayFields = lead.fields;
            lead.fields = {};
            $.each(lead.arrayFields, function(i, field) {
                lead.fields[field.external_id] = field;
            });

            // skip leads w/o geocode or status
            if (!lead.fields['latlon'] || !lead.fields['status'])
                return true;
            var latlon = lead.fields['latlon'].values[0].value.split(',');
            var lat = Number(latlon[0]);
            var lon = Number(latlon[1]);
            if (!lat || !lon)
                return true;


            // calc lead-type & icon
            tags[lead.fields['status'].values[0].value] = lead.fields['status'].values[0].value;
            var icon = 'recycle.png';
            var typ = undefined;
            if (lead.fields['typ'] && lead.fields['typ'].values[0].value.text) {
                types[lead.fields['typ'].values[0].value.text] = lead.fields['typ'].values[0].value.text;
                icon = images[lead.fields['typ'].values[0].value.text];
                typ = lead.fields['typ'].values[0].value.text;
            }

            // add Marker
            $('#map_canvas').gmap('addMarker', {
                'icon' : 'img/' + icon,
                'tags' : [lead.fields['status'].values[0].value],
                'typ' : [typ],
                'bound' : true,
                'position' : new google.maps.LatLng(lat, lon)
            }).click(function() {
                var visibleInViewport = ( $('#map_canvas').gmap('inViewport', $(this)[0]) ) ? 'I\'m visible in the viewport.' : 'I\'m sad and hidden.';
                $('#map_canvas').gmap('openInfoWindow', {
                    'content' : '<div><iframe src="' + lead.link + '/print" width="800" height="100%"></iframe></div>',
                }, this);
            });

        });

        // lead-status filter
        $.each(tags, function(i, tag) {
            $('#radios').append(('<label style="margin-right:5px;display:block;"><input type="checkbox" style="margin-right:3px" value="' + tag + '"/>' + tag + '</label>'));
        });

        $.each(types, function(i, tag) {
            $('#radios2').append(('<label style="margin-right:5px;display:block;"><input type="checkbox" style="margin-right:3px" value="' + tag + '"/>' + tag + '</label>'));
        });


        // filter click
        // TODO: apply BOTH filter
        $('input:checkbox').click(function() {
            $('#map_canvas').gmap('closeInfoWindow');
            $('#map_canvas').gmap('set', 'bounds', null);

            var $context = $(this).parent().parent();
            var property = $context.attr('filter');

            var filters = [];
            $('input:checkbox:checked', $context).each(function(i, checkbox) {
                filters.push($(checkbox).val());
            });
            if (filters.length > 0) {
                $('#map_canvas').gmap('find', 'markers', {
                    'property' : property,
                    'value' : filters,
                    'operator' : 'OR'
                }, function(marker, found) {
                    if (found) {
                        $('#map_canvas').gmap('addBounds', marker.position);
                    }
                    marker.setVisible(found);
                });
            } else {
                $.each($('#map_canvas').gmap('get', 'markers'), function(i, marker) {
                    $('#map_canvas').gmap('addBounds', marker.position);
                    marker.setVisible(true);
                });
            }
        });

    });

}