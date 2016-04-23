<template>
  <!-- <div class="topba">aa</div> -->
  <fetch-item :store='stores[0]'></fetch-item>
</template>

<script>
import store from '../store'
import storeItem from '../components/storeItem.vue'
// import Comment from './Comment.vue'
//
export default {

  name: 'ItemView',

  components: {
    storeItem
  },

  data () {
    return {
      stores: [],
    }
  },

  route: {
    data ({ to }) {
      // return store.fetchItem(to.params.id).then(item => {
      //   document.title = item.title + ' | Vue.js HN Clone'
      //   return {
      //     item,
      //     // the final resolved data can further contain Promises
      //     comments: store.fetchItems(item.kids),
      //     pollOptions: item.type === 'poll'
      //       ? store.fetchItems(item.parts)
      //       : null
      //   }
      // })
    }
  },

  computed: {
    // isJob () {
    //   return this.item.type === 'job'
    // },
    //
    // hasText () {
    //   return this.item.hasOwnProperty('text')
    // }
  }
}
</script>

<style lang="sass">
.topba{
  background-color:'#ccc';
}
</style>
