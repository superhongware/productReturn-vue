<template>
<div class="pagebox">
    <p class="listNo">{{title}} : {{titleCode}}</p>
    <div class="qrCon">
        <qrcode-img :qrcode="qrcode"></qrcode-img>
    </div>
    <p class="listNo">{{tips}}</p>
</div>
</template>

<script>
import store from '../store'
import qrcodeImg from './qrcodeImg.vue'

// console.log(urlParam)
export default {
  props:{
    title:String,
    titleCode:String,
    tips:String,
    qrcode:String
  },
  components: {
    qrcodeImg
  },
}
</script>

<style lang="sass">
.pagebox{
  width:100%;
  .listNo{
    width:100%;
    text-align:center;
    font-size:14px;
    padding:20px 0;
    color:#666;
  }
  .qrCon{
    width:70%;
    margin:0 auto;
  }
}
</style>
