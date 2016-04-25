<template>
  <ul class="storeBox" >
      <store-item :store='store' v-for="store in stores | orderBy 'range'"></store-item>
  </ul>
</template>

<script>
// import store from '../store'
import storeItem from './storeItem.vue'

export default {
  props:{
    stores:Array,
  },
  components: {
    // Scroller,
    storeItem
  },
}
</script>

<style lang="sass">

</style>
