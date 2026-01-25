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
			<view class="todo-card" v-for="item in filtered" :key="item.id">
				<view class="card-header">
					<view class="tag">{{ item.tag }}</view>
					<text class="todo-title">{{ item.title }}</text>
					<view class="more">›</view>
				</view>
				<view class="card-body">
					<view class="line"><text class="label">发起人：</text><text class="value">{{ item.initiator }}</text></view>
					<view class="line"><text class="label">任务节点：</text><text class="value">{{ item.node }}</text></view>
					<view class="line"><text class="label">发起时间：</text><text class="value">{{ item.time }}</text></view>
				</view>
				<view class="card-action">
					<button class="action-btn" @click.stop="handle(item)">{{ item.statusText }}</button>
				</view>
			</view>
		</scroll-view>
		<BottomNav />
	</view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import BottomNav from '@/components/business/BottomNav.vue'

const query = ref('')
const showFilter = ref(false)
const currentStatus = ref('unhandled')

const statuses = reactive([
	{ label: '未处理', value: 'unhandled' },
	{ label: '已办结', value: 'handled' },
	{ label: '待我处理', value: 'mine' },
])

const data = reactive([
	{ id: 1, tag: '审批特办', title: '2025审批任务待办', initiator: '李民浩', node: '处理人', time: '2025-04-23 14:00:20', status: 'unhandled', statusText: '未处理' },
	{ id: 2, tag: '审批特办', title: '2025审批任务待办', initiator: '李民浩', node: '处理人', time: '2025-04-23 14:00:20', status: 'unhandled', statusText: '未处理' },
	{ id: 3, tag: '审批特办', title: '2025审批任务待办', initiator: '李民浩', node: '处理人', time: '2025-04-23 14:00:20', status: 'unhandled', statusText: '未处理' },
	{ id: 4, tag: '审批特办', title: '2025审批任务待办', initiator: '李民浩', node: '处理人', time: '2025-04-23 14:00:20', status: 'handled', statusText: '已办结' },
])

const statusLabel = computed(() => {
	const s = statuses.find(s => s.value === currentStatus.value)
	return s ? s.label : '未处理'
})

function toggleFilter() {
	showFilter.value = !showFilter.value
}

function setStatus(v) {
	currentStatus.value = v
	showFilter.value = false
}

const filtered = computed(() => {
	return data.filter(d => {
		const okStatus = currentStatus.value === 'all' ? true : (currentStatus.value === 'mine' ? d.initiator === '李民浩' : (currentStatus.value === d.status))
		const okQuery = query.value ? (d.title.includes(query.value) || d.tag.includes(query.value) || d.node.includes(query.value)) : true
		return okStatus && okQuery
	})
})

function handle(item) {
	if (item.status === 'unhandled') {
		item.status = 'handled'
		item.statusText = '已办结'
		uni.showToast({ title: '已处理', icon: 'none' })
	} else {
		uni.showToast({ title: '已办结', icon: 'none' })
	}
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
	padding: 16rpx;
	margin-bottom: 14rpx;
	border-radius: 12rpx;
	box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.04);
}
.card-header { display: flex; align-items: center; gap: 12rpx; }
.tag { background: #f0f6ff; color: #5672ff; border-radius: 8rpx; padding: 6rpx 10rpx; font-size: 20rpx; border: 1rpx solid rgba(86,114,255,0.08); }
.todo-title { font-size: 28rpx; font-weight: 700; margin-left: 6rpx; }
.more { margin-left: auto; color: #cfcfe6; font-size: 28rpx; }
.card-body { margin-top: 12rpx; }
.line { display: flex; gap: 10rpx; align-items: center; margin-top: 6rpx; }
.label { color: #9b9b9b; width: 90rpx; font-size: 22rpx; }
.value { color: #333; font-size: 22rpx; }
.card-action { display: flex; justify-content: flex-end; margin-top: 12rpx; }
.action-btn { background: #fff; border: 1rpx solid #e3e3ee; color: #ff5a5a; padding: 6rpx 12rpx; border-radius: 8rpx; font-size: 22rpx; }
</style>

