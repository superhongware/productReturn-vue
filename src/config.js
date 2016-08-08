let configdata={
  apiurl: location.origin,
  nick: 'o2omobile',
  name: 'o2omobile',
}


if(location.host.match('localhost')||location.host.match('192.168.')||location.host.match('127.0.0.')){
  configdata={
       apiurl: 'http://o2oswapi.hongware.com',
//  apiurl: 'http://sandbox.o2o.swapi.hongware.com',
    nick: 'o2omobile',
    name: 'o2omobile',
//     apiurl: 'http://192.168.50.216:8089',
//     nick: '欧少辉',
//     name: '欧少辉',
  }
}


export default configdata
