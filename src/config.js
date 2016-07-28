let configdata={
  apiurl: location.origin,
  nick: 'V5mobile',
  name: 'V5mobile',
}


if(location.host.match('localhost')||location.host.match('192.168.')){
  configdata={
    // apiurl: 'http://sandbox.swapi.hongware.com',
    // apiurl: 'http://sandbox.o2o.swapi.hongware.com',
    // nick: 'V5mobile',
    // name: 'V5mobile',
    apiurl: 'http://192.168.50.216:8089',
    nick: '欧少辉',
    name: '欧少辉',
  }
}


export default configdata
