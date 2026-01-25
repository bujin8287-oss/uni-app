<template>
	<view class="page">
		<view class="header">
			<text class="title">生产计划</text>
			<text class="action" @click="onAdd">新增</text>
		</view>

		<view class="list">
			<view class="card" v-for="plan in plans" :key="plan.code" @click="openDetail(plan)">
				<view class="card-left">
					<view class="badge">普通</view>
					<text class="code">{{ plan.code }}</text>
					<view class="meta">
						<view class="meta-row"><text class="label">产品名称</text><text class="value">{{ plan.product }}</text></view>
						<view class="meta-row"><text class="label">计划生产</text><text class="value">{{ plan.qty }}</text></view>
						<view class="meta-row"><text class="label">生产日期</text><text class="value">{{ plan.date }}</text></view>
					</view>
				</view>
				<view class="card-right">
					<text :class="['status', plan.status === '进行中' ? 'running' : 'notstart']">{{ plan.status }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api'
import { onLoad as uniOnLoad } from '@dcloudio/uni-app'

const plans = ref([])
const page = ref(1)
const pageSize = ref(10)

async function loadPlans(p = 1) {
	try {
		const res = await api.getProductPlans({ page: p, pageSize: pageSize.value })
		if (res && res.code === 0 && res.data) {
			plans.value = res.data.items || []
		}
	} catch (e) {
		console.error('getProductPlans error', e)
	}
}

uniOnLoad(() => {
	loadPlans(1)
})

function openDetail(plan) {
	uni.navigateTo({ url: `/pages/workbench/plan-management/product-plan/detail?code=${encodeURIComponent(plan.code)}` })
}

function onAdd() {
	uni.navigateTo({ url: '/pages/workbench/plan-management/product-plan/add' })
}
</script>

<style scoped>
.page {
	padding: 24rpx;
	background: #f7f6fb;
	min-height: 100vh;
}
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 18rpx;
}
.title {
	font-size: 34rpx;
	font-weight: 700;
}
.action {
	color: #5b4bff;
	font-size: 28rpx;
}
.list {
	display: flex;
	flex-direction: column;
	gap: 18rpx;
}
.card {
	background: #fff;
	padding: 20rpx;
	border-radius: 12rpx;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.04);
}
.card-left {
	flex: 1;
}
.badge {
	display: inline-block;
	background: #eaf0ff;
	color: #5b7cff;
	padding: 6rpx 12rpx;
	border-radius: 10rpx;
	font-size: 22rpx;
	margin-bottom: 8rpx;
}
.code {
	display: block;
	font-size: 30rpx;
	font-weight: 700;
	margin: 6rpx 0 12rpx 0;
}
.meta {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	color: #666;
	font-size: 24rpx;
}
.meta-row {
	display: flex;
	gap: 12rpx;
	align-items: center;
}
.label {
	width: 120rpx;
	color: #9b9b9b;
}
.value {
	color: #333;
}
.card-right {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 140rpx;
}
.status {
	padding: 8rpx 14rpx;
	border-radius: 14rpx;
	font-size: 24rpx;
}
.status.running {
	background: #e9fff6;
	color: #1fbfa1;
	border: 1rpx solid #c8f1e7;
}
.status.notstart {
	background: #f2f4ff;
	color: #6b6fcf;
	border: 1rpx solid #e6e7ff;
}
</style>