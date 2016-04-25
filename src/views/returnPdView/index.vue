<style lang="sass">

@import './returnPdView.scss'

</style>

<template>

<div>
    <div v-if="urlParam.action">

        <tab active-color='#007aff'>
            <tab-item v-if='urlParam.action.type!=2&&urlParam.action.type!=9'>我的订单</tab-item>
            <tab-item v-if='urlParam.action.type==2||urlParam.action.type==9' :selected="showstore" @click="showstore=showstore?showstore:!showstore">附近门店</tab-item>
            <tab-item v-if='urlParam.action.type==2' :selected="!showstore" @click="showstore=showstore?!showstore:showstore">我的订单</tab-item>
            <tab-item v-if='urlParam.action.type==9' :selected="!showstore" @click="showstore=showstore?!showstore:showstore">我的优惠券</tab-item>
        </tab>

        <div class="storePage" v-show="showstore">
            <div class="pannelTitle">我的位置</div>
            <div class="flexBox addressinfo">
                <div>
                    <p class="orderlocationbar" @click="show2=true" v-show="addressshow">
                        <span class="iconfont maincolor icon-dizhi orangecolor"></span>当前位置
                        <span class="iconfont rightjiantou icon-fanhui4"></span>
                    </p>
                    <p class="orderlocationbar" @click="show2=true" v-show='!addressshow'>
                        <span class="iconfont maincolor icon-kuaididaishou"></span> 订单收货地址
                        <span class="iconfont rightjiantou icon-fanhui4"></span>
                    </p>
                </div>
                <div class="startaddress" v-show='addressshow'>
                    {{nowaddress}}
                </div>
                <div class="startaddress" v-show='!addressshow'>
                    {{orderaddress}}
                </div>
            </div>
            <div class="pannelTitle">附近门店</div>

            <scroller lock-x v-show='stores' :style='{height:scrollerHeight1}'>
                <stores-box :stores="stores"></stores-box>
            </scroller>
        </div>

        <Scroller lock-x height='scrollerHeight' :style='{height:scrollerHeight}' v-show='!showstore||urlParam.action.type!=2'>
            <qrcode-box v-if="urlParam.action.type!=9" title="订单编号" :title-code="urlParam.action.orderNumber" :qrcode="urlParam.action.orderNumber+(urlParam.action.type==5?','+urlParam.action.code:'')" tips="此二维码用于门店快速找到您的订单"></qrcode-box>
            <qrcode-box v-if="urlParam.action.type==9" title="优惠券编号" :title-code="urlParam.action.code" :qrcode="urlParam.action.code" tips="此二维码用于门店快速验证您的优惠券"></qrcode-box>
        </Scroller>

    </div>
    <actionsheet :show.sync="show2" :menus="menus2" @menu-click="menuclick" cancel-text="取消" show-cancel></actionsheet>
    <loading :show="loading.show" :text="loading.text"></loading>
</div>

</template>

<script>

import returnPdView from './returnPdView'
export default returnPdView

</script>
