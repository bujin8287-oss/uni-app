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
			<view :class="['tab', activeTab === 'yesterday' ? 'active' : '']" @click="switchTab('yesterday')">昨日</view>
			<view :class="['tab', activeTab === 'week' ? 'active' : '']" @click="switchTab('week')">本周</view>
			<view :class="['tab', activeTab === 'month' ? 'active' : '']" @click="switchTab('month')">本月</view>
		</view>

		<!-- Top statistics area -->
		<view class="top-area">
			<view class="main-card">
				<text class="card-title">{{ tabTitle }}生产数量</text>
				<text class="card-number">{{ stats.production }}</text>
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
					<text class="small-num">{{ stats.orders }}</text>
					<text class="small-label">{{ tabTitle }}订单数</text>
				</view>
				<view class="small-card">
					<text class="small-num">{{ stats.outbound }}</text>
					<text class="small-label">{{ tabTitle }}出库数</text>
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
			<view class="workorder-header">
				<text class="workorder-title">工单统计</text>
			</view>
			<view class="workorder-content">
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

		<!-- 产品统计（统一样式） -->
		<view class="workorder-area" style="margin-top:24rpx;">
			<view class="workorder-header">
				<text class="workorder-title">产品统计</text>
			</view>
			<view class="workorder-content">
				<view class="donut-card">
					<view class="donut" style="background:conic-gradient(#6CC0FF 0deg 120deg,#A58CFF 120deg 220deg,#23D3A6 220deg 300deg,#9B4CFF 300deg 360deg);">
						<view class="donut-center">
							<text class="donut-number">{{ productsStats.total }}</text>
							<text class="donut-label">产品总数</text>
						</view>
					</view>
				</view>
				<view class="legend">
					<view class="legend-item" v-for="(p, idx) in productsStats.items" :key="idx">
						<view class="legend-dot" :style="{ backgroundColor: p.color }"></view>
						<text class="legend-text">{{ p.name }} {{ p.count }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 缺陷统计（统一样式） -->
		<view class="workorder-area" style="margin-top:24rpx;">
			<view class="workorder-header">
				<text class="workorder-title">缺陷统计</text>
			</view>
			<view class="workorder-content">
				<view class="donut-card">
					<view class="donut" style="background:conic-gradient(#0B4C7A 0deg 160deg,#9B9BBF 160deg 240deg,#3A1A3A 240deg 300deg,#3E8A6B 300deg 360deg);">
						<view class="donut-center">
							<text class="donut-number">{{ defectsStats.total }}</text>
							<text class="donut-label">缺陷总数</text>
						</view>
					</view>
				</view>
				<view class="legend">
					<view class="legend-item" v-for="(d, idx) in defectsStats.items" :key="idx">
						<view class="legend-dot" :style="{ backgroundColor: d.color }"></view>
						<text class="legend-text">{{ d.name }} {{ d.count }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 工单产出统计折线图 -->
		<view class="stats-area" style="margin-top:18rpx;">
			<view class="chart-card">
				<view class="chart-header-row">
					<text class="card-title">工单产出统计</text>
					<view class="chart-legend-row">
						<view class="chart-legend-item">
							<view class="chart-legend-dot bar"></view>
							<text class="chart-legend-text">产出数</text>
						</view>
						<view class="chart-legend-item">
							<view class="chart-legend-dot line"></view>
							<text class="chart-legend-text">完成率</text>
						</view>
					</view>
				</view>
				<view class="line-chart">
					<view class="chart-main">
						<view class="chart-bars">
							<view
								v-for="(val, idx) in productionChart.values"
								:key="idx"
								class="chart-bar"
								:style="{ height: (val / productionChart.maxValue * 100) + '%' }"
							></view>
						</view>
						<view class="chart-line">
							<view
								v-for="(rate, idx) in productionChart.rate"
								:key="idx"
								class="chart-dot"
								:style="{
									left: (idx / (productionChart.rate.length - 1 || 1) * 100) + '%',
									bottom: (rate / productionChart.maxRate * 100) + '%'
								}"
							></view>
						</view>
					</view>
					<view class="chart-x-labels">
						<text
							v-for="(label, idx) in productionChart.labels"
							:key="idx"
							class="chart-x-label"
						>{{ label }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 产品合格率折线图 -->
		<view class="stats-area" style="margin-top:18rpx;">
			<view class="chart-card">
				<view class="chart-header-row">
					<text class="card-title">产品合格率</text>
					<view class="chart-legend-row">
						<view class="chart-legend-item">
							<view class="chart-legend-dot line"></view>
							<text class="chart-legend-text">合格率</text>
						</view>
					</view>
				</view>
				<view class="line-chart line-only">
					<view class="chart-main">
						<view class="chart-line background"></view>
						<view class="chart-line">
							<view
								v-for="(rate, idx) in productPassChart.rate"
								:key="idx"
								class="chart-dot"
								:style="{
									left: (idx / (productPassChart.rate.length - 1 || 1) * 100) + '%',
									bottom: (rate / productPassChart.maxRate * 100) + '%'
								}"
							></view>
						</view>
					</view>
					<view class="chart-x-labels">
						<text
							v-for="(label, idx) in productPassChart.labels"
							:key="idx"
							class="chart-x-label"
						>{{ label }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 工单生产进度（支持近五单 / 近十单切换） -->
		<view class="stats-area" style="margin-top:18rpx;margin-bottom: 100rpx;">
			<view class="chart-card">
				<view class="progress-header">
					<text class="card-title">工单生产进度</text>
					<view class="progress-tabs">
						<text
							:class="['progress-tab', workOrderViewCount === 5 ? 'active' : '']"
							@click="setWorkOrderViewCount(5)"
						>近五单</text>
						<text
							:class="['progress-tab', workOrderViewCount === 10 ? 'active' : '']"
							@click="setWorkOrderViewCount(10)"
						>近十单</text>
					</view>
				</view>
				<view class="progress-list">
					<view class="progress-item" v-for="(it, i) in visibleWorkOrderProgress" :key="i">
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
import { reactive, ref, onMounted, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import api from '@/api'
import BottomNav from '@/components/business/BottomNav.vue'
import { openFeature } from '@/components/business/featureNavigation.js'

const userName = ref('admin')
const activeTab = ref('yesterday')
const loading = ref(true)

const stats = reactive({
	production: 0,
	reachRate: '0%',
	passRate: '0%',
	reworkCount: 0,
	orders: 0,
	outbound: 0,
})

// 计算当前标签的标题文本
const tabTitle = computed(() => {
	const titleMap = {
		yesterday: '昨日',
		week: '本周',
		month: '本月',
	}
	return titleMap[activeTab.value] || '昨日'
})

// 切换标签并加载数据
async function switchTab(tab) {
	if (activeTab.value === tab) return
	activeTab.value = tab
	await loadStats()
}

// 加载统计数据
async function loadStats() {
	loading.value = true
	try {
		const res = await api.getHomeStats({ timeRange: activeTab.value })
		if (res && res.code === 0 && res.data) {
			stats.production = res.data.production || 0
			stats.reachRate = res.data.reachRate || '0%'
			stats.passRate = res.data.passRate || '0%'
			stats.reworkCount = res.data.reworkCount || 0
			stats.orders = res.data.orders || 0
			stats.outbound = res.data.outbound || 0
		}
	} catch (e) {
		console.error('getHomeStats error', e)
	} finally {
		loading.value = false
	}
}

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
	rate: [0.88,0.85,0.9,0.87,0.92,0.95,0.91,0.9,0.94],
	maxValue: 200,
	maxRate: 1,
})

const productPassChart = reactive({
	labels: ['4.2','4.3','4.4','4.5','4.6','4.7','4.8','4.9','4.10'],
	rate: [0.93,0.95,0.94,0.955,0.96,0.958,0.962,0.957,0.969],
	maxRate: 1,
})

const workOrderProgressList = reactive([
	{ order: 'SVDD00001', name: '笔记本电脑', qty: 1000, progress: '91.3%' },
	{ order: 'SVDD00002', name: '笔记本电脑', qty: 1000, progress: '86.3%' },
	{ order: 'SVDD00003', name: '笔记本电脑', qty: 1000, progress: '80.2%' },
	{ order: 'SVDD00004', name: '笔记本电脑', qty: 1000, progress: '66.5%' },
	{ order: 'SVDD00005', name: '笔记本电脑', qty: 1000, progress: '52.7%' },
	{ order: 'SVDD00006', name: '笔记本电脑', qty: 1000, progress: '48.2%' },
	{ order: 'SVDD00007', name: '笔记本电脑', qty: 1000, progress: '42.6%' },
	{ order: 'SVDD00008', name: '笔记本电脑', qty: 1000, progress: '38.1%' },
	{ order: 'SVDD00009', name: '笔记本电脑', qty: 1000, progress: '33.4%' },
	{ order: 'SVDD00010', name: '笔记本电脑', qty: 1000, progress: '28.9%' },
])

// 工单进度列表显示条数（5 / 10）
const workOrderViewCount = ref(5)
const visibleWorkOrderProgress = computed(() => {
	return workOrderProgressList.slice(0, workOrderViewCount.value)
})

function setWorkOrderViewCount(count) {
	workOrderViewCount.value = count
}

onMounted(async () => {
	await loadStats()
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
	flex-direction: column;
}
.workorder-header {
	margin-bottom: 20rpx;
}
.workorder-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
}
.workorder-content {
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
.chart-header-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.chart-legend-row {
	display: flex;
	gap: 16rpx;
	align-items: center;
}
.chart-legend-item {
	display: flex;
	align-items: center;
	gap: 6rpx;
}
.chart-legend-dot {
	width: 14rpx;
	height: 14rpx;
	border-radius: 7rpx;
}
.chart-legend-dot.bar {
	background: #3b82f6;
}
.chart-legend-dot.line {
	border-radius: 7rpx;
	border: 3rpx solid #22c55e;
	background: transparent;
}
.chart-legend-text {
	font-size: 22rpx;
	color: #666;
}
.line-chart {
	margin-top: 14rpx;
}
.line-chart .chart-main {
	position: relative;
	height: 180rpx;
	background: linear-gradient(180deg,rgba(59,130,246,0.05),rgba(59,130,246,0));
	border-radius: 12rpx;
	padding: 8rpx 0;
	overflow: hidden;
}
.line-chart.line-only .chart-main {
	background: linear-gradient(180deg,rgba(34,197,94,0.08),rgba(34,197,94,0));
}
.chart-bars {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	top: 0;
	display: flex;
	align-items: flex-end;
	padding: 0 24rpx 18rpx;
	gap: 10rpx;
	box-sizing: border-box;
}
.chart-bar {
	flex: 1;
	background: #3b82f6;
	border-radius: 6rpx 6rpx 0 0;
	opacity: 0.9;
}
.chart-line {
	position: absolute;
	left: 24rpx;
	right: 24rpx;
	top: 12rpx;
	bottom: 18rpx;
}
.chart-line.background {
	background: linear-gradient(180deg,rgba(34,197,94,0.12),rgba(34,197,94,0));
	border-radius: 12rpx;
}
.chart-dot {
	position: absolute;
	width: 14rpx;
	height: 14rpx;
	margin-left: -7rpx;
	margin-bottom: -7rpx;
	background: #22c55e;
	border-radius: 7rpx;
	border: 3rpx solid #e0f7e9;
	box-sizing: border-box;
}
.chart-x-labels {
	margin-top: 8rpx;
	display: flex;
	justify-content: space-between;
	padding: 0 24rpx;
}
.chart-x-label {
	font-size: 20rpx;
	color: #9b9b9b;
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
/* 工单进度头部与切换按钮 */
.progress-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.progress-tabs {
	display: flex;
	gap: 16rpx;
	font-size: 22rpx;
}
.progress-tab {
	color: #9b9b9b;
}
.progress-tab.active {
	color: #5b4bff;
	font-weight: 600;
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
