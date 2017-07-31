console.log("js")
angular.module('angcontroller',['angservice'])
.controller('maincontroller', function(factoryname, $scope){
  factoryname.api().then(function(data){
    console.log(data);
    if(data.status == 200){
    $scope.data_to_view = data.data;
    console.log(data.data);
   }
  });
});
