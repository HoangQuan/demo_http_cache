#<h3>DemoHttpCache</h3>

Service $http có thể tạo một cache với ID là $http với thao tác khá đơn giản là set "cache: true" khi thực hiện requets thông qua $http.
```
$http.get('/users.json', {
  cache: true
});
```
bằng cách đó mọi requets tới `'/users.json'` để được lưu lại trong cache thông qua cache object có tên là `"$http"`

Để lấy ra cache của $http ta vẫn dùng phương thức get của `$cacheFactory`:
```
var cache = $cacheFactory.get('$http');
```
Giá trị trong $http cache được lưu theo dạng:

`Key` là url trong request của $http
`Value` là content của response trả về.

### Ví dụ

+ Tôi tạo 1 controller để load danh sách users

```
myApp.controller("UserListCtr", ['$scope', '$http', '$resource', 'Users', 'User', '$location', function($scope, $http, $resource, Users, User, $location) {

  $scope.loadUsers = function() {
    // alert("Aready got data from sever");
    $http.get("http://localhost:9000/users.json").success(function(data) {
      $scope.users = data;
    }).error(function(){});
  };
  $scope.loadUsers();
}]);
```
Bởi mặc định thì cache cho $http được set là false
```
$http.get("http://localhost:9000/users.json")
```
+ Tạo 1 'button' trên view để gọi function 'loadUsers'

```
<button ng-click="loadUsers()">load users</button>
```
Mỗi lần nhấn "load users" $http sẽ thực hiện 1 request đên controler:

![image1](https://github.com/HoangQuan/demo_http_cache/blob/master/app/assets/images/3.png)

![image2](https://github.com/HoangQuan/demo_http_cache/blob/master/app/assets/images/4.png)

Bây giờ, set `cache` thành `true`:
```
$http.get("http://localhost:9000/users.json", {cache:true})
```
khi nhấn `"load users"` sẽ không reuqest lên server nữa.

Như đã nói ở trên key của $http cache là url của requet vì vậy ta có thể get thông tin của nó thông qua key này:
```
$scope.removeHttpCache = function(){
    var userCache = $cacheFactory.get('$http');
    console.log("userCache: ", userCache.get("http://localhost:9000/users.json"));
    userCache.remove("http://localhost:9000/users.json")
  };
```

+ tạo nút remove cache và bấm vào:

```
<button ng-click="removeHttpCache()">remove cache</button>
```
kết quả là khi bấm vào lần thứ nhất console hiển thị userCache và sau đó xóa cache đi. 
Tiếp tục bấm vào thì userCache sẽ undefine bởi vì nó đã bị xóa đi.

![image3](https://github.com/HoangQuan/demo_http_cache/blob/master/app/assets/images/5.png)

###Custome $http cache

Mặc định $http cache sẽ có ID là "$http" nhưng bạn cũng có thể thay đổi nó. bằng cách sau:

```
myApp.factory("usersCache", function($cacheFactory){
  return $cacheFactory('usersCached');
});

```
và thay đổi thuộc tính `cache: true` thành `cache:usersCache`
như vậy thay vì sử dụng `default cache` thì $http sẽ sử dụng cache được custome của bạn `"usersCache"`
