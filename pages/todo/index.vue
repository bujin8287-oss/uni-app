<template>
	<view class="todo-page">
		<!-- 搜索和状态筛选 -->
		<view class="top-row">
			<view class="search-box">
				<text class="search-icon">🔍</text>
				<input class="search-input" placeholder="请输入需要查找的内容" v-model="query" />
			</view>
			<view class="status-filter" @click="toggleFilter">
				<text>{{ statusLabel }}</text>
				<text class="caret">▾</text>
			</view>
		</view>

		<view v-if="showFilter" class="filter-menu">
			<view class="filter-item" v-for="s in statuses" :key="s.value" @click="setStatus(s.value)">{{ s.label }}</view>
		</view>

		<!-- 待办列表 -->
		<scroll-view class="list" scroll-y>
			<view class="todo-card" v-for="item in filtered" :key="item.id" @click="openDetail(item)">
				<view class="card-top">
					<view class="tag">{{ item.tag }}</view>
					<text class="todo-title">{{ item.title }}</text>
					<view class="more">›</view>
				</view>
				<view class="card-info">
					<view class="info-item">
						<text class="info-label">发起人：</text>
						<text class="info-value">{{ item.initiator }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">任务节点：</text>
						<text class="info-value">{{ item.node }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">发起时间：</text>
						<text class="info-value">{{ item.time }}</text>
					</view>
					<view class="status-badge" :class="item.status">
						<text class="status-text">{{ item.statusText }}</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<BottomNav />
	</view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { getApprovalTodoList } from '@/api/mock.js'
import BottomNav from '@/components/general/BottomNav.vue'

const query = ref('')
const showFilter = ref(false)
const currentStatus = ref('pending')
const loading = ref(false)

const statuses = reactive([
	{ label: '未处理', value: 'pending' },
	{ label: '已办结', value: 'handled' },
])

const data = ref([])

const statusLabel = computed(() => {
	const s = statuses.find(s => s.value === currentStatus.value)
	return s ? s.label : '未处理'
})

onMounted(() => {
	loadTodoList()
})

async function loadTodoList() {
	loading.value = true
	try {
		const res = await getApprovalTodoList({ 
			page: 1, 
			pageSize: 100, 
			status: currentStatus.value 
		})
		if (res.code === 0) {
			data.value = res.data.items
		}
	} catch (error) {
		console.error('加载待办列表失败:', error)
		uni.showToast({ title: '加载失败', icon: 'none' })
	} finally {
		loading.value = false
	}
}

function toggleFilter() {
	showFilter.value = !showFilter.value
}

function setStatus(v) {
	currentStatus.value = v
	showFilter.value = false
	loadTodoList()
}

const filtered = computed(() => {
	return data.value.filter(d => {
		const okQuery = query.value ? (d.title.includes(query.value) || d.tag.includes(query.value) || d.node.includes(query.value)) : true
		return okQuery
	})
})

function openDetail(item) {
	uni.navigateTo({ 
		url: `/pages/todo/detail?id=${item.id}` 
	})
}
</script>

<style>
.todo-page {
	padding: 20rpx;
	background: #f7f6fb;
	min-height: 100vh;
	padding-bottom: 160rpx;
}
.top-row {
	display: flex;
	gap: 12rpx;
	align-items: center;
	margin-bottom: 12rpx;
}
.search-box {
	flex: 1;
	background: #fff;
	padding: 12rpx;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	gap: 12rpx;
	box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.03);
}
.search-input {
	flex: 1;
	border: none;
	background: transparent;
	font-size: 24rpx;
	height: 36rpx;
}
.status-filter {
	width: 120rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 26rpx;
}
.caret { margin-left: 6rpx; color: #999; }
.filter-menu {
	background: #fff;
	border-radius: 8rpx;
	padding: 8rpx;
	margin-bottom: 12rpx;
	box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.03);
}
.filter-item { padding: 10rpx 12rpx; font-size: 24rpx; color: #333; }
.list { height: calc(100vh - 220rpx); }
.todo-card {
	background: #fff;
	padding: 24rpx;
	margin-bottom: 16rpx;
	border-radius: 12rpx;
	box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.04);
	position: relative;
}
.card-top { 
	display: flex; 
	align-items: center; 
	gap: 12rpx;
	margin-bottom: 20rpx;
}
.tag { 
	background: #f0f6ff; 
	color: #5672ff; 
	border-radius: 8rpx; 
	padding: 6rpx 12rpx; 
	font-size: 22rpx; 
	border: 1rpx solid rgba(86,114,255,0.08);
	flex-shrink: 0;
}
.todo-title { 
	font-size: 32rpx; 
	font-weight: 700;
	color: #333;
	flex: 1;
}
.more { 
	color: #cfcfe6; 
	font-size: 32rpx;
	flex-shrink: 0;
}
.card-info {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
	position: relative;
}
.info-item { 
	display: flex; 
	align-items: center;
}
.info-label { 
	color: #9b9b9b; 
	font-size: 24rpx;
	flex-shrink: 0;
}
.info-value { 
	color: #333; 
	font-size: 24rpx;
	flex: 1;
}
.status-badge {
	position: absolute;
	right: 0;
	bottom: 0;
	padding: 8rpx 20rpx;
	border-radius: 8rpx;
	border: 2rpx solid #ff5a5a;
	background: #fff;
}
.status-badge.handled {
	border-color: #52c41a;
}
.status-text {
	font-size: 24rpx;
	color: #ff5a5a;
}
.status-badge.handled .status-text {
	color: #52c41a;
}
.action-btn { 
	background: #fff; 
	border: 1rpx solid #e3e3ee; 
	color: #ff5a5a; 
	padding: 6rpx 12rpx; 
	border-radius: 8rpx; 
	font-size: 22rpx; 
}
</style>

