<style lang="sass" scoped>

@import './addressListView.scss'

</style>

<template>

<div class="address">
    <div v-if="memberinfo!==undefined" v-show="!currentAddress.show">
      <div
      v-for="(index, address) in memberinfo.addresses"
      class="addressbox">
      <!-- {{address | json} -->
        <h2>{{address.name+' '+address.mobilePhone}}</h2>
        <p>{{address.province + address.city + address.district + address.memberAddress}}</p>
        <div class="addresslink" @click="goCallBackUrl(address)"></div>
        <div class="addressedit" @click="editAddress(index,address)">
          <i class="">i</i>
        </div>
      </div>
      <div class="noaddresslist" v-if="memberinfo && memberinfo.addresses.length===0">
        您还没有添加过地址，<br/>
        点击下面按钮添加一个吧
      </div>
      <box gap="10px 10px">
        <x-button type="primary" @click="editAddress()">+ 添加新地址</x-button>
        <!-- <x-button type="warn" @click="editAddress(memberinfo.addresses.length)">删除地址</x-button> -->
      </box>
    </div>
    <group v-show="currentAddress.show" class="editaddress" :transition="currentAddress.show?'slideUp':'slideDown'">
      <x-input title="收货人" placeholder="名字" :min="1"  :value.sync="currentAddress.name" v-ref:name></x-input>
      <x-input title="手机号" placeholder="11位手机号" is-type="china-mobile"  :value.sync="currentAddress.phone" v-ref:phone></x-input>
      <Address title="选择地区" :list="addressData" :value.sync="currentAddress.placeCode"></Address>
      <x-textarea title="详细地址" required placeholder="街道门牌信息" :value.sync="currentAddress.address" v-ref:address></x-textarea>
      <box gap="10px 10px">
        <x-button v-if="memberinfo && currentAddress.index < memberinfo.addresses.length" type="primary" @click="updateAddress(currentAddress)">确认修改</x-button>
        <x-button v-if="!memberinfo || currentAddress.index === memberinfo.addresses.length" type="primary" @click="addAddress(currentAddress)">确认添加</x-button>
        <x-button  @click="currentAddress.show=false">取消</x-button>
      </box>
    </group>
    <loading :show="loading.show" :text="loading.text"></loading>
    <alert :show.sync="alertinfo.show" :title="alertinfo.title" @on-hide="alertcallback">{{alertinfo.des}}</alert>
</div>

</template>

<script>

import { Promise }from 'es6-promise'
import store from 'src/store'
import Scroller from 'vux/components/scroller'
import Loading from 'vux/components/loading'
import XInput from 'vux/components/x-input'
import Cell from 'vux/components/cell'
import Group from 'vux/components/group'
import XButton from 'vux/components/x-button'
import Box from 'vux/components/box'
import Alert from 'vux/components/alert'
import Address from 'vux/components/address'
import XTextarea from 'vux/components/x-textarea'
// import { Scroller, Loading, XInput, Cell, Group, XButton, Box, Alert, Address, XTextarea } from 'vux'
// import * as vux from 'vux'
// console.log(vux);
import value2name from '../../filters/value2name'
import name2value from '../../filters/name2value'

// 正式用地址代码
import addressData from '../../tools/address.json'
// 测试用代码
// import addressData from '../../tools/address0.js'

import {UrlParam} from '../../tools/GetUrlParam'
const urlParam = UrlParam();
import {Base64}from 'js-base64'
// let cc='eyJjaXR5Ijoi5YyX5Lqs5biCIiwiZGlzdHJpY3QiOiLkuJzln47ljLoiLCJtZW1iZXJBZGRyZXNzIjoiIiwibW9iaWxlUGhvbmUiOiIxNTMxMTExMTExMSIsIm5hbWUiOiIxMjMiLCJwcm92aW5jZSI6IuWMl%2BS6rCJ9'
// console.log(JSON.parse(Base64.decode(decodeURIComponent(cc))));
// const ma = Base64.encode(JSON.stringify({orgCode: "o2o", callbackUrl: 'http://192.168.50.149:8080/?action=123&asd=asd#!/addressList', openID:"111", appID:"xxxx"}))
// eyJvcmdDb2RlIjoibzJvIiwiY2FsbGJhY2tVcmwiOiJodHRwOi8vMTkyLjE2OC41MC4xNDk6ODA4MC8/YWN0aW9uPTEyMyMhL3JlZ2llc3QiLCJvcGVuSUQiOiJhMDAwMDEiLCJhcHBJRCI6Inh4eHgifQ==
// console.log(ma);
// console.log(location.origin+'/?action='+ma+'#!/addressList');
// http://swapi.hongware.com/hfive/2015/membercenter.html?param=b3BlbklEPW9YVjlydUxoZ0hORTBlLXFLMHdYYy11Z3RhWkEmYXBwSUQ9d3g2ZTBjZGJiZWYzOWFjNGZj
// http://sandbox.o2o.swapi.hongware.com/hfive/2015/membercenter.html?param=b3BlbklEPW9YVjlydUxoZ0hORTBlLXFLMHdYYy11Z3RhWkEmYXBwSUQ9eHh4eA==
// http://sandbox.o2o.swapi.hongware.com/hfive/2016/store.html?action=eyJvcmdDb2RlIjoibzJvIiwiY2FsbGJhY2tVcmwiOiJodHRwOi8vaG9uZ3dlaS5jb21lb25jbG91ZC5uZXQvY3VzdG9taXplL3Nob3AvP3Y9MS4wJm5ncm91dGU9L2NyZWF0ZU9yZGVyIy9jcmVhdGVPcmRlciIsIm9wZW5JRCI6Im9YVjlydUxoZ0hORTBlLXFLMHdYYy11Z3RhWkEiLCJhcHBJRCI6Inh4eHgifQ==#!/returnProducts
// console.log(Base64.decode('b3BlbklEPW9YVjlydUxoZ0hORTBlLXFLMHdYYy11Z3RhWkEmYXBwSUQ9d3g2ZTBjZGJiZWYzOWFjNGZj'));
// console.log(Base64.decode('b3BlbklEPW9YVjlydUxoZ0hORTBlLXFLMHdYYy11Z3RhWkEmYXBwSUQ9eHh4eA=='));
// console.log(Base64.decode('eyJvcmdDb2RlIjoibzJvIiwiY2FsbGJhY2tVcmwiOiJodHRwOi8vaG9uZ3dlaS5jb21lb25jbG91ZC5uZXQvY3VzdG9taXplL3Nob3AvP3Y9MS4wJm5ncm91dGU9L2NyZWF0ZU9yZGVyIy9jcmVhdGVPcmRlciIsIm9wZW5JRCI6Im9YVjlydUxoZ0hORTBlLXFLMHdYYy11Z3RhWkEiLCJhcHBJRCI6Inh4eHgifQ=='));

export default {
    components: {
        Loading,
        Scroller,
        XInput,
        Cell,
        Group,
        XButton,
        Box,
        Alert,
        Address,
        XTextarea,
    },

    data() {
        return {
            value5: [],
            currentAddress: {
                index: null,
                show: false,
                phone: '',
                name: '',
                placeCode: [],
                address: ''
            },
            addressData: addressData,
            memberinfo: undefined,
            alertinfo: {
                show: false,
                title: '提示信息',
                des: '',
            },
            loading: {
                show: true,
                text: '加载中...'
            },
        }
    },
    route: {
        data({to: {query}}) {
            // console.log(query)
            let self = this
            // if(!urlParam.action.orgCode){
            //   self.showAlert('orgCode缺失');
            //   return;
            //  }else
            if(!urlParam.action.openID){
              self.showAlert('openID缺失')
              return
            }else if(!urlParam.action.appID){
              self.showAlert('appID缺失')
              return
            }
            return Promise.all([
                // store.getAddressCode(),
                store.getMemberAddress(urlParam.action.mobilePhone)
            ]).then((data) => {
                // console.log(data[0]);
                // if (!data[0].isSuccess) {
                    // data[0] = {
                    //     userName: "老王",
                    //     mobilePhone: "18888888888",
                    //     plat: "门店",
                    //     memberLevelId: "123456",
                    //     addresses: [{
                    //         mobilePhone: "15351777777",
                    //         name: "老王",
                    //         province: "上海",
                    //         city: "上海市",
                    //         district: "徐汇区",
                    //         memberAddress: "桂平路418号"
                    //     }, {
                    //         mobilePhone: "15351777777",
                    //         name: "老李",
                    //         province: "上海",
                    //         city: "上海市",
                    //         district: "徐汇区",
                    //         memberAddress: "桂平路418号"
                    //     }]
                    // }
                //     self.showAlert('数据加载失败，请刷新页面重试')
                //     return {
                //       loading: {
                //           show: false,
                //           text: '加载中...'
                //       }
                //     }
                // }

                return {
                    memberinfo: data[0],
                    loading: {
                        show: false,
                        text: '加载中...'
                    }
                }
            })
        }
    },
    ready: function() {
        // console.log('registerView')

    },
    // function addUrlPara(name, value) {
    //     var currentUrl = window.location.href.split('#')[0];
    //     if (/\?/g.test(currentUrl)) {
    //         if (/name=[-\w]{4,25}/g.test(currentUrl)) {
    //             currentUrl = currentUrl.replace(/name=[-\w]{4,25}/g, name + "=" + value);
    //         } else {
    //             currentUrl += "&" + name + "=" + value;
    //         }
    //     } else {
    //         currentUrl += "?" + name + "=" + value;
    //     }
    //     if (window.location.href.split('#')[1]) {
    //         window.location.href = currentUrl + '#' + window.location.href.split('#')[1];
    //     } else {
    //         window.location.href = currentUrl;
    //     }
    // }
    methods: {
            getPlaceName(value) {
                return value2name(value, addressData)
            },
            getPlaceValue(name) {
                return name2value(name, addressData)
            },
            goCallBackUrl(address){
              let self = this;
              // let url = 'http://192.168.50.149:8080/?mm=asd#!/addressList'
              let url = urlParam.action.callbackUrl
              let hash = url.split('#')[1]
              let search = url.split('#')[0].split('?')[1]
              let mainurl = url.split('#')[0].split('?')[0]

              // console.log(mainparam);

              let addressname = [address.province, address.city, address.district];
              let placeCode = self.getPlaceValue(addressname);
              address.provinceCode = placeCode[0]
              address.cityCode = placeCode[1]
              address.areaCode = placeCode[2]

              let mainparam={};
              let urlparam = '';
              let paramsarr = search.split('&')
              if(paramsarr[0].match('=')){
                paramsarr.forEach(param=>{
                  let mainp = param.split('=')
                  mainparam[mainp[0]] = mainp[1]
                })
              }
              mainparam.selectAddress = encodeURIComponent(Base64.encode(JSON.stringify(address)))
              for (let pkey in mainparam){
                urlparam += pkey + '=' + mainparam[pkey] + '&'
              }
              let resulturl = mainurl + '?' + urlparam.slice(0,urlparam.length-1) + (hash ? ('#' + hash) : '')
              window.location.href = resulturl
              // console.log(resulturl);
            },
            editAddress(index,address) {
                let self = this;
                if (address) {
                    // 编辑地址
                    self.showAlert('暂不支持编辑地址')
                    return
                    let addressname = [];
                    if(address.province&&address.city&&address.district){
                      addressname = [address.province, address.city, address.district];
                    }
                    self.$set('currentAddress', {
                        index: index,
                        show: true,
                        phone: address.mobilePhone,
                        name: address.name,
                        placeCode: addressname.length>0?self.getPlaceValue(addressname):[],
                        placeName: addressname,
                        address: address.memberAddress,
                    })
                }else {
                  self.$set('currentAddress', {
                      index: self.memberinfo ? self.memberinfo.addresses.length : 0,
                      show: true,
                      phone: '',
                      name: '',
                      placeCode: [],
                      placeName: [],
                      address: '',
                  })
                }
            },
            checkSubmitAddress(){
              let self = this
              let valid = true;
              if(self.currentAddress.name==='' || !self.$refs.name.valid){
                self.showAlert('请填写名字')
                valid = false;
              }else if (self.currentAddress.phone==='' || !self.$refs.phone.valid) {
                self.showAlert('请填写正确手机号')
                valid = false;
              }else if (self.currentAddress.address==='') {
                self.showAlert('请填写详细地址')
                valid = false;
              }
              return valid;
            },
            addAddress(currentAddress){
              let self = this
              if (!self.checkSubmitAddress()) {
                return
              }
              if(self.memberinfo.flag === '1'){
                self.openLoading('注册用户信息...')
                //注册用户
                store.register(currentAddress.phone)
                .then(data=>{
                  self.closeLoading()
                  if(data.isSuccess){
                    //更新地址
                    self.$set('memberinfo.flag',0)
                    self.runAddAddress(currentAddress)
                  }else{
                    self.showAlert(data.map.errorMsg)
                  }
                })
              }else{
                self.runAddAddress(currentAddress)
              }
            },
            updateAddress(currentAddress){
              let self = this
              if (!self.checkSubmitAddress()) {
                return
              }
              self.showAlert('暂不支持编辑地址')
              return
              self.runEditAddress(currentAddress)
            },
            runUpdateAddress(currentAddress){
              let self = this
              self.openLoading('更新地址...')
              store.editMemberAddress(sendedata)
              .then(data=>{
                self.closeLoading()
                if(data.isSuccess){
                  self.updateLocalAddress(currentAddress)
                  self.$set('currentAddress.show',false)
                }else{
                  self.showAlert(data.map.errorMsg)
                }
              })
            },
            runAddAddress(currentAddress){
              console.log(currentAddress);
              let self = this
              self.openLoading('添加地址...')
              let addMemberAddressdata = self.getCurrentAddress(currentAddress);
              addMemberAddressdata.address = currentAddress.address;
              store.addMemberAddress(addMemberAddressdata)
              .then(data=>{
                self.closeLoading()
                if(data.isSuccess === true){
                  self.updateLocalAddress(currentAddress)
                  // console.log(data.isSuccess);
                  self.$set('currentAddress.show',false)
                }else{
                  self.showAlert(data.map.errorMsg)
                }
              })
            },
            updateLocalAddress(currentAddress){
              let self = this
              let localAddress = Object.assign({},self.memberinfo)
              localAddress.addresses[currentAddress.index] = self.getCurrentAddress(currentAddress)
              self.$set('memberinfo',localAddress)
            },
            getCurrentCode(currentAddress) {
                let self = this
                return {
                    provinceCode: currentAddress.placeCode[0],
                    cityCode: currentAddress.placeCode[1],
                    areaCode: currentAddress.placeCode[2],
                }
            },
            getCurrentAddress(currentAddress) {
                let self = this
                let placeName = self.getPlaceName(currentAddress.placeCode);
                return {
                    memberAddress: currentAddress.address,
                    mobilePhone: currentAddress.phone,
                    name: currentAddress.name,
                    province: placeName[0],
                    city: placeName[1],
                    district: placeName[2],
                }
            },
            openLoading(text) {
                text = text ? text : '加载中...'
                this.$set('loading', {
                  show: true,
                  text: text
                })
            },
            closeLoading() {
                this.$set('loading', {
                  show: false,
                  text: '加载中...'
                })
            },
            showAlert(des, callback) {
                this.$set('alertinfo.show', true)
                if (des) {
                    this.$set('alertinfo.des', des)
                } else {
                    this.$set('alertinfo.des', '')
                }
                if (typeof callback === 'function') {
                    this.alertcallback = callback
                } else {
                    this.alertcallback = () => {}
                }
            },
            alertcallback() {},
    },
}

</script>
