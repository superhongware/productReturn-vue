<style lang="sass">
	@import './qrbacodeView.scss'
</style>

<template>

	<div>
		<div>
			<xheader :left-options="{showBack: false}" style="background-color:#f8f8f8;">优惠劵</xheader>
			<div class="qrcount">
				<h2>宏巍软件</h2>
				<h1>{{name}}</h1>
				<div class="qrcode">
					<qrcode-img :qrcode="code"></qrcode-img>
				</div>
				<div class="bacode">
					<barcode-img :barcode="code"></barcode-img>
				</div>
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
				name:'',
				orgcode: urlParam.action.orgcode,
				loading: {
					show: true,
					text: '加载中...'
				}
			}
		},
		route: {
			data: function(transition) {
				return {
					code: transition.to.params.code,
					name: transition.to.params.name,
					loading: {
						show: false,
						text: '加载中...'
					}
				}
			}

		}
	}
</script>