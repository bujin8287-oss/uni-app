<template>
	<view class="detail-page">
		<view class="card">
			<view class="row"><text class="label">工单编号</text><text class="value">{{ detail.code }}</text></view>
			<view class="row"><text class="label">工单名称</text><text class="value">{{ detail.orderName }}</text></view>
			<view class="row"><text class="label">紧急程度</text><text class="value">{{ detail.urgency }}</text></view>
			<view class="row"><text class="label">产品编号</text><text class="value">{{ detail.productCode }}</text></view>
			<view class="row"><text class="label">产品名称</text><text class="value">{{ detail.productName }}</text></view>
			<view class="row"><text class="label">生产数量</text><text class="value">{{ detail.quantity }}</text></view>
			<view class="row"><text class="label">已生产</text><text class="value">{{ detail.produced }}</text></view>
			<view class="row"><text class="label">单位</text><text class="value">{{ detail.unit }}</text></view>
			<view class="row"><text class="label">批次号</text><text class="value">{{ detail.batchNo }}</text></view>
			<view class="row"><text class="label">开工日期</text><text class="value">{{ detail.startDate }}</text></view>
			<view class="row"><text class="label">结束日期</text><text class="value">{{ detail.endDate }}</text></view>
			<view class="row"><text class="label">销售订单</text><text class="value">{{ detail.salesOrder }}</text></view>
			<view class="row"><text class="label">客户名称</text><text class="value">{{ detail.customerName }}</text></view>
			<view class="row"><text class="label">创建人</text><text class="value">{{ detail.creator }}</text></view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api'
import { onLoad as uniOnLoad } from '@dcloudio/uni-app'

const detail = ref({})

uniOnLoad(async (options) => {
	const code = decodeURIComponent(options?.code || options?.query?.code || '')
	if (!code) return
	try {
		const res = await api.getProductOrderDetail({ code })
		if (res && res.code === 0) {
			detail.value = res.data
		}
	} catch (e) {
		console.error('getProductOrderDetail error', e)
	}
})
</script>

<style scoped>
.detail-page { padding: 20rpx; background: #f7f6fb; min-height: 100vh; padding-bottom: 120rpx; }
.card { background: #fff; border-radius: 12rpx; padding: 16rpx; margin-bottom: 14rpx; box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.04); }
.row { display:flex; justify-content: space-between; padding: 12rpx 0; border-bottom: 1rpx solid #f1f1f6; align-items:center; }
.label { color: #9b9b9b; font-size: 22rpx; }
.value { color:#333; font-size:22rpx; }
</style>

