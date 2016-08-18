<style lang="sass">
	@import './couponView.scss'
</style>

<template>

	<div>
		<div>
			<xheader :left-options="{showBack: false}" style="background-color:#f8f8f8;">优惠劵</xheader>
			<div class="discount">
				<img class="disIcon" :src="couponInfo.couponLogo" style="top:30px" v-if="couponInfo.couponType=='3'">
				<img class="disIcon" :src="couponInfo.couponLogo" v-else>
				<div class='disImg'>
					<div class="disName" v-if="couponInfo.couponType=='1'">
						<div class="disNamet">
							<span>￥</span>{{couponInfo.couponSmaller}}
						</div>
						<p>元优惠劵<br>&nbsp;</p>
					</div>
					<div class="disName disNamezhe" v-if="couponInfo.couponType=='2'">
						<div class="disNamet">
							{{couponInfo.couponSmaller}}<span>折</span>
						</div>
						<p>优惠劵<br>&nbsp;</p>
					</div>
				</div>
				<!--<div class='disImg'>
					<img :src="imgSrc" />
				</div>-->
				<h1>{{couponInfo.couponName}}</h1>
				<button class="weui_btn  mui-btn-disable" style="width:140px" v-if="btnStatus=='1'">活动已结束</button>
				<button class="weui_btn  mui-btn-disable" style="width:220px" v-if="btnStatus=='2'">来晚了，优惠劵已被抢完</button>
				<button class="weui_btn  mui-btn-disable" style="width:140px" v-if="btnStatus=='3'">该手机号已领取</button>
				<button class="weui_btn weui_btn_primary" style="width:115px" @click="prompt" v-if="!btnStatus"> 立即领取 </button>
				<p>使用条件：满{{couponInfo.useCondition}}{{couponInfo.couponType=='3'?'件':'元'}}可用<br>使用时间：{{couponInfo.lifespan}}<br>使用说明：{{{couponInfo.memo}}}</p>
			</div>

		</div>
		<loading :show="loading.show" :text="loading.text"></loading>
	</div>

</template>

<script>
	import {
		Promise
	} from 'es6-promise'
	import Loading from 'vux/components/loading'
	import Xheader from 'vux/components/x-header'
	import store from 'src/store'
	export default {
		components: {
			Loading,
			Xheader,
		},
		data() {
			return {
				loading: {
					show: true,
					text: '加载中...'
				},
				imgSrc: 'static/images/_liwu.png',
				btnStatus: '',
				couponInfo: {},
			}
		},
		route: {},
		ready: function() {
			var self = this
			store.CouponInitialization().then(data => {
				console.log(data)
				self.loading.show = false
				if(!data.isSuccess) {
					alert(data.map.errorMsg);
					return
				}
				this.btnStatus = data.prompt
				this.btnStatus = data.prompt || ''
			})
			store.fetchUrlParma().then(data => {
				store.CouponInfoGet(data.action.couponId).then(data => {
					console.log(data)
					self.loading.show = false
					if(!data.isSuccess) {
						alert(data.map.errorMsg);
						return
					}
					self.couponInfo = data.couponInfo;
					self.couponInfo.memo = self.couponInfo.memo.replace(/`/g, "<br>")
				})
			})

		},
		methods: {
			prompt() {
				var self = this;
				store.CouponReceive(self.couponInfo.couponCode)
					.then(data => {
						console.log(data)
						if(!data.isSuccess) {
							alert(data.map.errorMsg);
							return
						}
						if(data.prompt == 0) {
							var tel = prompt("请输入手机号码:", "");
							if(tel != null) {
								var telReg = !!(tel).match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
								if(telReg == false) {
									alert("请输入正确的手机号")
									return
								}
								store.RMCouponReceive(tel, self.couponInfo.couponCode)
									.then(data => {
										console.log(data)
										if(!data.isSuccess) {
											alert(data.map.errorMsg);
											return
										}
										alert('领取成功，已存入会员卡包');
										this.$route.router.go({
											name: 'mycoupon'
										})
									})

							}
						} else if(data.prompt == 4) {
							alert('手机号已领取');
							this.$route.router.go({
								name: 'mycoupon'
							})
						} else if(data.prompt == 3) {
							alert('领取成功，已存入会员卡包');
							this.$route.router.go({
								name: 'mycoupon'
							})
						}
					})

			},
			goCode() {
				this.$route.router.go({
					name: 'qrbacode',
					params: {
						code: '123'
					}
				})
			}
		},
	}
</script>