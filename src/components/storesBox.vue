<template>
    <!-- <ul class="storeBox" >
    <store-item :store='store' v-for="store in stores | orderBy 'range'" transition="item"></store-item>
  </ul> -->
<ul class="storeBox" >
  <li class="store" v-for="store in stores | orderBy 'range'" transition="item">
      <div class="flexBox">
          <div class="storeName">{{store.storeName}}</div>
          <span class="rangetext orangecolor">
              <span class="mui-icon iconfont icon-dizhi orangecolor"></span>
              <span class="mainrange" v-if="store.range>0" >{{(store.range/1000).toFixed(2)}}km</span>
              <span class="mainrange" v-if="!(store.range>0)" >未获取距离</span>
          </span>
      </div>
      <p class="storeadress">{{store.address}}</p>
  </li>
</ul>
</template>

<script>
// import store from '../store'
// import storeItem from './storeItem.vue'
export default {
  props:{
    stores:Array,
  },
  components: {
    // Scroller,
    // storeItem
  },
}
</script>

<style lang="scss">
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


.store{
  list-style:none;
  background-color:#fff;
  border-bottom:1px solid #ddd;
  width:100%;
  height:70px;
  padding:10px;
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
</style>
