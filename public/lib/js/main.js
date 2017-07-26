angular.module("FinalApp",["ngRoute","ngResource"])
    .config(function($routeProvider){

        $routeProvider

            .when("/dashboard.html",{
                controller: "IndexDashController",
                templateUrl: "views/index-dashboard.html"

            })

            .otherwise({
                redirectTo: '/'
            })
    });