var main = angular.module("twitrackApp", ['uiGmapgoogle-maps', 'nemLogging']).config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBWMbsqJN7MIuw10hrOj4s90llYS967-Pg',
        v: '3.22', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
});

main.factory("appService", appService);
appService.$inject = ['$http'];
function appService($http) {
    return {
        searchByKeyword: function (keyword) {
            return $http.get("keyword/" + keyword, {});
        },
        start: function () {
            return $http.get("/start", {});
        },
        searchByKeywordContinue: function (keyword) {
            return $http.get("/continue/" + keyword, {});
        }
    }
}

main.factory("socket", socket);
socket.$inject = ['$rootScope'];
function socket($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback)
                        callback.apply(socket, args);
                });
            });
        }
    }
}
main.controller("appController", appController);

appController.$inject = ['$scope', 'socket', 'uiGmapGoogleMapApi'];

function appController($scope, socket, NgMap) {

    this.zoom = 5;
    this.center = [0, 0];

    $scope.tweets = [];
    var vm = this;
    vm.dynMarkers = [];
    /*NgMap.getMap().then(function(map) {

     for (var k in map.markers) {
     var cm = map.markers[k];
     vm.dynMarkers.push(cm);
     }
     vm.markerClusterer = new MarkerClusterer(map, vm.dynMarkers, {});
     });*/

     var words = [];
    $scope.getTweets = function () {
        var a_word = $scope.searched_keyword
        if (a_word) {

            if (words.length!=0) {
                console.log(words);
                socket.emit('remove', words[0]);
                words.length=0;
            }
            $scope.tweets = [];
            words.push(a_word);
            console.log(a_word);
            socket.emit('word', a_word);
            socket.on('tweet_' + a_word, function (tweet) {
                console.log(a_word, tweet.id);
                tweet.positions = getLatLng(tweet);
                tweet.icon = {
                    url: "/images/marker-logo.png",
                    scaledSize: {width: 20, height: 27}
                };
                $scope.tweets.push(tweet);
            });
        }
    };

    $scope.onClick = function (marker, eventName, model) {
        console.log("Clicked!");
        model.show = !model.show;
    };

    $scope.map_options = {
        cluster: {
            minimumClusterSize: 10,
            zoomOnClick: true,
            styles: [{
                url: "icons/m4-fab.png",
                width: 60,
                height: 60,
                textColor: 'white',
                textSize: 14,
                fontFamily: 'Open Sans'
            }],
            averageCenter: true,
            clusterClass: 'cluster-icon'
        }
    };

    function toggleBounce() {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

    function getLatLng(item) {
        var pos = item;
        if (item.coordinates) {
            pos = item.coordinates.coordinates;
            console.log(pos);
            return {latitude: pos[1], longitude: pos[0]};
        }
        else if (item.place) {
            pos = item.place.bounding_box.coordinates;
            var array = pos[0][0];
            return {latitude: array[1], longitude: array[0]};
        }
        else if (item.geo) {
            pos = item.geo;
            console.log(pos[1], pos[0]);
            return {latitude: pos[0], longitude: pos[1]};
        }
    }

    $scope.correctTimestring = function (time_value) {
        var values = time_value.split(" ");
        time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
        var parsed_date = Date.parse(time_value);
        var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
        var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
        delta = delta + (relative_to.getTimezoneOffset() * 60);

        var r = '';
        if (delta < 60) {
            r = 'a minute ago';
        } else if (delta < 120) {
            r = 'couple of minutes ago';
        } else if (delta < (45 * 60)) {
            r = (parseInt(delta / 60)).toString() + ' minutes ago';
        } else if (delta < (90 * 60)) {
            r = 'an hour ago';
        } else if (delta < (24 * 60 * 60)) {
            r = '' + (parseInt(delta / 3600)).toString() + ' hours ago';
        } else if (delta < (48 * 60 * 60)) {
            r = '1 day ago';
        } else {
            r = (parseInt(delta / 86400)).toString() + ' days ago';
        }

        return r;
    };

}

main.directive('slideBtn', function () {

    var event = function (element, attr) {
        element.offset()
        $('.sidebar-left .slide-submenu').on('click', function () {
            var context_element = $(this);
            context_element.closest('.sidebar-body').fadeOut('slide', function () {
                $('.mini-submenu-left').fadeIn().draggable();
            });
        });

        $('.mini-submenu-left').on('dblclick', function () {
            var context_element = $(this);
            $('.sidebar-left .sidebar-body').toggle('slide');
            context_element.hide();
        });

        return function (scope, elem, attrs) {
            var offset = element.offset();
            scope.x = offset.left;
            scope.y = offset.top;
        }
    }

    return {
        restrict: 'A',
        compile: event
    }
});

main.directive('drag', function () {

    var event = function (element, attr) {
        $('.sidebar ').draggable();

        return function (scope, elem, attrs) {
        }
    }

    return {
        restrict: 'A',
        compile: event
    }
});







