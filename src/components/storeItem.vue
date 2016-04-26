<template>
<li class="store">
    <div class="flexBox">
        <div class="storeName">{{store.storeName}}</div>
        <span class="rangetext orangecolor">
            <span class="mui-icon iconfont icon-dizhi orangecolor"></span>
            <span class="mainrange" v-if="store.range>0">{{(store.range/1000).toFixed(2)}}km</span>
        </span>
    </div>
    <p class="storeadress">{{store.address}}</p>
</li>
</template>

<script>
// import store from '../store'

export default {
  props:{
    store:Object
  },
}
</script>

<style lang="sass" scoped>
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
