<template>
	<view class="ab-page">
		<!-- 搜索与筛选 -->
		<view class="top-row">
			<view class="search-box">
				<text class="search-icon">🔍</text>
				<input class="search-input" placeholder="请输入关键字、异常单号或工序" v-model="query" />
			</view>
			<view class="filter" @click="toggleStatusMenu">
				<text>{{ statusLabel }}</text>
				<text class="caret">▾</text>
			</view>
		</view>

		<!-- 状态下拉（简单实现） -->
		<view v-if="showStatus" class="status-menu">
			<view class="status-item" v-for="s in statuses" :key="s.value" @click="setStatus(s.value)">{{ s.label }}</view>
		</view>

		<!-- 异常卡片列表 -->
		<scroll-view class="list" scroll-y>
			<view class="card" v-for="item in filteredData" :key="item.id" @click="openDetail(item)">
				<view class="card-row">
					<view class="tag">一般异常</view>
					<text class="code">{{ item.code }}</text>
					<view class="more">›</view>
				</view>
				<view class="card-body">
					<view class="field"><text class="label">异常工序：</text><text class="value">{{ item.process }}</text></view>
					<view class="field"><text class="label">异常分类：</text><text class="value">{{ item.category }}</text></view>
					<view class="field"><text class="label">异常时间：</text><text class="value">{{ item.time }}</text></view>
				</view>
				<view class="card-action">
					<button class="status-btn" @click.stop="handleAction(item)">{{ item.statusText }}</button>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const query = ref('')
const showStatus = ref(false)
const currentStatus = ref('unhandled')

const statuses = reactive([
	{ label: '未处理', value: 'unhandled' },
	{ label: '处理中', value: 'processing' },
	{ label: '已处理', value: 'handled' },
])

const data = reactive([
	{ id: 1, code: 'YCBH00000001', process: '第五道工序', category: '设备异常', time: '2025-04-23 14:00:20', status: 'unhandled', statusText: '未处理' },
	{ id: 2, code: 'YCBH00000002', process: '第三道工序', category: '质量异常', time: '2025-04-22 10:12:00', status: 'processing', statusText: '处理中' },
	{ id: 3, code: 'YCBH00000003', process: '第一道工序', category: '材料异常', time: '2025-04-21 09:05:40', status: 'handled', statusText: '已处理' },
	{ id: 4, code: 'YCBH00000004', process: '第五道工序', category: '设备异常', time: '2025-04-23 14:00:20', status: 'unhandled', statusText: '未处理' },
	{ id: 5, code: 'YCBH00000005', process: '第五道工序', category: '设备异常', time: '2025-04-23 14:00:20', status: 'unhandled', statusText: '未处理' },
])

const statusLabel = computed(() => statuses.find(s => s.value === currentStatus.value)?.label || '全部')

function toggleStatusMenu() {
	showStatus.value = !showStatus.value
}

function setStatus(value) {
	currentStatus.value = value
	showStatus.value = false
}

const filteredData = computed(() => {
	return data.filter(d => {
		const matchStatus = currentStatus.value === 'all' ? true : d.status === currentStatus.value
		const matchQuery = query.value ? (d.code.includes(query.value) || d.process.includes(query.value) || d.category.includes(query.value)) : true
		return matchStatus && matchQuery
	})
})

function openDetail(item) {
	uni.navigateTo({ url: `/pages/feature/index?name=异常详情&code=${encodeURIComponent(item.code)}` })
}

function handleAction(item) {
	// 简单示例：切换到处理中
	if (item.status === 'unhandled') {
		item.status = 'processing'
		item.statusText = '处理中'
	} else if (item.status === 'processing') {
		item.status = 'handled'
		item.statusText = '已处理'
	}
}
</script>

<style>
.ab-page {
	padding: 20rpx;
	background: #f7f6fb;
	min-height: 100vh;
	padding-bottom: 160rpx;
}
.top-row {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 12rpx;
}
.search-box {
	flex: 1;
	background: #fff;
	border-radius: 12rpx;
	padding: 12rpx;
	display: flex;
	align-items: center;
	gap: 10rpx;
	box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.03);
}
.search-input {
	flex: 1;
	border: none;
	outline: none;
	font-size: 24rpx;
	color: #666;
	background: transparent;
	height: 36rpx;
}
.search-icon { color: #bdbbdc; font-size: 28rpx; }
.filter {
	width: 140rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	background: transparent;
	font-size: 26rpx;
	color: #333;
}
.caret { margin-left: 6rpx; color: #999; }
.status-menu {
	background: #fff;
	border-radius: 8rpx;
	padding: 8rpx;
	margin-bottom: 12rpx;
	box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.03);
}
.status-item {
	padding: 10rpx 12rpx;
	font-size: 24rpx;
	color: #333;
}
.list {
	height: calc(100vh - 220rpx);
}
.card {
	background: #fff;
	padding: 18rpx;
	margin-bottom: 14rpx;
	border-radius: 12rpx;
	box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.04);
}
.card-row {
	display: flex;
	align-items: center;
	gap: 12rpx;
}
.tag {
	background: #fff0f0;
	color: #ff5a5a;
	border-radius: 8rpx;
	padding: 6rpx 10rpx;
	font-size: 20rpx;
	border: 1rpx solid rgba(255,90,90,0.12);
}
.code {
	font-weight: 700;
	font-size: 28rpx;
	margin-left: 6rpx;
}
.more {
	margin-left: auto;
	color: #cfcfe6;
	font-size: 28rpx;
}
.card-body {
	margin-top: 12rpx;
}
.field { display: flex; gap: 12rpx; margin-top: 6rpx; align-items: center; }
.label { color: #9b9b9b; width: 110rpx; font-size: 22rpx; }
.value { color: #333; font-size: 22rpx; }
.card-action { display: flex; justify-content: flex-end; margin-top: 12rpx; }
.status-btn {
	background: #fff;
	border: 1rpx solid #e3e3ee;
	color: #5b4bff;
	padding: 6rpx 12rpx;
	border-radius: 8rpx;
	font-size: 22rpx;
}
</style>

