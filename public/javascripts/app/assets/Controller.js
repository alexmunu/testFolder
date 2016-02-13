angular.module("twitrackApp",['ngTwitter'])
    .controller("Controller", controller);

controller.$inject = ['$scope','Service'];

function controller($scope,Service){

    $scope.tweetsList={};


    $scope.getTweetByKeyWord=function(keyword,user_t,user_st){

        console.log(user_t+" "+user_st);

        Service.getTweetsByKeyWord(keyword,user_t,user_st)
            .success(function(data){
                console.log(data);
            });

    };/*
    scope.getTweetByKeyWord=function(keyword,user_t,user_st){
        cosole.log("hello");
        testService.search_(keyword,user_t,user_st).then(function(data){
            console.log(data);
            $scope.tweets=data;
        }, function(error) {
            console.log('err: ' + error);
        });
    }*/

}