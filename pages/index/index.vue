<template>
	<view class="page">
		<!-- Header -->
		<view class="header">
			<view class="header-left">
				<image class="avatar" src="/static/logo.png" mode="aspectFill"></image>
				<view class="user-info">
					<text class="greet">你好，{{ userName }}</text>
					<text class="sub">欢迎使用生产制造执行平台</text>
				</view>
			</view>
			<view class="header-right">
				<view class="search-box">
					<text class="search-placeholder">请输入需要查找的内容</text>
				</view>
				<view class="icon notify">🔔</view>
			</view>
		</view>

		<!-- Tabs -->
		<view class="tabs">
			<view :class="['tab', activeTab === 'yesterday' ? 'active' : '']" @click="activeTab = 'yesterday'">昨日</view>
			<view :class="['tab', activeTab === 'week' ? 'active' : '']" @click="activeTab = 'week'">本周</view>
			<view :class="['tab', activeTab === 'month' ? 'active' : '']" @click="activeTab = 'month'">本月</view>
		</view>

		<!-- Top statistics area -->
		<view class="top-area">
			<view class="main-card">
				<text class="card-title">昨日生产数量</text>
				<text class="card-number">{{ stats.yesterdayProduction }}</text>
				<view class="card-sub">
					<view class="sub-item">
						<text class="sub-label">达成率</text>
						<text class="sub-value">{{ stats.reachRate }}</text>
					</view>
					<view class="sub-item">
						<text class="sub-label">合格率</text>
						<text class="sub-value">{{ stats.passRate }}</text>
					</view>
					<view class="sub-item">
						<text class="sub-label">返工数</text>
						<text class="sub-value">{{ stats.reworkCount }}</text>
					</view>
				</view>
			</view>
			<view class="side-cards">
				<view class="small-card">
					<text class="small-num">{{ stats.yesterdayOrders }}</text>
					<text class="small-label">昨日订单数</text>
				</view>
				<view class="small-card">
					<text class="small-num">{{ stats.yesterdayOutbound }}</text>
					<text class="small-label">昨日出库数</text>
				</view>
			</view>
		</view>

		<!-- Feature grid -->
		<view class="feature-grid">
			<view class="grid-item" v-for="(item, index) in features" :key="index" @click="openFeature(item)">
				<view class="icon-box">{{ item.icon }}</view>
				<text class="icon-text">{{ item.name }}</text>
			</view>
		</view>

		<!-- Work order statistics -->
		<view class="workorder-area">
			<view class="donut-card">
				<view class="donut">
					<view class="donut-center">
						<text class="donut-number">{{ workOrders.total }}</text>
						<text class="donut-label">全部工单</text>
					</view>
				</view>
			</view>
			<view class="legend">
				<view class="legend-item" v-for="(item, idx) in workOrders.legend" :key="idx">
					<view :style="{backgroundColor: item.color}" class="legend-dot"></view>
					<text class="legend-text">{{ item.name }} {{ item.count }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import api from '@/api'

const userName = ref('刘明湘')
const activeTab = ref('yesterday')
const loading = ref(true)

const stats = reactive({
	yesterdayProduction: 0,
	reachRate: '0%',
	passRate: '0%',
	reworkCount: 0,
	yesterdayOrders: 0,
	yesterdayOutbound: 0,
})

const features = reactive([
	{ name: '销售订单', icon: '🧾' },
	{ name: '生产报工', icon: '📋' },
	{ name: '来料检验', icon: '🔬' },
	{ name: '过程检验', icon: '📦' },
	{ name: '最终检验', icon: '✅' },
	{ name: '设备维修', icon: '🛠️' },
	{ name: '领用归还', icon: '📥' },
	{ name: '更多', icon: '+' },
	{ name: '', icon: '' },
])

function openFeature(item) {
	if (!item || !item.name) return
	const url = `/pages/feature/index?name=${encodeURIComponent(item.name)}`
	uni.navigateTo({ url })
}

const workOrders = reactive({
	total: 198,
	legend: [
		{ name: '已完成', count: 129, color: '#6EE7B7' },
		{ name: '未排产', count: 25, color: '#F6C85F' },
		{ name: '未生产', count: 22, color: '#6CC0FF' },
		{ name: '未完成', count: 12, color: '#FF9AA2' },
	],
})

onMounted(async () => {
	loading.value = true
	try {
		const res = await api.getHomeStats()
		if (res && res.code === 0 && res.data) {
			Object.assign(stats, res.data)
		}
	} catch (e) {
		console.error('getHomeStats error', e)
	} finally {
		loading.value = false
	}
})
</script>

<style>
.page {
	padding: 30rpx;
	background: #f7f6fb;
	min-height: 100vh;
}

/* Header */
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}
.header-left {
	display: flex;
	align-items: center;
}
.avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 40rpx;
	margin-right: 20rpx;
}
.user-info .greet {
	font-size: 30rpx;
	color: #333;
	font-weight: 600;
}
.user-info .sub {
	font-size: 24rpx;
	color: #9b9b9b;
	margin-top: 6rpx;
}
.header-right {
	display: flex;
	align-items: center;
	gap: 20rpx;
}
.search-box {
	background: #fff;
	padding: 18rpx 24rpx;
	border-radius: 20rpx;
	min-width: 440rpx;
}
.search-placeholder {
	color: #bdbbdc;
	font-size: 24rpx;
}
.icon.notify {
	font-size: 32rpx;
}

/* Tabs */
.tabs {
	display: flex;
	gap: 30rpx;
	margin-bottom: 20rpx;
}
.tab {
	font-size: 28rpx;
	color: #9b9b9b;
	padding-bottom: 10rpx;
}
.tab.active {
	color: #5b4bff;
	border-bottom: 4rpx solid #5b4bff;
}

/* Top area */
.top-area {
	display: flex;
	gap: 20rpx;
	margin-bottom: 24rpx;
}
.main-card {
	flex: 1;
	background: linear-gradient(135deg,#6a5bff,#8b6cff);
	color: #fff;
	padding: 30rpx;
	border-radius: 20rpx;
	box-shadow: 0 8rpx 20rpx rgba(107,84,255,0.12);
}
.card-title {
	font-size: 26rpx;
	opacity: 0.9;
}
.card-number {
	font-size: 56rpx;
	font-weight: 700;
	margin: 10rpx 0 20rpx 0;
}
.card-sub {
	display: flex;
	justify-content: space-between;
}
.sub-item {
	display: flex;
	flex-direction: column;
}
.sub-label {
	font-size: 22rpx;
	opacity: 0.85;
}
.sub-value {
	font-size: 26rpx;
	font-weight: 600;
}
.side-cards {
	width: 260rpx;
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}
.small-card {
	background: #fff;
	border-radius: 12rpx;
	padding: 20rpx;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.04);
}
.small-num {
	font-size: 34rpx;
	font-weight: 700;
	color: #333;
}
.small-label {
	font-size: 22rpx;
	color: #9b9b9b;
	margin-top: 6rpx;
}

/* Feature grid */
.feature-grid {
	margin-top: 10rpx;
	background: #fff;
	border-radius: 14rpx;
	padding: 24rpx;
	display: flex;
	flex-wrap: wrap;
	gap: 18rpx;
}
.grid-item {
	width: calc((100% - 72rpx) / 4);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.icon-box {
	width: 96rpx;
	height: 96rpx;
	border-radius: 18rpx;
	background: linear-gradient(180deg,#f5f6ff,#fff);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	margin-bottom: 12rpx;
}
.icon-text {
	font-size: 24rpx;
	color: #333;
}

/* Workorder area */
.workorder-area {
	margin-top: 24rpx;
	background: #fff;
	padding: 24rpx;
	border-radius: 14rpx;
	display: flex;
	gap: 20rpx;
	align-items: center;
}
.donut-card {
	width: 280rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}
.donut {
	width: 180rpx;
	height: 180rpx;
	border-radius: 90rpx;
	background: conic-gradient(#6EE7B7 0deg 220deg, #F6C85F 220deg 270deg, #6CC0FF 270deg 320deg, #FF9AA2 320deg 360deg);
	display: flex;
	justify-content: center;
	align-items: center;
}
.donut-center {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	background: #fff;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.donut-number {
	font-size: 34rpx;
	font-weight: 700;
}
.donut-label {
	font-size: 20rpx;
	color: #9b9b9b;
	margin-top: 6rpx;
}
.legend {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}
.legend-item {
	display: flex;
	align-items: center;
	gap: 12rpx;
}
.legend-dot {
	width: 18rpx;
	height: 18rpx;
	border-radius: 4rpx;
}
.legend-text {
	font-size: 24rpx;
}

</style>
