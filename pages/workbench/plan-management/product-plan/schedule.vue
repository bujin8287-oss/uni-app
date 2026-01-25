<template>
	<view class="page">

		<view class="section">
			<text class="section-title">生产排程</text>
			<view class="card">
				<view class="row">
					<text class="label">排产数量</text>
					<input class="input" v-model="form.qty" placeholder="请输入排产数量" type="number" />
				</view>
				<view class="row" @click="choose('workshop')">
					<text class="label">生产车间</text>
					<text class="value">{{ form.workshop || '请选择' }} ›</text>
				</view>
				<view class="row" @click="choose('line')">
					<text class="label">生产产线</text>
					<text class="value">{{ form.line || '请选择' }} ›</text>
				</view>
				<view class="row" @click="choose('route')">
					<text class="label">工艺路线</text>
					<text class="value">{{ form.route || '请选择' }} ›</text>
				</view>
				<view class="row" @click="chooseDate">
					<text class="label">开始日期</text>
					<text class="value">{{ form.startDate || '请选择' }} ›</text>
				</view>
			</view>
		</view>

		<view class="section">
			<text class="section-title">齐套分析</text>
			<view class="kit-card" v-for="(m, idx) in materials" :key="idx">
				<view class="kit-head">
					<text class="kit-status">满足</text>
					<text class="kit-name">{{ m.name }}</text>
				</view>
				<view class="kit-body">
					<text class="kit-meta">库存数量 {{ m.stock }}</text>
					<text class="kit-meta">本次用量 {{ m.use }}</text>
					<view class="kit-actions">
						<button class="btn small">锁料</button>
						<button class="btn small">领料</button>
						<button class="btn small">申购</button>
					</view>
				</view>
			</view>
		</view>

		<view class="footer">
			<view class="btn-submit" @click="onSubmit">提交</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api'
import { onLoad as uniOnLoad } from '@dcloudio/uni-app'

const form = ref({
	qty: '',
	workshop: '',
	line: '',
	route: '',
	startDate: '',
	code: '',
})

const materials = ref([
	{ name: '电池', stock: 1000, use: 500 },
	{ name: '屏幕', stock: 1000, use: 500 },
	{ name: '充电器', stock: 1000, use: 500 },
	{ name: '硬盘', stock: 1000, use: 500 },
])

uniOnLoad(async (options) => {
	const code = decodeURIComponent(options?.code || options?.query?.code || '')
	if (!code) return
	form.value.code = code
	try {
		const res = await api.getProductPlanDetail({ code })
		if (res && res.code === 0 && res.data) {
			// prefill qty and other fields when possible
			form.value.qty = res.data.quantity || res.data.totalQuantity || form.value.qty
		}
	} catch (e) {
		console.error('load plan for schedule', e)
	}
})

function choose(type) {
	if (type === 'workshop') {
		uni.navigateTo({ url: '/pages/workbench/plan-management/product-plan/workshop' })
		return
	}
	if (type === 'line') {
		uni.navigateTo({ url: '/pages/workbench/plan-management/product-plan/line' })
		return
	}
	if (type === 'route') {
		uni.navigateTo({ url: '/pages/workbench/plan-management/product-plan/route' })
		return
	}
	uni.showToast({ title: `选择 ${type}（模拟）`, icon: 'none' })
}

import { onShow as uniOnShow } from '@dcloudio/uni-app'

uniOnShow(() => {
	const ws = uni.getStorageSync('product_plan_selected_workshop') || null
	const ln = uni.getStorageSync('product_plan_selected_line') || null
	const rt = uni.getStorageSync('product_plan_selected_route') || null
	if (ws) form.value.workshop = ws.name || ''
	if (ln) form.value.line = ln.name || ''
	if (rt) form.value.route = rt.name || ''
})

function chooseDate() {
	uni.showDatePicker
	uni.showToast({ title: '选择日期（模拟）', icon: 'none' })
}

function onSubmit() {
	uni.showToast({ title: '排程提交（模拟）', icon: 'none' })
	// after submit navigate back to detail
	setTimeout(() => {
		uni.navigateBack()
	}, 600)
}
</script>

<style scoped>
.page {
	padding: 20rpx;
	background: #f7f6fb;
	min-height: 100vh;
	padding-bottom: 120rpx;
}
.header {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 14rpx;
}

.section-title {
	font-size: 28rpx;
	font-weight: 700;
	margin: 10rpx 0;
}
.card {
	background: #fff;
	border-radius: 12rpx;
	padding: 12rpx;
	box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.04);
	margin-bottom: 16rpx;
}
.row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 14rpx 8rpx;
	border-bottom: 1rpx solid #f1f1f6;
}
.label {
	color: #9b9b9b;
}
.value {
	color: #333;
}
.input {
	width: 360rpx;
	text-align: right;
}
.kit-card {
	background: #fff;
	border-radius: 12rpx;
	padding: 12rpx;
	margin-bottom: 12rpx;
	box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.04);
}
.kit-head {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 8rpx;
}
.kit-status {
	background: #eafaf3;
	color: #1fbfa1;
	padding: 6rpx 10rpx;
	border-radius: 8rpx;
	font-size: 22rpx;
}
.kit-name {
	font-size: 26rpx;
	font-weight: 700;
}
.kit-body {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.kit-meta {
	color: #9b9b9b;
}
.kit-actions {
	display: flex;
	gap: 10rpx;
}
.btn {
	border: 1rpx solid #ddd;
	background: #fff;
	padding: 6rpx 12rpx;
	border-radius: 12rpx;
}
.small {
	font-size: 22rpx;
}
.footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 24rpx;
	display: flex;
	justify-content: center;
}
.btn-submit {
	width: calc(100% - 48rpx);
	max-width: 720rpx;
	background: linear-gradient(90deg,#7b6bff,#a48bff);
	color: #fff;
	padding: 20rpx 0;
	border-radius: 40rpx;
	text-align: center;
	font-size: 28rpx;
}
</style>

