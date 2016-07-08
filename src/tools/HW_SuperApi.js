import {Base64} from 'js-base64';
import $ from 'jquery'
import md5 from "md5";
import config from "../config";

const base64 = Base64.encode;

export default function hwSuperApi(maindata){
  if(maindata.method===undefined){
    throw "接口缺少method参数";
  }
  let data = {
    nick: config.nick,
    name: config.name,
    format: 'json',
    timestamp: parseInt(new Date().getTime()/1000).toString(),
  };
  Object.assign(data, maindata);
  data.sign = md5(base64(data.nick) + base64(data.method) + base64(data.timestamp) + base64(data.name) + base64(data.format));
  return data;
}

export function hwGetJsonp(url,maindata){
  return $.ajax({
    url: url,
    method: 'GET',
    data: hwSuperApi(maindata),
    dataType: 'jsonp',
    jsonp: 'callBack'
  });
}

export function hwPost(url,maindata){
  return $.ajax({
    url: url,
    method: 'POST',
    data: hwSuperApi(maindata),
    dataType: 'json',
    async: true,
  });
}
