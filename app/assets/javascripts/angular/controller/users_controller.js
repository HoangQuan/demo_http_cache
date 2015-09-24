var myApp = angular.module('myapplication', ['ngRoute', 'ngResource']); 

//Factory
myApp.factory("usersCache", function($cacheFactory){
  return $cacheFactory('usersCached');
});
myApp.factory('Users', ['$http',function($http){
  return {
    query: function(callback){
      alert("aaaaaaaaaa");
      var url = 'http://localhost:9000/userssssss.json11';
      $http.get("http://localhost:9000/userssssss.json11", {cache:true}).success(function(data) {
        callback(data);
      }).error(function(){});
    }
  }
}]);

myApp.factory('Users', ['$resource',function($resource){
  return $resource('/users.json', {},{
    create: { method: 'POST' }
  });
}]);

myApp.factory('User', ['$resource', function($resource){
  return $resource('/users/:id.json', {}, {
    show: { method: 'GET' },
    update: { method: 'PUT', params: {id: '@id'} },
    delete: { method: 'DELETE', params: {id: '@id'} }
  });
}]);

//Controller
myApp.controller("UserListCtr", ['$scope', '$http', '$resource', 'Users', 'User', '$location', '$cacheFactory', 'usersCache', function($scope,
 $http, $resource, Users, User, $location, $cacheFactory, usersCache) {

  $scope.loadUsers = function() {
    // alert("Aready got data from sever");
    // $http.get("http://localhost:9000/users.json", {cache:true}).success(function(data) {
    $http.get("http://localhost:9000/users.json", {cache:usersCache}).success(function(data) {
      $scope.users = data;
    }).error(function(){});
  };

  $scope.removeHttpCache = function(){
    // var userCache = $cacheFactory.get('$http');
    var userCache = $cacheFactory.get('usersCached');
    console.log("userCache: ", userCache.get("http://localhost:9000/users.json"));
    userCache.remove("http://localhost:9000/users.json")
  };
  $scope.loadUsers();
  $scope.deleteUser = function (userId) {
    if (confirm("Are you sure you want to delete this user?")){
      User.delete({ id: userId }, function(){
        User.query(function(data) {
          $scope.users = data;
        });
        $location.path('/');
      });
    }
  };
}]);

myApp.controller("UserUpdateCtr", ['$scope', '$resource', 'User', '$location', '$routeParams', function($scope, $resource, User, $location, $routeParams) {
  $scope.user = User.get({id: $routeParams.id})
  $scope.update = function(){
    if ($scope.userForm.$valid){
      User.update({id: $scope.user.id},{user: $scope.user},function(){
        $location.path('/');
      }, function(error) {
        console.log(error)
      });
    }
  };
  
  $scope.addAddress = function(){
    $scope.user.addresses.push({street1: '', street2: '', city: '', state: '', country: '', zipcode: '' })
  }

  $scope.removeAddress = function(index, user){
    var address = user.addresses[index];
    if(address.id){
      address._destroy = true;
    }else{
      user.addresses.splice(index, 1);
    }
  };

}]);

myApp.controller("UserAddCtr", ['$scope', '$resource', 'Users', '$location', function($scope, $resource, Users, $location) {
  $scope.user = {addresses: [{street1: '', street2: '', city: '', state: '', country: '', zipcode: '' }]}
  $scope.save = function () {
    console.log($scope.userForm);
    if ($scope.userForm.$valid){
      Users.create({user: $scope.user}, function(){
        $location.path('/');
      }, function(error){
        console.log(error)
      });
    }
  }

  $scope.addAddress = function(){
    $scope.user.addresses.push({street1: '', street2: '', city: '', state: '', country: '', zipcode: '' })
  }

  $scope.removeAddress = function(index, user){
    var address = user.addresses[index];
    if(address.id){
      address._destroy = true;
    }else{
      user.addresses.splice(index, 1);
    }
  };

}]);



//Routes
myApp.config([
  '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/users',{
      templateUrl: '/templates/users/index.html',
      controller: 'UserListCtr'
    });
    $routeProvider.when('/users/new', {
      templateUrl: '/templates/users/new.html',
      controller: 'UserAddCtr'
    });
    $routeProvider.when('/users/:id/edit', {
      templateUrl: '/templates/users/edit.html',
      controller: "UserUpdateCtr"
    });
    $routeProvider.otherwise({
      redirectTo: '/users'
    });
  }
]);

