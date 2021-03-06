var driver = {
    init : function() {

        var get_passengers_url = $("#driver-site-info").attr("data-get_passengers");
        var passenger_container = $("#passengers-container");

//        function getCookie(name) {
//            var cookieValue = null;
//            if (document.cookie && document.cookie != '') {
//                var cookies = document.cookie.split(';');
//                for (var i = 0; i < cookies.length; i++) {
//                    var cookie = jQuery.trim(cookies[i]);
//                    // Does this cookie string begin with the name we want?
//                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
//                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                        break;
//                    }
//                }
//            }
//            return cookieValue;
//        }
//        var csrftoken = getCookie('csrftoken');
//
//        console.log(csrftoken);
//
//        function csrfSafeMethod(method) {
//            // these HTTP methods do not require CSRF protection
//            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
//        }
//        $.ajaxSetup({
//            crossDomain: false, // obviates need for sameOrigin test
//            beforeSend: function(xhr, settings) {
//                if (!csrfSafeMethod(settings.type)) {
//                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
//                }
//            }
//        });

        function ajax_get_passengers(latitude, longitude) {

            $.ajax({
                url: "/api/drivers/?format=json",
                dataType: "json",
                type: "GET",
                contentType: "application/json",
                data: {
                    latitude: latitude,
                    longitude: longitude,
//                    csrfmiddlewaretoken: csrftoken,
                },
                success : function(res) {
                    if (!res.error) {

                        passenger_container.html("");
                        console.log(res.results);

                        for(i = 0; i < res.results.length; i++) {
                            curr = res.results[i];
                            passenger_container.append(   "<div class='passenger well' style='height:100px' data-passenger_id=" + curr.id + ">"
                                                        +    "<div class='col-md-8'>"
                                                        +       "<div style='clear:both'>"
                                                        +           "<div style='margin: 0px 10px 0px 10px; width:50px; height:50px; background-image: url(http://www.etsu.edu/coe/pictures/placeholder_male.png); background-size: cover; float: left'></div>"
                                                        +           "<span>Name: </span>"
                                                        +           "<span>" + "Dude Broseph" + "</span>"
                                                        +       "</div>"
                                                        +       "<div>"
                                                        +           "<span>No. Passengers: </span>"
                                                        +           "<span>" + curr.num_passengers + "</span>"
                                                        +       "</div>"
//                                                        +       "<div>"
//                                                        +           "<span>Distance: </span>"
//                                                        +           "<span>£" + curr.price + "</span>"
//                                                        +       "</div>"
                                                        +    "</div>"
                                                        +    "<div class='col-md-4'>"
                                                        +       "<a class='btn btn-primary give-ride-btn'>"
                                                        +           "Give a Ride!"
                                                        +       "</a>"
                                                        +           "<span class='col-md-offset-1'>Donation: </span>"
                                                        +           "<span>£" + curr.price + "</span>"
                                                        +    "</div>"
                                                        + "</div>"  );

                        }
                    } else {

                    }
                }
            });

//            setTimeout(function() { ajax_get_passengers(latitude, longitude) }, 5000);
        }

        $("#find-location-button").bind("click", function lookupGeoData() {
            console.log("here");
            myGeoPositionGeoPicker({
                startAddress     : 'White House, Washington',
                returnFieldMap   : {
                    'passenger-form-dest-lat' : '<LAT>',
                    'passenger-form-dest-long' : '<LNG>',
                    'passenger-form-city' : '<CITY>',
                    'passenger-form-country' : '<COUNTRY>',
                    'passenger-form-zip' : ' <ZIP>',
                    'passenger-form-address' : '<ADDRESS>'
                }
            });
        });


        function success(position) {
            var s = document.querySelector('#status');

            if (s.className == 'success') {
                // not sure why we're hitting this twice in FF, I think it's to do with a cached result coming back
                return;
            }

            s.innerHTML = "found you!";
            s.className = 'success';

            var mapcanvas = document.createElement('div');
            mapcanvas.id = 'mapcanvas';
            mapcanvas.style.height = '250px';
            mapcanvas.style.width = '100%';

            document.querySelector('article').appendChild(mapcanvas);

            $('#driver-form-lat').attr("value", position.coords.latitude);
            $('#driver-form-longx').attr("value", position.coords.longitude);

            console.log($("#driver-site-info").attr("data-no_activerequest"))
            //Execute the ajax_get_passengers only if there is no previous active request
            if($("#driver-site-info").attr("data-no_activerequest"))
                ajax_get_passengers(position.coords.latitude, position.coords.longitude);

            var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            $('#passenger-form-curr-lat').attr("value", position.coords.latitude);
            $('#passenger-form-curr-long').attr("value", position.coords.longitude);

            var myOptions = {
                zoom: 15,
                center: latlng,
                mapTypeControl: false,
                navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);

            var marker = new google.maps.Marker({
                position: latlng,
                map: map,
                title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
            });
            var a = ["a", "b", "c"];
            for (index = 0; index < a.length; ++index) {
                //        var marker = new google.maps.Marker({
//            position: new google.maps.LatLng({{ driver.position }}),
//            map: map,
//            title:"{{ driver.owner.username }}"
                console.log(a[index]);
            }

//        {% for driver in drivers %}
//        var marker = new google.maps.Marker({
//            position: new google.maps.LatLng({{ driver.position }}),
//            map: map,
//            title:"{{ driver.owner.username }}"
//        });
//        {% endfor %}
        }

        function error(msg) {
            var s = document.querySelector('#status');
            s.innerHTML = typeof msg == 'string' ? msg : "failed";
            s.className = 'fail';

            // console.log(arguments);
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            error('not supported');
        }


        $(document).on('click', '.give-ride-btn', function(event) {
            event.preventDefault();

            var that = $(this);
            var passenger = that.closest(".passenger");
            var activerequestid = passenger.attr('data-passenger_id');
            var url = $('#driver-site-info').attr('data-give_ride_url');

            $.ajax({
                url: url,
                dataType: "json",
                type: 'POST',
                data: {
                    activerequestid: activerequestid
                },
                success: function(res) {
                    console.log(res);
                    if (!res.error) {
                        console.log("success:");

                        passenger_container.html("");
                        passenger_container.append("<h1>Thanks! Your driving buddy will now be waiting for you to pick him up!</h1>")
                    }
                }
            });
        });
    }
}

$(function() {
    driver.init();
});
