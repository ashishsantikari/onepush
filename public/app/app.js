$(document).ready(function () {
    $(".button-collapse").sideNav();
});
var app = angular.module('app', ['ngRoute', 'onePushAPIs', 'ui.materialize', 'ngStorage']);
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/home', {
        controller: 'MainCtrl'
        , templateUrl: "app/templates/MainCtrlTmpl.html"
    }).when('/add', {
        controller: 'ProfileCtrl'
        , templateUrl: "app/templates/NewProfileTmpl.html"
    }).otherwise({
        redirectTo: '/home'
    });
}]);
app.controller('MainCtrl', ['$scope', '$rootScope', 'GetPortfolio', '$filter', function ($scope, $rootScope, GetPortFolio, $filter) {
    $scope.list = [], $scope.filteredList = [], $scope.searchlist = [];
    $scope.page = {
        default: 1
        , size: 8
        , total: $scope.list.length
    };
    
    GetPortFolio.get(function (response) {
        $scope.list = response.data.websites;
        $scope.searchlist = response.data.websites;
        $rootScope.count = response.data.websites.length;
    }, function (err) {
        console.error(err);
    });
    $scope.$watchCollection('searchlist', function (n, o) {
        $scope.page.total = n.length;
        $scope.filteredList = filter(n, $scope.page.default);
    });
    $scope.$watch('filterItems', function (n, o) {
        $scope.searchlist = $filter('filter')($scope.list, {
            $: n
        });
    });

    function filter(arg, pageno) {
        return arg.slice($scope.page.size * (pageno - 1), $scope.page.size * pageno);
    }
    $scope.changePage = function (page) {
        $scope.filteredList = filter($scope.searchlist, page);
    };
}]);
app.directive('userDetails', function ($localStorage, $timeout) {
    return {
        replace: true
        , scope: {
            data: "="
        }
        , templateUrl: 'app/templates/UserDetailTmpl.html'
        , link: function (scope, iElem, iAttr) {           
            scope.storage = $localStorage;
            if (!scope.storage[scope.data.id])
                scope.storage[scope.data.id] = 0;
            scope.addLikes = function (id) {
                scope.clicked=true;
                scope.storage[scope.data.id] = ++scope.storage[scope.data.id];
                $timeout(function(){
                    scope.clicked = false;
                },1000);
            }
            
            
            scope.getLikes = function(id){
                return scope.storage[scope.data.id];
            }
        }
    }
});
app.controller('ProfileCtrl', ['$scope', 'GetPortfolio', function ($scope, GetPortfolio) {
    $scope.submitRequest = function () {
        console.log($scope.f);
        GetPortfolio.push(function (success) {
            $scope.modalOpen = true;
            if (success.data.status == 200) {
                $scope.message = success.data.message;
            }
            else if (success.data.status) {
                $scope.message = "Uh oh! Servers seems to be busy for some reason. Please try after some time.";
            }
            else {
                $scope.message = "Some internal error occured. Admin has been notified about the issue. Please check back later.";
            }
            console.log(success);
        }, function (error) {
            console.log(error);
        }, $scope.f);
    };
}]);