import {Base64} from 'js-base64'
var UrlParam=GetUrlParam();
if (UrlParam.action) {
  UrlParam.action = JSON.parse(Base64.decode(decodeURIComponent(UrlParam.action)));
  // console.log(UrlParam.action)

} else {
  alert("您打开的地址有误！");
  throw "cw";
}

export default function GetUrlParam() {
  var url = location.search; //获取url中"?"符后的字串
   var theRequest = {};
   if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
         theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
      }
   }
   return theRequest
}

export function UrlParam(){
  return UrlParam
}
