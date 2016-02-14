var main = angular.module("twitrackApp", []);

main.factory("appService", appService);

appService.$inject = ['$http'];

function appService($http) {

    return {
        searchByKeyword: function (keyword) {
            return $http.get("keyword/" + keyword, {});
        },
        searchByKeywordContinue: function (keyword) {
            return $http.get("/continue/"+keyword,{});
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

    var Continue = true;
    var i = 0;
    var interval = 0;

    $scope.getTweets = function () {

        if ($scope.searched_keyword) {
          /* if(interval == 0) {
                i = 0;
                Continue = true;
                startStreamingApiSevice(i);
            }else Continue = false;*/
            appService.searchByKeyword($scope.searched_keyword).then(function successCallback(response) {
                $scope.tweets = JSON.parse(response.data);
                console.log($scope.tweets);
            }, function errorCallback(response) {
                console.log(response);
            });
        }
    };

    function startStreamingApiSevice(index) {
        interval = setInterval(function () {
            if (Continue) {
                if (index > 0) {
                    appService.searchByKeywordContinue($scope.searched_keyword).then(function successCallback(response) {

                        $scope.tweets = JSON.parse(response.data);
                        index++;
                        console.log(index);
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                } else {
                    appService.searchByKeyword($scope.searched_keyword).then(function successCallback(response) {

                        $scope.tweets = JSON.parse(response.data);
                        index++;
                        console.log(index);
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                }
            }
            else {
                clearInterval(interval);
                interval = 0;
            }
        }, 10);
    }

    $scope.correctTimestring = function (string) {
        var d = new Date(Date.parse(string));
        return d;
    };

}




