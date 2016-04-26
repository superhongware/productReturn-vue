<template>
  <div class="">
    <scroller lock-x  style='height:300px' v-ref:scroller>
      <div class="container">
        <button @click="add">add</button>
        <button @click="remove">remove</button>
        <div class="item" v-for="item in items">
          {{item.text}}
        </div>
      </div>
    </scroller>
  </div>
</template>
<script>
import Scroller from 'vux/components/scroller'
export default{
    components: {
      Scroller,
    },
    data() {
      var items = []
      for (var i = 0; i < 10; i++) {
        items.push({ text: i })
      }
      return {
        items:items
      }
    },
    methods: {
      add: function () {
        console.log('+')
        this.items.unshift({ text: this.items.length })
        console.log(this.$refs.scroller.reset)
        this.$nextTick(() => {
          this.$refs.scroller.reset()
        })
      },
      remove: function () {
        console.log('—')
        this.items.shift()
        this.$nextTick(() => {
          this.$refs.scroller.reset()
        })
      }
    }
}
</script>
<style>
.item {
  box-sizing: border-box;
  background-color: #eee;
  border: 1px solid #ccc;
  display: block;
  width: 100%;
  height: 50px;
}
</style>
