// backend http services
angular.module("angservice", []).factory('factoryname', function($http){
  console.log($http);console.log("angular services");
return {
  api : function () {
     console.log("inside services");
     return $http.post("/api");
  }
}
});
