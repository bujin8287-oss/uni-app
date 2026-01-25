<template>
	<view class="page">
		<view class="card">
			<view class="row"><text class="label">生产计划编号</text><text class="value">{{planNo}}</text></view>
			<view class="row"><text class="label">工单编号</text><text class="value">GDBH00001</text></view>
			<view class="row"><text class="label">工单名称</text><text class="value">外贸一生产工单</text></view>
			<view class="row"><text class="label">产品编号</text><text class="value">CPBH00001</text></view>
			<view class="row"><text class="label">产品名称</text><text class="value">笔记本电脑</text></view>
			<view class="row"><text class="label">规格型号</text><text class="value">300*400mm</text></view>
			<view class="row"><text class="label">单位</text><text class="value">台</text></view>
			<view class="row"><text class="label">计划数量</text><text class="value">1000</text></view>
			<view class="row"><text class="label">完工数量</text><text class="value">990</text></view>
			<view class="row"><text class="label">达成率</text><text class="value">99%</text></view>
		</view>
	</view>
</template>

<script>
import { ref } from 'vue'

export default {
	data() {
		return {
			planNo: ''
		}
	},
	onLoad(options) {
		this.planNo = (options && options.planNo) || ''
	}
}
</script>

<style>
.page { padding:24rpx; background:#f7f8fb; min-height:100vh; }
.card { background:#fff; padding:20rpx; border-radius:12rpx; box-shadow:0 6rpx 16rpx rgba(0,0,0,0.03); }
.row { display:flex; justify-content:space-between; padding:12rpx 0; border-bottom:1rpx solid #f1f1f1; align-items:center; }
.label { color:#999; width:40%; }
.value { color:#333; width:60%; text-align:right; }
</style>

