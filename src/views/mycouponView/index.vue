<style lang="sass">
	@import './mycouponView.scss'
</style>

<template>

	<div>
		<div>
			<tab active-color="#427dbf">
				<tabitem :selected="demo1 === '未使用'" @click="tabSwitch('未使用')">未使用</tabitem>
				<tabitem :selected="demo1 === '已使用'" @click="tabSwitch('已使用')">已使用</tabitem>
			</tab>
			<div v-show="!loading.show">
				<div v-if="showUn">
					<div class="noData" v-if="unData.length==0">没有相关数据</div>
					<flexbox class="couponList" v-for="item in unData" @click="detailCoupon(item)">
						<div class="couponImg">{{item.couponTypeName}}</div>
						<flexboxitem>
							<div class="couponText">
								{{item.couponName}}<br> 使用期限：{{item.lifespan}}
							</div>
						</flexboxitem>
					</flexbox>
				</div>
				<div v-else>
					<div class="noData" v-if="yeData.length==0">没有相关数据</div>
					<flexbox class="couponList" v-for="item in yeData">
						<div class="couponImg">{{item.couponTypeName}}</div>
						<flexboxitem>
							<div class="couponText">
								{{item.couponName}}<br> 使用期限：{{item.lifespan}}
							</div>
						</flexboxitem>
					</flexbox>
				</div>
			</div>
		</div>
		<loading :show="loading.show" :text="loading.text"></loading>
	</div>

</template>

<script>
	import Loading from 'vux/components/loading'
	import Tab from 'vux/components/tab'
	import Tabitem from 'vux/components/tab-item'
	import Flexbox from 'vux/components/flexbox'
	import Flexboxitem from 'vux/components/flexbox-item'
	import store from 'src/store'
	export default {
		components: {
			Loading,
			Tab,
			Tabitem,
			Flexbox,
			Flexboxitem
		},
		data() {
			return {
				loading: {
					show: true,
					text: '加载中...'
				},
				demo1: '未使用',
				showUn: true,
				unData: [],
				yeData: []
			}
		},
		route: {
			data: function() {
				this.loading.show = true
				var self = this;
				store.CouponInfoSearch().then(data => {
					self.loading.show = false
					console.log(data)
					if (!data.isSuccess) {
						alert(data.map.errorMsg);
						return
					}
					var coupons = data.coupons;
					console.log(coupons)
					coupons.forEach(function(x) {
						if (x.couponStatus == 0) {
							self.unData.push(x)
						} else {
							self.yeData.push(x)
						}
					})
				})
			}
		},
		ready: function() {

		},
		methods: {
			tabSwitch(x) {
				this.demo1 = x;
				this.showUn = x == '未使用' ? true : false
			},
			detailCoupon(x) {
				this.$route.router.go({
					name: 'couponDetail',
					params: {
						code: x.couponNumber
					}
				})
			}
		},
	}
</script>