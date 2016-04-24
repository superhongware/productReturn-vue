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

<style lang='sass'>
@import '~vux/vux.css';
@import '../main.css';
// @import "../variables.scss";

</style>
