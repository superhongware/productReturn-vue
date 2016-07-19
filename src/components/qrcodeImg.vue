<template>
  <div class="qrcodeimg">
    <img :src="qrcode2img(qrcode)" alt="" />
  </div>
</template>

<script>
import QRCode from 'qrcode-generator';

export default {
  props:['qrcode'],
  methods:{
    qrcode2img:qrcode=>{
    	// console.log(qrcode)
      let qr	= new QRCode(10, 'H');
			qr.addData(qrcode);
			qr.make();
      let imgstr = qr.createImgTag(4);
      return imgstr.slice(10, imgstr.indexOf('" w'));
    }
  }
}
</script>

<style lang="sass" scoped>
.qrcodeimg{
  width:100%;
  img{
    width:100%;
  }
}
</style>
