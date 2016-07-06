<style lang="sass" scoped>

@import './addressListView.scss'

</style>

<template>

<div class="address">
    <div v-if="memberinfo!==undefined && memberinfo.channelMember">
      <div
      v-for="(index, address) in memberinfo.channelMember.memberAddress"
      class="addressbox">
      <!-- {{address | json} -->
        <h2>{{address.consignee+' '+address.mobilePhone}}</h2>
        <p>{{address.provinceName + address.cityName + address.areaName + address.address}}</p>
        <div class="addresslink" @click="goCallBackUrl(address)"></div>
        <div class="addressedit" @click="editAddress(index,address)">
          <i class="">i</i>
        </div>
      </div>
    </div>
    <div class="noaddresslist" v-if="memberinfo===undefined">
      您还没有添加过地址，<br/>
      点击下面按钮添加一个吧
    </div>
    <box gap="10px 10px">
      <x-button type="primary" @click="editAddress()">+ 添加新地址</x-button>
      <!-- <x-button type="warn" @click="editAddress(memberinfo.channelMember.memberAddress.length)">删除地址</x-button> -->
    </box>
    <group v-if="currentAddress.show" class="editaddress" transition="slideTop">
      <x-input title="收货人" placeholder="名字" :min="1"  :value.sync="currentAddress.name" v-ref:name></x-input>
      <x-input title="手机号" placeholder="11位手机号" is-type="china-mobile"  :value.sync="currentAddress.phone" v-ref:phone></x-input>
      <Address title="选择地区" :list="addressData" :value.sync="currentAddress.placeCode"></Address>
      <x-textarea title="详细地址" required placeholder="街道门牌信息" :value.sync="currentAddress.address" v-ref:address></x-textarea>
      <box gap="10px 10px">
        <x-button v-if="memberinfo && currentAddress.index < memberinfo.channelMember.memberAddress.length" type="primary" @click="saveAddress(currentAddress)">修改地址</x-button>
        <x-button v-if="!memberinfo || currentAddress.index === memberinfo.channelMember.memberAddress.length" type="primary" @click="saveAddress(currentAddress)">保存地址</x-button>
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
// import addressData from '../../tools/address.json'
// 测试用代码
import addressData from '../../tools/address0.js'

console.log(addressData);
import {UrlParam} from '../../tools/GetUrlParam'
const urlParam = UrlParam();
import {Base64}from 'js-base64'
const ma = Base64.encode(JSON.stringify({orgCode: "o2o", callbackUrl: 'http://192.168.50.149:8080/?action=123#!/addressList', openID:"a00001", appID:"xxxx", mobilePhone:'18202167102'}))
// eyJvcmdDb2RlIjoibzJvIiwiY2FsbGJhY2tVcmwiOiJodHRwOi8vMTkyLjE2OC41MC4xNDk6ODA4MC8/YWN0aW9uPTEyMyMhL3JlZ2llc3QiLCJvcGVuSUQiOiJhMDAwMDEiLCJhcHBJRCI6Inh4eHgifQ==
console.log(ma);
console.log(location.origin+'/?action='+ma+'#!/addressList');

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
                show: false,
                text: '加载中...'
            },
        }
    },
    route: {
        data({to: {query}}) {
            console.log(query)
            let self = this
            if(!urlParam.action.mobilePhone){
              // self.showAlert('mobilePhone缺失');
              if(!urlParam.action.orgCode){
               self.showAlert('orgCode缺失');
               }else if(!urlParam.action.openID){
                 self.showAlert('openID缺失');
               }else if(!urlParam.action.appID){
                 self.showAlert('appID缺失');
               }
               return;
            }
            return Promise.all([
                // store.getAddressCode(),
                store.getMemberAddress(urlParam.action.mobilePhone)
            ]).then((data) => {
                console.log(data[0]);
                if (!data[0].isSuccess) {
                    data[0] = {
                        channelMember: {
                            userName: "老王",
                            mobilePhone: "18888888888",
                            plat: "门店",
                            memberLevelId: "123456",
                            memberAddress: [{
                                mobilePhone: "15351777777",
                                consignee: "老王",
                                provinceName: "上海",
                                cityName: "上海市",
                                areaName: "徐汇区",
                                address: "桂平路418号"
                            }, {
                                mobilePhone: "15351777777",
                                consignee: "老李",
                                provinceName: "上海",
                                cityName: "上海市",
                                areaName: "徐汇区",
                                address: "桂平路418号"
                            }]
                        }
                    }
                }
                // let [ orderdata, urlParam] = data
                // document.title = getTitleName(urlParam)
                // console.log('returndata',orderdata.order.logisticInfo.address);
                // self.getmaininfo();
                return {
                    // stores: stores,
                    memberinfo: data[0],
                }
            })
        }
    },
    ready: function() {
        console.log('registerView')

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
              // let url = urlParam.action.callbackUrl
              // let params = ''
              // let addressname = [address.provinceName, address.cityName, address.areaName];
              // let placeCode = self.getPlaceValue(addressname);
              // address.provinceCode = placeCode[0]
              // address.cityCode = placeCode[1]
              // address.areaCode = placeCode[2]
              // for (key in address) {
              //   params+= '&' + key + '=' + address[key]
              // }
              // url+'?action='params.slice(1)
            },
            editAddress(index,address) {
                let self = this;
                if (index&&address) {
                    let addressname = [];
                    if(address.provinceName&&address.cityName&&address.areaName){
                      addressname = [address.provinceName, address.cityName, address.areaName];
                    }
                    self.$set('currentAddress', {
                        index: index,
                        show: true,
                        phone: address.mobilePhone,
                        name: address.consignee,
                        placeCode: addressname.length>0?self.getPlaceValue(addressname):[],
                        placeName: addressname,
                        address: address.address,
                    })
                }else {
                  self.$set('currentAddress', {
                      index: self.memberinfo ? self.memberinfo.channelMember.memberAddress.length : 0,
                      show: true,
                      phone: '',
                      name: '',
                      placeCode: [],
                      placeName: [],
                      address: '',
                  })
                }
            },
            saveAddress(currentAddress){
              let self = this
              if(currentAddress.name==='' || !self.$refs.name.valid){
                self.showAlert('请填写名字')
                return;
              }else if (currentAddress.phone==='' || !self.$refs.phone.valid) {
                self.showAlert('请填写正确手机号')
                return;
              }else if (currentAddress.address==='') {
                self.showAlert('请填写详细地址')
                return;
              }

              if(!self.memberinfo){
                self.openLoading('注册用户信息...')
                //注册用户
                store.register(currentAddress.phone)
                .then(data=>{
                  console.log(data);
                  if(data.success){
                    //更新地址
                    self.openLoading('更新地址...')
                    self.updateAddress(currentAddress)
                  }else{
                    self.closeLoading()
                    self.showAlert(data.map.errorMsg)
                  }
                })
              }else{
                self.updateAddress(currentAddress)
              }
            },
            updateAddress(currentAddress){
              let self = this
              let sendedata = Object.assign({},self.memberinfo)
              sendedata.channelMember.memberAddress[currentAddress.index] = self.getCurrentAddress(currentAddress)
              self.openLoading('更新地址...')
              store.setMemberAddress(sendedata)
              .then(data=>{
                self.closeLoading()
                if(data.issuccess){
                  self.$set('memberinfo',sendedata)
                  self.$set('currentAddress.show',false)
                }else{
                  self.showAlert(data.map.errorMsg)
                }
              })
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
                    address: currentAddress.address,
                    mobilePhone: currentAddress.phone,
                    consignee: currentAddress.name,
                    provinceName: placeName[0],
                    cityName: placeName[1],
                    areaName: placeName[2],
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
