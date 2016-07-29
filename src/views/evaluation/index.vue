<style lang="sass">
	@import './evaluation.scss'
</style>

<template>

	<div>
		<div>
			<xheader :left-options="{showBack: false}" style="background-color:#f8f8f8;">订单评价</xheader>
			<div class="weui_cells_title">服务评价</div>
			<div class="evaluater">
				<div v-for="item in serverComments">
					<flexbox class="evaluatList">
						<div class="evaluatName">{{item.commentField}}</div>
						<flexboxitem style="text-align:right">
							<rater :value.sync='item.commentLevel' :max=5 :font-size=24 active-color="#FF9900" :disabled="orderStatus=='1'?true:false"></rater>
						</flexboxitem>
					</flexbox>
					<div v-show="item.commentLevel>0">
						<div class="evaluatBtn" v-if="item.commentLabels.length>0">
							<a href="javascript:" v-for="btn in item.commentLabels" class="weui_btn weui_btn_default" v-bind:class="{ 'weui_btn_active':btn.status||orderStatus=='1'}" @click="btn.status=!btn.status">{{btn.labelName}}</a>
						</div>
						<p class="pContent" v-if="orderStatus=='1'&&item.commentContent.length>0">备注：{{item.commentContent}}</p>
						<group  v-if="orderStatus=='0'">
							<xtextarea :max="200" :value.sync="item.commentContent" height="100" placeholder="说点什么吧" :show-counter="false"></xtextarea>
						</group>
					</div>
				</div>
			</div>
			<div class="weui_cells_title">商品评价</div>
			<div class="evaluater">
				<div v-for="item in productComments">
					<flexbox class="evaluatList">
						<div class="evaluatName"><img :src="item.productImage||imgSrc"></div>
						<flexboxitem class="evaluatInfo">
							<div class="goodsName">{{item.productName}}</div>
							<div class="goodsNumber">{{item.productNumber}}</div>
							<div class="goodsSku">{{item.productSkuName}}</div>
						</flexboxitem>
					</flexbox>
					<div class="evaluatPd">
						<rater :value.sync='item.commentLevel' :max=5 :font-size=24 active-color="#FF9900" :disabled="orderStatus=='1'?true:false"></rater>
					</div>
					<div v-show="item.commentLevel>0">
						<p class="pContent" v-if="orderStatus=='1'&&item.productContent.length>0">备注：{{item.productContent}}</p>
						<group v-if="orderStatus=='0'">
							<xtextarea :max="200" :value.sync="item.productContent" height="100" placeholder="说点什么吧" :show-counter="false"></xtextarea>
						</group>
					</div>
				</div>
			</div>
		</div>
		<div class="evaluatFirm" v-if="orderStatus=='0'"><a href="javascript:" class="weui_btn weui_btn_default" @click="saveEva">确定评价</a></div>
		<loading :show="loading.show" :text="loading.text"></loading>
	</div>

</template>

<script>
	import Loading from 'vux/components/loading'
	import Xheader from 'vux/components/x-header'
	import store from 'src/store'
	import Rater from 'vux/components/Rater'
	import Flexbox from 'vux/components/flexbox'
	import Flexboxitem from 'vux/components/flexbox-item'
	import Xtextarea from 'vux/components/x-textarea'
	import Group from 'vux/components/group'
	export default {
		components: {
			Loading,
			Xheader,
			Rater,
			Flexbox,
			Flexboxitem,
			Xtextarea,
			Group
		},
		data() {
			return {
				imgSrc: 'static/images/wutu.gif',
				serverComments: [],
				productComments: [],
				orderStatus:"",
				loading: {
					show: true,
					text: '加载中...'
				}
			}
		},
		ready: function() {
			var self = this
			self.loading.show = false
			store.CommentInfoGet().then(data => {
				console.log(data)
				self.loading.show = false
				if (!data.isSuccess) {
					alert(data.map.errorMsg);
					return
				}
				data.serverComments.forEach(function(x) {
					if(x.commentLevel == '' || x.commentLevel == '0'){
						x.commentLevel = 0
					}
					else{
						x.commentLevel=parseInt(x.commentLevel)
					}
					x.commentLabels.forEach(function(y) {
						y.status = false;
					})
				})
				data.productComments.forEach(function(x) {
					if(x.commentLevel == '' || x.commentLevel == '0'){
						x.commentLevel = 0
					}
					else{
						x.commentLevel=parseInt(x.commentLevel)
					}
				})
				self.orderStatus = data.orderStatus
				self.productComments = data.productComments
				self.serverComments = data.serverComments
			})
		},
		methods: {
			saveEva() {
				var self = this
				var serverComments = []
				self.serverComments.forEach(function(x) {
					var Labels = []
					x.commentLabels.forEach(function(y) {
						if (y.status) {
							Labels.push(y.labelId)
						}
					})
					serverComments.push({
						"serverCommentFiledId": x.commentFieldId,
						"serverCommentLevel": x.commentLevel == 0 ? 5 : x.commentLevel,
						"serverCommentLabelId": Labels.join(','),
						"serverContent": x.commentContent
					})
				})
				var productComments = []
				self.productComments.forEach(function(x) {
					productComments.push({
						"productID": x.productID,
						"productItemID": x.productItemID,
						"productCommentLevel": x.commentLevel == 0 ? 5 : x.commentLevel,
						"productCommentContent": x.productContent
					})
				})
				var CommentData = {
					orderComment: {
						serverComments: serverComments,
						productComments: productComments,
						orderStatus: '0'
					}
				}
				console.log(CommentData)
				self.loading.show = true
				self.loading.text = '保存中'
				store.CommentAdd(JSON.stringify(CommentData)).then(data => {
					console.log(data)
					self.loading.show = false
					if (!data.isSuccess) {
						alert(data.map.errorMsg);
						return
					}
					alert("评价成功，谢谢您的评价");
					window.location.reload()
				})

			}
		}
	}
</script>