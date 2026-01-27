<template>
	<view class="page">
		<!-- Header -->
		<view class="header">
			<!-- top row: avatar + greeting on left, actions on right -->
			<view class="header-top">
				<view class="header-left">
					<image class="avatar" src="/static/logo.png" mode="aspectFill"></image>
					<view class="user-info">
						<text class="greet">你好，{{ userName }}</text>
						<text class="sub">欢迎使用生产制造执行平台</text>
					</view>
				</view>
				<view class="header-actions">
					<view class="icon action">⛶</view>
					<view class="icon notify">🔔</view>
				</view>
			</view>
			<!-- search row: full width below -->
			<view class="search-row">
				<view class="search-box">
					<text class="search-placeholder">请输入需要查找的内容</text>
				</view>
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

		<!-- 产品统计（独立模块） -->
		<view class="stats-area" style="margin-top:18rpx;">
			<view class="stats-card" style="display:flex;align-items:center;gap:14rpx;">
				<text class="card-title" style="flex-basis:100%;">产品统计</text>
			</view>
			<view style="margin-top:12rpx;display:flex;align-items:center;gap:14rpx;flex-wrap:wrap;">
				<view style="width:120rpx;height:120rpx;border-radius:60rpx;background:conic-gradient(#6CC0FF 0deg 120deg,#A58CFF 120deg 220deg,#23D3A6 220deg 300deg,#9B4CFF 300deg 360deg);display:flex;align-items:center;justify-content:center;">
					<view style="width:80rpx;height:80rpx;border-radius:40rpx;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;">
						<text style="font-size:32rpx;font-weight:700;">{{ productsStats.total }}</text>
						<text style="font-size:20rpx;color:#9b9b9b;margin-top:6rpx;">产品总数</text>
					</view>
				</view>
				<view style="flex:1;min-width:200rpx;">
					<view v-for="(p, idx) in productsStats.items" :key="idx" style="display:flex;align-items:center;gap:10rpx;margin-bottom:10rpx;">
						<view :style="{backgroundColor: p.color, width:'12rpx', height:'12rpx', borderRadius:'6rpx'}"></view>
						<text style="font-size:22rpx;color:#333;">{{ p.name }}</text>
						<text style="margin-left:auto;color:#9b9b9b;">{{ p.count }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 缺陷统计（独立模块） -->
		<view class="stats-area" style="margin-top:18rpx;">
			<view class="stats-card" style="display:flex;align-items:center;gap:14rpx;">
				<text class="card-title" style="flex-basis:100%;">缺陷统计</text>
			</view>
			<view style="margin-top:12rpx;display:flex;align-items:center;gap:14rpx;flex-wrap:wrap;">
				<view style="width:120rpx;height:120rpx;border-radius:60rpx;background:conic-gradient(#0B4C7A 0deg 160deg,#9B9BBF 160deg 240deg,#3A1A3A 240deg 300deg,#3E8A6B 300deg 360deg);display:flex;align-items:center;justify-content:center;">
					<view style="width:80rpx;height:80rpx;border-radius:40rpx;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;">
						<text style="font-size:28rpx;font-weight:700;">{{ defectsStats.total }}</text>
						<text style="font-size:18rpx;color:#9b9b9b;margin-top:6rpx;">缺陷总数</text>
					</view>
				</view>
				<view style="flex:1;min-width:200rpx;">
					<view v-for="(d, idx) in defectsStats.items" :key="idx" style="display:flex;align-items:center;gap:10rpx;margin-bottom:10rpx;">
						<view :style="{backgroundColor: d.color, width:'12rpx', height:'12rpx', borderRadius:'6rpx'}"></view>
						<text style="font-size:22rpx;color:#333;">{{ d.name }}</text>
						<text style="margin-left:auto;color:#9b9b9b;">{{ d.count }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 产出统计图与进度列表（独立模块） -->
		<view class="stats-area" style="margin-top:18rpx;">
			<view class="chart-card">
				<text class="card-title">工单产出统计</text>
				<view class="chart-placeholder">折线图占位（产出数 / 完成率）</view>
				<view class="progress-list">
					<view class="progress-item" v-for="(it, i) in workOrderProgressList" :key="i">
						<view class="progress-left">
							<text class="progress-order">{{ it.order }}</text>
							<text class="progress-sub">{{ it.name }}　数量 {{ it.qty }}</text>
							<view class="progress-bar" :style="{ width: (parseFloat(it.progress) / 100 * 100) + '%' }"></view>
						</view>
						<text style="font-size:22rpx;color:#666;">{{ it.progress }}</text>
					</view>
				</view>
			</view>
		</view>
		<BottomNav />
	</view>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import api from '@/api'
import BottomNav from '@/components/business/BottomNav.vue'

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

const AVAILABLE_FEATURES = [
	// 计划管理
	{ name: '销售订单', icon: '🧾' },
	{ name: '生产计划', icon: '⚙️' },
	// 生产管理
	{ name: '生产工单', icon: '📋' },
	{ name: '生产报工', icon: '📝' },
	{ name: '报工记录', icon: '📄' },
	{ name: '生产达成', icon: '🎯' },
	{ name: '生产准时', icon: '⏱️' },
	// 质量管理
	{ name: '来料检验', icon: '🔬' },
	{ name: '过程检验', icon: '📦' },
	{ name: '最终检验', icon: '✅' },
	{ name: '追溯管理', icon: '🔁' },
	// 设备管理
	{ name: '设备档案', icon: '📇' },
	{ name: '设备报废', icon: '🗑️' },
	{ name: '设备维修', icon: '🛠️' },
	// 仓库管理
	{ name: '采购入库', icon: '📥' },
	{ name: '生产领料', icon: '📦' },
	{ name: '生产退料', icon: '↩️' },
	{ name: '产品出库', icon: '📤' },
	// 其他
	{ name: '领用归还', icon: '📥' },
]

const STORAGE_KEY = 'home_shortcuts'

const features = reactive([])

function loadHomeShortcuts() {
	features.length = 0
	try {
		const raw = uni.getStorageSync(STORAGE_KEY)
		let selected = []
		if (raw) {
			selected = typeof raw === 'string' ? JSON.parse(raw) : raw
		}
		if (Array.isArray(selected) && selected.length > 0) {
			// map selected names to available feature definitions
			selected.forEach((name) => {
				const found = AVAILABLE_FEATURES.find(f => f.name === name)
				if (found) features.push(found)
			})
		} else {
			// default: show first 8 features (or available list)
			AVAILABLE_FEATURES.slice(0, 8).forEach(f => features.push(f))
		}
	} catch (e) {
		console.warn('load home shortcuts error', e)
		AVAILABLE_FEATURES.slice(0, 8).forEach(f => features.push(f))
	}
	// always ensure "更多" entry at end
	features.push({ name: '更多', icon: '+' })
}

function openFeature(item) {
	if (!item || !item.name) return

	// 销售订单跳转到销售订单页面
	if (item.name === '销售订单') {
		uni.navigateTo({ url: '/pages/workbench/plan-management/sales-order/index' })
		return
	}
	// 生产计划跳转到生产计划页面
	if (item.name === '生产计划') {
		uni.navigateTo({ url: '/pages/workbench/plan-management/product-plan/index' })
		return
	}
	// 生产报工跳转到生产报工页面
	if (item.name === '生产报工') {
		uni.navigateTo({ url: '/pages/workbench/product-management/product-record-sub/index' })
		return
	}
	// 生产工单跳转到生产工单页面
	if (item.name === '生产工单') {
		uni.navigateTo({ url: '/pages/workbench/product-management/product-order/index' })
		return
	}
	// 报工记录跳转到报工记录页面
	if (item.name === '报工记录') {
		uni.navigateTo({ url: '/pages/workbench/product-management/work-record/index' })
		return
	}
	// 生产达成跳转到生产达成页面
	if (item.name === '生产达成') {
		uni.navigateTo({ url: '/pages/workbench/product-management/product-complete/index' })
		return
	}
	// 生产准时跳转到生产准时页面
	if (item.name === '生产准时') {
		uni.navigateTo({ url: '/pages/workbench/product-management/product-on-time/index' })
		return
	}
	// 来料检验跳转到来料检验页面
	if (item.name === '来料检验') {
		uni.navigateTo({ url: '/pages/workbench/quality-control/incoming-inspection/index' })
		return
	}
	// 过程检验跳转到过程检验页面
	if (item.name === '过程检验') {
		uni.navigateTo({ url: '/pages/workbench/quality-control/process-inspection/index' })
		return
	}
	// 最终检验跳转到最终检验页面
	if (item.name === '最终检验') {
		uni.navigateTo({ url: '/pages/workbench/quality-control/final-inspection/index' })
		return
	}
	// 设备维修跳转到设备维修页面
	if (item.name === '设备维修') {
		uni.navigateTo({ url: '/pages/workbench/device-repair/index' })
		return
	}
	// 追溯管理跳转到追溯管理页面
	if (item.name === '追溯管理') {
		uni.navigateTo({ url: '/pages/workbench/quality-control/trace-management/index' })
		return
	}
	// 设备档案跳转到档案页面
	if (item.name === '设备档案') {
		uni.navigateTo({ url: '/pages/workbench/archive/index' })
		return
	}
	// 设备报废跳转到报废页面
	if (item.name === '设备报废') {
		uni.navigateTo({ url: '/pages/workbench/device-scrap/index' })
		return
	}
	// 仓库功能跳转（采购入库/生产领料/生产退料/产品出库）
	if (item.name === '采购入库') {
		uni.navigateTo({ url: '/pages/workbench/warehouse/placeholder' })
		return
	}
	if (item.name === '生产领料') {
		uni.navigateTo({ url: '/pages/workbench/warehouse/placeholder' })
		return
	}
	if (item.name === '生产退料') {
		uni.navigateTo({ url: '/pages/workbench/warehouse/placeholder' })
		return
	}
	if (item.name === '产品出库') {
		uni.navigateTo({ url: '/pages/workbench/warehouse/placeholder' })
		return
	}

	// 其他功能跳转到通用功能页
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
// 页面占位数据（后续可由接口填充）
const productsStats = reactive({
	total: 6543,
	items: [
		{ name: 'AA产品', count: 2229, color: '#6CC0FF' },
		{ name: 'BB产品', count: 2588, color: '#A58CFF' },
		{ name: 'CC产品', count: 798, color: '#23D3A6' },
		{ name: 'DD产品', count: 1081, color: '#9B4CFF' },
	],
})

const defectsStats = reactive({
	total: 57,
	items: [
		{ name: '外观缺陷', count: 18, color: '#0B4C7A' },
		{ name: '生产瑕疵', count: 19, color: '#9B9BBF' },
		{ name: '破损裂痕', count: 11, color: '#3A1A3A' },
		{ name: '其他缺陷', count: 9, color: '#3E8A6B' },
	],
})

const productionChart = reactive({
	labels: ['4.2','4.3','4.4','4.5','4.6','4.7','4.8','4.9','4.10'],
	values: [120, 95, 140, 110, 130, 180, 125, 135, 160],
	rate: [0.88,0.85,0.9,0.87,0.92,0.95,0.91,0.9,0.94]
})

const workOrderProgressList = reactive([
	{ order: 'SVDD00001', name: '笔记本电脑', qty: 1000, progress: '91.3%' },
	{ order: 'SVDD00002', name: '笔记本电脑', qty: 1000, progress: '86.3%' },
	{ order: 'SVDD00003', name: '笔记本电脑', qty: 1000, progress: '80.2%' },
	{ order: 'SVDD00004', name: '笔记本电脑', qty: 1000, progress: '66.5%' },
	{ order: 'SVDD00005', name: '笔记本电脑', qty: 1000, progress: '52.7%' },
])

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

onShow(() => {
	loadHomeShortcuts()
})

// initial load
loadHomeShortcuts()
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
	flex-direction: column;
	gap: 14rpx;
	margin-bottom: 20rpx;
}
.header-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}
.header-left {
	display: flex;
	align-items: center;
	gap: 18rpx;
}
.avatar {
	width: 88rpx;
	height: 88rpx;
	border-radius: 44rpx;
}
.user-info .greet {
	font-size: 32rpx;
	color: #222;
	font-weight: 700;
}
.user-info .sub {
	font-size: 22rpx;
	color: #9b9b9b;
	margin-top: 4rpx;
}
.header-actions {
	display: flex;
	align-items: center;
	gap: 14rpx;
}
.header-actions .icon {
	font-size: 28rpx;
	color: #555;
}
.header-actions .notify {
	font-size: 30rpx;
}
.search-row {
	width: 100%;
}
.search-box {
	background: #fff;
	padding: 18rpx 22rpx;
	border-radius: 18rpx;
	width: 100%;
	box-shadow: 0 6rpx 18rpx rgba(0,0,0,0.06);
	display: flex;
	align-items: center;
}
.search-placeholder {
	color: #d0cfe8;
	font-size: 24rpx;
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

/* 新增：统计 & 图表区域样式 */
.stats-area {
	margin-top: 24rpx;
	background: #fff;
	padding: 22rpx;
	border-radius: 14rpx;
}
.stats-row {
	display: flex;
	gap: 18rpx;
	align-items: center;
	justify-content: space-between;
}
.stats-card {
	flex: 1;
	min-width: 240rpx;
	background: linear-gradient(180deg,#fff,#fbfbff);
	border-radius: 12rpx;
	padding: 18rpx;
	box-shadow: 0 6rpx 18rpx rgba(0,0,0,0.03);
}
.chart-card {
	margin-top: 18rpx;
	background: #fff;
	border-radius: 12rpx;
	padding: 18rpx;
	box-shadow: 0 6rpx 18rpx rgba(0,0,0,0.03);
}
.chart-placeholder {
	height: 180rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #a9a9c8;
	font-size: 24rpx;
}
.progress-list {
	margin-top: 12rpx;
}
.progress-item {
	padding: 14rpx 10rpx;
	border-bottom: 1rpx solid #f0f0f6;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.progress-left {
	display: flex;
	flex-direction: column;
}
.progress-order {
	font-size: 22rpx;
	color: #333;
	font-weight: 600;
}
.progress-sub {
	font-size: 20rpx;
	color: #9b9b9b;
	margin-top: 6rpx;
}
.progress-bar {
	height: 10rpx;
	background: linear-gradient(90deg,#8b6cff,#6cc0ff);
	border-radius: 10rpx;
	margin-top: 8rpx;
	width: 60%;
}

/* 响应式调整：小屏时堆叠卡片 */
@media (max-width: 420px) {
	.top-area { flex-direction: column; }
	.side-cards { width: 100%; display: flex; flex-direction: row; gap: 12rpx; }
	.small-card { flex: 1; }
	.feature-grid { padding: 16rpx; gap: 12rpx; }
	.grid-item { width: calc((100% - 36rpx) / 4); }
	.stats-row { flex-direction: column; }
}
</style>
