<template>
  <li class="mui-table-view-cell">
      <div class="flexCon">
          <div class="flexOne">{{store.storeName}}</div>
          <span class="fontOrange">
              <span class="mui-icon iconfont icon-ditu1 fontOrange"></span>
              <span class="mainrange" v-if="store.range>0">{{(store.range/1000).toFixed(2)}}km</span>
              <span class="mainrange" v-if="!(store.range>0)">未查到距离</span>
          </span>
      </div>
      <p class="fontEll">{{store.address}}</p>
  </li>
</template>

<script>
import store from '../store'


export default {
  props:['store'],
  methods:{
    getRange:range=>{
      if(range>0){
        return (storedata[i].range / 1000).toFixed(2) + 'km';
      }else {
        return '未查到距离'
      }
    }
  }
}
</script>

<style lang="stylus">

</style>
