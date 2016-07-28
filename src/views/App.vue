<template>
  <div id="wrapper">
    <!-- main view -->
    <router-view
      class="view"
      keep-alive
      transition
      transition-mode="out-in">
    </router-view>
  </div>
</template>
<script>


</script>
<style lang='sass'>
@import url(//at.alicdn.com/t/font_1465983171_0968711.css);
@import "~vux/vux.css";
@import "~vue-animate/dist/vue-animate.min.css";
@import "../variables.scss";

body{
  background-color:$bg;
}
*{
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}


</style>
