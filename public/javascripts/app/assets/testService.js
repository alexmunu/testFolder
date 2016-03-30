var main = angular.module("twitrackApp", ['ngMap']);

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
        emit: function (eventName, data,callback) {
            socket.emit(eventName,data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if(callback)
                    callback.apply(socket, args);
                });
            });
        }
    }
}
main.controller("appController", appController);

appController.$inject = ['$scope', 'appService','socket','NgMap'];

function appController($scope, appService,socket,NgMap) {

    $scope.tweets=[];
    var vm = this;
    vm.dynMarkers = [];
    /*NgMap.getMap().then(function(map) {

        for (var k in map.markers) {
            var cm = map.markers[k];
            vm.dynMarkers.push(cm);
        }
        vm.markerClusterer = new MarkerClusterer(map, vm.dynMarkers, {});
    });*/

    $scope.getTweets = function () {
        if ($scope.searched_keyword) {

            var word=$scope.searched_keyword;
            console.log(word);
            socket.emit('word',word);
            socket.on('tweet_'+word,function (tweet) {
                console.log(word, tweet.id);
                tweet.positions=getLatLng(tweet);
                $scope.tweets.push(tweet);
            });
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
        var pos=item;
        if(item.coordinates){
            pos=item.coordinates.coordinates;
            return pos;
        }
        else if(item.place){
            pos=item.place.bounding_box.coordinates;
            return pos[0][0];
        }
        else if(item.geo){
            pos=item.geo;
        return [pos[1],pos[0]];
        }
    }



    $scope.correctTimestring = function (string) {
        var d = new Date(Date.parse(string));
        return d;
    };
}






