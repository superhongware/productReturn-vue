<template>
    <!-- <ul class="storeBox" >
    <store-item :store='store' v-for="store in stores | orderBy 'range'" transition="item"></store-item>
  </ul> -->
<ul class="storeBox" >
  <li class="nostore" v-if="stores&&stores.length==0">附近没有门店</li>
  <li  class="store" v-if="stores" v-for="store in stores | orderBy 'range'" track-by="_uid" transition="item" stagger='100'>
      <div class="flexBox">
          <div class="storeName">{{store.storeName}}</div>
          <span class="rangetext orangecolor">
              <span class="mui-icon iconfont icon-dizhi orangecolor"></span>
              <span class="mainrange" v-if="store.range>0&&store.range<9999999" >{{(store.range/1000).toFixed(2)}}km</span>
              <span class="mainrange" v-if="store.range>9999998" >未获取距离</span>
          </span>
      </div>
      <p class="storeadress">{{store.address}}</p>
      <div class="promotions" :style="{height:activeheight(store)+'px'}" @click="openit(store._uid)">
        <p class="promotion" v-for="promotion in store.promotions">
          <span class="ptype" :style="'background-color:'+colors[promotion.promotionType]">{{promotion.promotionType}}</span>{{promotion.promotionName}}
        </p>
      </div>
      <span v-if="store.promotions.length>3" class="iconfont icon-fanhui4 downarrow" :class="{uparrow:store.openPromotions}"></span>
  </li>
</ul>
</template>

<script>
// import store from '../store'
// import storeItem from './storeItem.vue'
export default {
  props:{
    stores:[Array,Boolean],
    openit:Function,
  },
  data(){
    return {
      colors:{
        '惠': '#FF3300',
        '免': '#EA9E00',
        '折': '#3366CC',
        '送': '#70BC46',
        '减': '#6699FF',
        '特': '#FFC62F',
        '返': '#EF7272',
        '团': '#FF6600',
        '劵': '#3AC78F',
        '赠': '#D20000',
        '新': '#FF9966',
      }
    }
  },
  components: {
    // Scroller,
    // storeItem
  },
  methods:{
    activeheight(store){
      if(store.openPromotions){
        return store.promotions.length*20
      }else{
        if(store.promotions.length>3){
          return 60
        }else{
          return store.promotions.length*20
        }
      }
    }
  }
}
</script>

<style lang="sass">
.container {
  width: 300px;
}
.item {
  box-sizing: border-box;
  // background-color: #eee;
  border: 1px solid black;
  display: inline-block;
  width: 100px;
  height: 100px;
}
.item-transition {
  transition: all .5s ease;
}
.item-enter {
  opacity: 0;
}
.item-leave {
  opacity: 0;
  position: absolute; /* important for removal move to work */
}
.item-move {
  // color: red;
  transition: transform 0.5s cubic-bezier(.55,0,.1,1); /* applied when moving */
}
.nostore{
  text-align:center;
}

.store{
  list-style:none;
  background-color:#fff;
  border-bottom:1px solid #ddd;
  width:100%;
  // height:70px;
  padding:10px;
  .flexBox{
    height: 25px;
    overflow: hidden;
  }
}
.rangetext{
  text-align:right;
  flex: 1;
  font-size:14px;
  line-height:25px;
  .iconfont{
    position:relative;
    top:-2px;
    right:-4px;
    font-size:16px;
  }
}
.storeadress{
  font-size:12px;
  color:#666;
  line-height:25px;
}
.promotions{
  width:100%;
  overflow:hidden;
  transition:0.3s;
}
.promotion{
  font-size:13px;
  line-height: 17px;
  width: 100%;
  height: 16px;
  margin: 3px 0;
  padding-left:20px;
  overflow: hidden;
  position:relative;
  color:#999;
  white-space:nowrap;
  text-overflow:ellipsis;
  .ptype{
    width:16px;
    height:16px;
    line-height:16px;
    position:absolute;
    left:0px;
    top:0px;
    text-align:center;
    color: #fff;
    font-size:12px;
    border-radius:2px;
    display: inline-block;
  }
}
.downarrow{
  width:100%;
  height:1px;
  line-height:8px;
  color:#bbb;
  text-align:center;
  display:block;
  transform: rotate(0deg);
  transition:0.3s;
}
.uparrow{
  transform: rotate(-180deg);
}

</style>
