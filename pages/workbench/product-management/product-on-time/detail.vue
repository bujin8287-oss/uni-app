<template>
	<view class="page">
		<view class="card">
			<view class="row"><text class="label">生产计划编号</text><text class="value">{{ detail.planNo }}</text></view>
			<view class="row"><text class="label">工单编号</text><text class="value">{{ detail.workOrderNo }}</text></view>
			<view class="row"><text class="label">工单名称</text><text class="value">{{ detail.workOrderName }}</text></view>
			<view class="row"><text class="label">产品编号</text><text class="value">{{ detail.productNo }}</text></view>
			<view class="row"><text class="label">产品名称</text><text class="value">{{ detail.productName }}</text></view>
			<view class="row"><text class="label">规格型号</text><text class="value">{{ detail.spec }}</text></view>
			<view class="row"><text class="label">单位</text><text class="value">{{ detail.unit }}</text></view>
			<view class="row"><text class="label">计划数量</text><text class="value">{{ detail.planQty }}</text></view>
			<view class="row"><text class="label">准时完工数量</text><text class="value">{{ detail.onTimeFinishQty }}</text></view>
			<view class="row"><text class="label">准时率</text><text class="value">{{ detail.onTimeRate }}%</text></view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const detail = ref({
	planNo: 'SCJHBH00001',
	workOrderNo: 'GDBH00001',
	workOrderName: '外贸—生产工单',
	productNo: 'CPBH00001',
	productName: '笔记本电脑',
	spec: '300*400mm',
	unit: '台',
	planQty: 1000,
	onTimeFinishQty: 951,
	onTimeRate: 95.1
})

onMounted(() => {
	// 可以根据传入 id 请求详情，这里用静态数据作示例
})
</script>

<style>
.page { padding:24rpx; background:#f7f6fb; min-height:100vh; }
.card { background:#fff; padding:20rpx; border-radius:12rpx; box-shadow:0 6rpx 16rpx rgba(0,0,0,0.03); }
.row { display:flex; justify-content:space-between; padding:12rpx 0; border-bottom:1rpx solid #f0f0f0; align-items:center; }
.label { color:#9b9b9b; font-size:24rpx; }
.value { color:#2b2b2b; font-size:24rpx; }
</style>

