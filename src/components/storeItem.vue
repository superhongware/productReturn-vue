<template>
  <li class="mui-table-view-cell">
      <div class="flexCon">
          <div class="flexOne">{{store.storeName}}</div>
          <span class="fontOrange">
              <span class="mui-icon iconfont icon-ditu1 fontOrange"></span>
          <span class="mainrange">{{store.address}}</span>
          </span>
      </div>
      <p class="fontEll">{{store.address}}</p>
  </li>
</template>

<script>
import store from '../store'

export default {

  name: 'storeItem',

  props:['store'],

  data () {
    return {
      user: {}
    }
  }
}
</script>

<style lang="stylus">

</style>
