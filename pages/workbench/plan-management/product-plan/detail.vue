<template>
	<view class="detail-page">
		<view class="card">
			<view class="row"><text class="label">计划编号</text><text class="value">{{ detail.code }}</text></view>
			<view class="row"><text class="label">客户名称</text><text class="value">{{ detail.customerName }}</text></view>
			<view class="row"><text class="label">产品编号</text><text class="value">{{ detail.productCode }}</text></view>
			<view class="row"><text class="label">产品名称</text><text class="value">{{ detail.productName }}</text></view>
			<view class="row"><text class="label">交货日期</text><text class="value">{{ detail.deliveryDate }}</text></view>
			<view class="row"><text class="label">生产数量</text><text class="value">{{ detail.quantity }}</text></view>
			<view class="row"><text class="label">单位</text><text class="value">{{ detail.unit }}</text></view>
			<view class="row"><text class="label">紧急程度</text><text class="value">{{ detail.urgency }}</text></view>
			<view class="row"><text class="label">创建时间</text><text class="value">{{ detail.createTime }}</text></view>
			<view class="row"><text class="label">创建人</text><text class="value">{{ detail.creator }}</text></view>
		</view>

		<view class="bottom-area">
			<view class="btn-schedule" @click="onSchedule">排程</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api'
import { onLoad as uniOnLoad } from '@dcloudio/uni-app'

const detail = ref({
	code: '',
	customerName: '',
	productCode: '',
	productName: '',
	deliveryDate: '',
	quantity: '',
	unit: '',
	urgency: '',
	createTime: '',
	creator: '',
})

uniOnLoad(async (options) => {
	const code = decodeURIComponent(options?.code || options?.query?.code || '')
	if (!code) return
	try {
		// call product plan detail API
		const res = await api.getProductPlanDetail({ code })
		if (res && res.code === 0 && res.data) {
			// map fields and provide defaults for missing fields
			detail.value = {
				code: res.data.code || code,
				customerName: res.data.customerName || res.data.customer || '',
				productCode: res.data.productCode || res.data.productCode || '',
				productName: res.data.productName || res.data.productName || '',
				deliveryDate: res.data.deliveryDate || '',
				quantity: res.data.quantity || res.data.totalQuantity || '',
				unit: res.data.unit || '台',
				urgency: res.data.urgency || '普通',
				createTime: res.data.createTime || '2025.03.12 10:00',
				creator: res.data.creator || '系统',
			}
		}
	} catch (e) {
		console.error('getPlanDetail error', e)
	}
})

function onSchedule() {
	const code = detail.value?.code || ''
	if (!code) {
		uni.showToast({ title: '缺少计划编号', icon: 'none' })
		return
	}
	uni.navigateTo({ url: `/pages/workbench/plan-management/product-plan/schedule?code=${encodeURIComponent(code)}` })
}
</script>

<style scoped>
.detail-page {
	padding: 20rpx;
	background: #f7f6fb;
	min-height: 100vh;
	padding-bottom: 140rpx;
}
.card {
	background: #fff;
	border-radius: 12rpx;
	padding: 16rpx;
	margin-bottom: 14rpx;
	box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
}
.row {
	display: flex;
	justify-content: space-between;
	padding: 12rpx 0;
	border-bottom: 1rpx solid #f1f1f6;
	align-items: center;
}
.label {
	color: #9b9b9b;
	font-size: 22rpx;
}
.value {
	color: #333;
	font-size: 22rpx;
}
.bottom-area {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 30rpx;
	display: flex;
	justify-content: center;
}
.btn-schedule {
	width: calc(100% - 48rpx);
	max-width: 720rpx;
	background: linear-gradient(90deg,#7b6bff,#a48bff);
	color: #fff;
	padding: 22rpx 0;
	border-radius: 40rpx;
	text-align: center;
	font-size: 28rpx;
	box-shadow: 0 8rpx 20rpx rgba(123,107,255,0.18);
}
</style>

