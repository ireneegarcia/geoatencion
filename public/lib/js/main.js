angular.module("FinalApp",["ngRoute","ngResource","ngMap"])
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
