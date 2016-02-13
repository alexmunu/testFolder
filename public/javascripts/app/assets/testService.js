var main = angular.module("twitrackApp", []);

main.factory("appService", appService);

appService.$inject = ['$http'];

function appService($http) {

    return {
        searchByKeyword: function (keyword) {
            return $http.get("keyword/" + keyword, {});
        }
    }
}

/*main.service("appService", function ($http) {

 this.search_ = function (keyword) {
 return $http.get("keyword/" + keyword, {});
 }

 });

 main.controller("appController", ["$scope", "testService", function ($scope, testService) {
 $scope.tweets = {};

 $scope.getTweets = function () {
 if ($scope.searched_keyword) {
 testService.search_($scope.searched_keyword).then(function successCallback(data) {
 $scope.tweets = data;
 }, function errorCallback(data) {
 console.log(data);
 });
 }
 };

 }]);*/

main.controller("appController", appController);

appController.$inject = ['$scope', 'appService'];

function appController($scope, appService) {

    $scope.getTweets = function () {

        if ($scope.searched_keyword) {
            appService.searchByKeyword($scope.searched_keyword).then(function successCallback(response) {

                $scope.tweets = JSON.parse(response.data);
                console.log($scope.tweets);
            }, function errorCallback(response) {
                console.log(response);
            });
        }
    };

    var Continue = true;
    var i = 0;
    var interval = 0;

    function startStreamingApiSevice(index) {
        interval = setInterval(function () {
            if (Continue) {
                if (index > 0) {

                } else {
                    appService.searchByKeyword($scope.searched_keyword).then(function successCallback(response) {

                        $scope.tweets = JSON.parse(response.data);
                        i++;
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                }
            }
            else {
                clearInterval(interval);
                interval = 0;
            }
        }, 200);
    }

    $scope.correctTimestring = function (string) {
        var d = new Date(Date.parse(string));

        return d;
    };

}




