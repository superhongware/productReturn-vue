<template>
  <li class="mui-table-view-cell">
      <div class="flexCon">
          <div class="flexOne">{{store.storeName}}</div>
          <span class="fontOrange">
              <span class="mui-icon iconfont icon-ditu1 fontOrange"></span>
          <span class="mainrange">{{getRange(store.range)}}</span>
          </span>
      </div>
      <p class="fontEll">{{store.address}}</p>
  </li>
</template>

<script>
import store from '../store'

export default {
  props:['store'],

  data () {
    return {
      // user: {}
    }
  },
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
