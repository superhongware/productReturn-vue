import {Base64} from 'js-base64';
var UrlParam=GetUrlParam();
if (UrlParam.action) {
    UrlParam.action = JSON.parse(unescape(Base64.decode(UrlParam.action)));
    if(UrlParam.action.couponName){
    	    var couponName=UrlParam.action.couponName;
    	    if(couponName.indexOf('%')>0){
    	       	couponName=couponName.substr(0,couponName.indexOf('%'))
    	       	console.log(couponName)
    	    }
    	   UrlParam.action.couponName=Base64.decode(couponName)
    }
  
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
