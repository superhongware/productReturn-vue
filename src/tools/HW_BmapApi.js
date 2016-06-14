//浏览器获取当前经纬度
export function getNowLngLat(){
    return new Promise(function(resolve, reject) {
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r) {
          // console.log(r)
            if (this.getStatus() === 0) {
                resolve(r);
            } else {
                reject(this.getStatus());
            }
            geolocation=null;
        }, {
            enableHighAccuracy: true
        });
    });
}
//行车距离
export function getDrivingRoute(p1, p2) {
    return new Promise(function(resolve, reject) {
        if(!p2){
          resolve(null);
          return;
        }
        var map = new BMap.Map();
        var start = new BMap.Point(p1.length ? p1[0] : p1.lng, p1.length ? p1[1] : p1.lat);
        var end = new BMap.Point(p2.length ? p2[0] : p2.lng, p2.length ? p2[1] : p2.lat);
        var driving = new BMap.DrivingRoute(map, {
            onSearchComplete: onSearchComplete
        });

        function onSearchComplete(data) {
            resolve(data);
            map = null;
            start = null;
            end = null;
            driving = null;
        }
        driving.search(start, end);
    });
}
//传地址取经纬度
export function getAddressLngLat(address) {
    return new Promise(function(resolve, reject) {
        var myGeo = new BMap.Geocoder();
        myGeo.getPoint(address, function(point) {
            resolve(point);
            myGeo = null;
        });
    });
}
