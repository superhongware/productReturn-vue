<template>
	<div class="bacodeimg">
		<img class="barcodeData" :src="loadData(barcode)"/>
	</div>
</template>

<script>
	import jsbarcode from 'jsbarcode'
	export default {
		props: ['barcode'],
		methods:{
			loadData(barcode) {
				console.log(barcode)
				if(!barcode){
					return
				}
				setTimeout(function(){
					jsbarcode(".barcodeData",barcode, {
					format: "CODE128",
					lineColor: "#000",
					width: 2,
					height: 60,
					displayValue: false
				});
				},0)
				
			}
		},

	}
</script>

<style lang="sass" scoped>
	.bacodeimg img {
		width: 100%;
		display: block;
	}
</style>