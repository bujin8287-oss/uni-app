<template>
	<view class="page">
		<view class="card">
			<view class="row"><text>来料检验编号</text><text>{{ detail.code }}</text></view>
			<view class="row"><text>检验物料编码</text><text>{{ detail.materialCode }}</text></view>
			<view class="row"><text>检验物料名称</text><text>{{ detail.materialName }}</text></view>
			<view class="row"><text>检验方式</text><text>{{ detail.method }}</text></view>
			<view class="row"><text>检验数量</text><text>{{ detail.qty }}</text></view>
			<view class="row"><text>合格数量</text><text>{{ detail.pass }}</text></view>
			<view class="row"><text>不合格数量</text><text>{{ detail.fail }}</text></view>
			<view class="row"><text>检验人</text><text>{{ detail.inspector }}</text></view>
			<view class="row"><text>检验时间</text><text>{{ detail.time }}</text></view>
		</view>
		<view class="remark card"><text>备注</text><text>{{ detail.remark }}</text></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			detail: {
				code: '',
				materialCode: 'WLBH00001',
				materialName: '内存条',
				method: '全检',
				qty: 1000,
				pass: 995,
				fail: 5,
				inspector: '刘超',
				time: '2025.04.24 14:00:00',
				remark: '不合格数量较多'
			}
		}
	},
	onLoad(options) {
		if (options && options.code) {
			this.detail.code = decodeURIComponent(options.code)
		}
	}
}
</script>

<style>
.page { padding: 24rpx; background:#f7f6fb; min-height:100vh; }
.card { background:#fff; padding:18rpx; border-radius:12rpx; box-shadow:0 6rpx 14rpx rgba(0,0,0,0.03); margin-bottom:14rpx; }
.row { display:flex; justify-content:space-between; padding:12rpx 0; border-bottom:1rpx solid #f0f0f0; color:#333; }
.remark { padding:16rpx; }
</style>

