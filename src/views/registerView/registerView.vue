<style lang="sass" scoped>

@import './registerView.scss'

</style>

<template>

<div class="register">
    <group title="验证用户信息">
      <!-- <cell title="get valid value" ></cell> -->
      <x-input
      title="手机号"
      is-type="china-mobile"
      :show-clear="true"
      :value.sync="phone"
      v-ref:chinamobile></x-input>
      <x-input title="验证码" class="weui_vcode" :value.sync="vcode">
        <x-button slot="right" type="primary" v-if="vcodetime<=0&&$refs.chinamobile.valid&&phone!=''" class="getvcode" @click="getvcode()">发送验证码</x-button>
        <x-button slot="right" type="primary" v-if="vcodetime<=0&&(!$refs.chinamobile.valid||phone=='')" class="getvcode forbidden">发送验证码</x-button>
        <x-button slot="right" type="primary" v-if="vcodetime>0" class="getvcode forbidden">发送验证码({{vcodetime}}s)</x-button>
      </x-input>

    </group>
    <box gap="10px 10px">
      <x-button type="primary" class="submitbtn" @click="submitinfo()">提交信息</x-button>
    </box>

    <!-- <actionsheet :show.sync="showAction" :menus="menus2" @menu-click="menuclick" cancel-text="取消" show-cancel></actionsheet> -->
    <loading :show="loading.show" :text="loading.text"></loading>
    <alert :show.sync="alertinfo.show" :title="alertinfo.title" @on-hide="alertcallback">{{alertinfo.des}}</alert>
</div>

</template>

<script>
import { Promise } from 'es6-promise'
import store from 'src/store'
import Scroller from 'vux/components/scroller'
import Loading from 'vux/components/loading'
import XInput from 'vux/components/x-input'
import Cell from 'vux/components/cell'
import Group from 'vux/components/group'
import XButton from 'vux/components/x-button'
import Box from 'vux/components/box'
import Alert from 'vux/components/alert'

// import {Scroller, Loading, XInput, Cell, Group, XButton, Box, Alert} from 'vux'
import { UrlParam } from '../../tools/GetUrlParam'
const urlParam = UrlParam();

// import {Base64} from 'js-base64'
// const ma = Base64.encode(JSON.stringify({orgCode: "o2o", callbackUrl: 'http://192.168.50.149:8080/?action=123#!/regiest', openID:"a00001", appID:"xxxx"}))
// eyJvcmdDb2RlIjoibzJvIiwiY2FsbGJhY2tVcmwiOiJodHRwOi8vMTkyLjE2OC41MC4xNDk6ODA4MC8/YWN0aW9uPTEyMyMhL3JlZ2llc3QiLCJvcGVuSUQiOiJhMDAwMDEiLCJhcHBJRCI6Inh4eHgifQ==
// console.log(ma);
// console.log(location.origin+'/?action='+ma+'#!/register');
// console.log(Base64.decode('eyJvcmdDb2RlIjoibzJvIiwiY2FsbGJhY2tVcmwiOiJodHRwOi8vaG9uZ3dlaS5jb21lb25jbG91ZC5uZXQvY3VzdG9taXplL3Nob3AvP3Y9MS4wJm5ncm91dGU9L2NyZWF0ZU9yZGVyIy9jcmVhdGVPcmRlciIsIm9wZW5JRCI6Im9YVjlydUNQaXlIOGZpVnlpREt4R0JMNEZTSGsiLCJhcHBJRCI6Inh4eHgifQ=='));
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
    },

    data() {
        //验证码60秒发一次  倒计时记录在localStorage里 防止刷新页面  倒数时间直接刷新
        let vcodetime = 0;
        let sendtime = window.localStorage.getItem('timeCutDown')
        if(sendtime!== null){
          let dtime = new Date().getTime() - new Date(sendtime).getTime();
          dtime = 60 - parseInt(dtime/1000);
          vcodetime = dtime > 0 ? dtime : 0;
        }
        return {
          phone: '',
          vcode: '',
          vcodetime: vcodetime,
          originvcode:null,
          alertinfo:{
            show: false,
            title: '提示信息',
            des: '',
          },
          loading:{
            show: false,
            text:'加载中...'
          },
        }
    },

    // route: {
    //     data({to:{query}}) {
    //         console.log(query)
    //         let self = this;
    //         // return Promise.all([
    //         //     // store.fetchStors2(),
    //         //     // store.fetchOrder(),
    //         //     // store.fetchUrlParma(),
    //         // ]).then((data) => {
    //         //     // let [ orderdata, urlParam] = data
    //         //     // document.title = getTitleName(urlParam)
    //         //     // console.log('returndata',orderdata.order.logisticInfo.address);
    //         //     // self.getmaininfo();
    //         //     return {
    //         //         // stores: stores,
    //         //         orderaddress: orderdata.order.logisticInfo.address,
    //         //     }
    //         // })
    //     }
    // },
    ready: function() {
      let self = this
      if(!urlParam.action.orgCode){
        self.showAlert('orgCode缺失');
      }else if(!urlParam.action.openID){
        self.showAlert('openID缺失');
      }else if(!urlParam.action.appID){
        self.showAlert('appID缺失');
      }
      if(self.vcodetime>0){
        self.timeCutDown();
      }
    },
    methods: {
        getvcode(){
          let self = this
          self.openLoading()
          if(self.vcodetime>0) return;
          store.sendvcode(self.phone)
          .then(data=>{
            // console.log('cg',data)
            self.closeLoading()
            if (!data.isSuccess) {
              self.showAlert(data.map.errorMsg)
              return
            }
            self.showAlert('验证码发送成功')
            self.timeCutDownStart()
            self.$set('originvcode',data.code)
          })
        },
        openLoading(){
          this.$set('loading.show',true)
        },
        closeLoading(){
          this.$set('loading.show',false)
        },
        showAlert(des,callback){
          this.$set('alertinfo.show',true)
          if(des){
            this.$set('alertinfo.des',des)
          }else{
            this.$set('alertinfo.des','')
          }
          if(typeof callback === 'function'){
            this.alertcallback=callback
          }else{
            this.alertcallback=()=>{}
          }
        },
        alertcallback(){},
        timeCutDownStart(){
          let self = this
          window.localStorage.setItem('timeCutDown',new Date())
          self.$set('vcodetime',60)
          self.timeCutDown()
        },
        timeCutDown(){
          let self = this;
          if(self.vcodetime>0){
            setTimeout(()=>{
              self.$set('vcodetime',self.vcodetime-1)
              self.timeCutDown()
            }, 1000)
          }
        },
        submitinfo(){
          let self = this
          if(!self.$refs.chinamobile.valid || self.phone===''){
            self.showAlert('请填写正确的手机号')
            return
          }
          if(!this.originvcode || this.originvcode !== this.vcode){
            self.showAlert('验证码不正确')
            return
          }
          console.log(urlParam.action.callbackUrl);
          self.openLoading()
          store.register(self.phone)
          .then(data=>{
            console.log('cg',data);
            self.closeLoading()
            self.showAlert('用户信息验证成功',()=>{
              window.location.href = urlParam.action.callbackUrl;
            })
          })
        },
    },
}

// import returnPdView from './returnPdView'
// export default returnPdView

</script>
