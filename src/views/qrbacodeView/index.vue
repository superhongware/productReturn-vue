<style lang="sass">
	@import './qrbacodeView.scss'
</style>

<template>

	<div>
		<div>
			<xheader :left-options="{showBack: false}" style="background-color:#f8f8f8;">优惠劵</xheader>
			<div class="qrcount">
				<h1>{{name}}</h1>
				<div class="qrcode">
					<qrcode-img :qrcode="code"></qrcode-img>
				</div>
				<div class="bacode">
					<barcode-img :barcode="code"></barcode-img>
				</div>
				<p>优惠码：{{code}}</p>
				<p>请向店员出示</p>
			</div>

		</div>
		<loading :show="loading.show" :text="loading.text"></loading>
	</div>

</template>

<script>
	import Loading from 'vux/components/loading'
	import Xheader from 'vux/components/x-header'
	import qrcodeImg from 'src/components/qrcodeImg.vue'
	import barcodeImg from 'src/components/barcodeImg.vue'
	import {
		UrlParam
	} from 'src/tools/GetUrlParam'
	import {
		Base64
	} from 'js-base64'
	const urlParam = UrlParam();

	export default {
		components: {
			Loading,
			Xheader,
			qrcodeImg,
			barcodeImg
		},
		data() {
			return {
				code: '',
				name: '',
				orgcode: urlParam.action.orgcode,
				loading: {
					show: true,
					text: '加载中...'
				}
			}
		},
		route: {
			data: function(transition) {
				var code, name;
				var params = transition.to.params.code
				if (params.indexOf(',') > 0) {
					code = params.split(',')[0]
					name = unescape(params.split(',')[1])
				} else {
					code = params;
					name = Base64.decode(urlParam.action.couponName)
				}
				return {
					code: code,
					name: name,
					loading: {
						show: false,
						text: '加载中...'
					}
				}
			}

		}
	}
</script>