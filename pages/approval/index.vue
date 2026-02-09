<template>
	<view class="approval-page">
		<!-- 顶部Tab -->
		<view class="tabs">
			<view 
				class="tab-item" 
				:class="{ active: currentTab === 'pending' }" 
				@click="switchTab('pending')"
			>
				待我审批
			</view>
			<view 
				class="tab-item" 
				:class="{ active: currentTab === 'my' }" 
				@click="switchTab('my')"
			>
				我发起的
			</view>
		</view>

		<!-- 发起审批按钮 -->
		<view class="fab" @click="startApproval">
			<text class="fab-icon">+</text>
		</view>

		<!-- 待我审批列表 -->
		<scroll-view v-if="currentTab === 'pending'" class="list" scroll-y>
			<view 
				class="approval-card" 
				v-for="item in pendingList" 
				:key="item._id"
				@click="viewDetail(item)"
			>
				<view class="card-header">
					<text class="title">{{ item.title }}</text>
					<view class="status pending">待审批</view>
				</view>
				<view class="card-body">
					<view class="info-row">
						<text class="label">申请人：</text>
						<text class="value">{{ item.applicantName }}</text>
					</view>
					<view class="info-row">
						<text class="label">申请时间：</text>
						<text class="value">{{ formatTime(item.startTime) }}</text>
					</view>
					<view class="info-row">
						<text class="label">当前节点：</text>
						<text class="value">{{ getCurrentNodeName(item) }}</text>
					</view>
				</view>
				<view class="card-actions">
					<button class="action-btn reject" @click.stop="handleApproval(item, 'rejected')">拒绝</button>
					<button class="action-btn approve" @click.stop="handleApproval(item, 'approved')">通过</button>
				</view>
			</view>

			<view v-if="pendingList.length === 0 && !loading" class="empty">
				<text class="empty-text">暂无待审批</text>
			</view>
		</scroll-view>

		<!-- 我发起的列表 -->
		<scroll-view v-if="currentTab === 'my'" class="list" scroll-y>
			<view 
				class="approval-card" 
				v-for="item in myList" 
				:key="item._id"
				@click="viewDetail(item)"
			>
				<view class="card-header">
					<text class="title">{{ item.title }}</text>
					<view class="status" :class="getStatusClass(item.status)">
						{{ getStatusText(item.status) }}
					</view>
				</view>
				<view class="card-body">
					<view class="info-row">
						<text class="label">申请时间：</text>
						<text class="value">{{ formatTime(item.startTime) }}</text>
					</view>
					<view class="info-row">
						<text class="label">当前节点：</text>
						<text class="value">{{ getCurrentNodeName(item) }}</text>
					</view>
				</view>
			</view>

			<view v-if="myList.length === 0 && !loading" class="empty">
				<text class="empty-text">暂无审批记录</text>
			</view>
		</scroll-view>

		<!-- 加载状态 -->
		<view v-if="loading" class="loading">
			<text>加载中...</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentTab = ref('pending')
const pendingList = ref([])
const myList = ref([])
const loading = ref(false)
const userId = ref('')

onMounted(() => {
	// 获取当前用户ID
	userId.value = uni.getStorageSync('userId')
	if (!userId.value) {
		uni.showToast({
			title: '请先登录',
			icon: 'none'
		})
		setTimeout(() => {
			uni.reLaunch({
				url: '/pages/login/index'
			})
		}, 1500)
		return
	}
	
	loadData()
})

// 切换Tab
function switchTab(tab) {
	currentTab.value = tab
	loadData()
}

// 加载数据
function loadData() {
	if (currentTab.value === 'pending') {
		loadPendingList()
	} else {
		loadMyList()
	}
}

// 加载待我审批列表
function loadPendingList() {
	loading.value = true
	uni.request({
		url: `http://localhost:3000/approval/instances/pending?approverId=${userId.value}`,
		method: 'GET',
		success: (res) => {
			loading.value = false
			if (res.data.success) {
				pendingList.value = res.data.data
			}
		},
		fail: () => {
			loading.value = false
			uni.showToast({
				title: '加载失败',
				icon: 'none'
			})
		}
	})
}

// 加载我发起的列表
function loadMyList() {
	loading.value = true
	uni.request({
		url: `http://localhost:3000/approval/instances/my?applicantId=${userId.value}`,
		method: 'GET',
		success: (res) => {
			loading.value = false
			if (res.data.success) {
				myList.value = res.data.data
			}
		},
		fail: () => {
			loading.value = false
			uni.showToast({
				title: '加载失败',
				icon: 'none'
			})
		}
	})
}

// 处理审批
function handleApproval(item, action) {
	const actionText = action === 'approved' ? '通过' : '拒绝'
	
	uni.showModal({
		title: '确认审批',
		content: `确定要${actionText}这个审批吗？`,
		success: (modalRes) => {
			if (modalRes.confirm) {
				const realName = uni.getStorageSync('realName')
				
				uni.request({
					url: `http://localhost:3000/approval/instances/${item._id}/approve`,
					method: 'POST',
					data: {
						approverId: userId.value,
						approverName: realName,
						action: action,
						comment: `${actionText}审批`
					},
					success: (res) => {
						if (res.data.success) {
							uni.showToast({
								title: `${actionText}成功`,
								icon: 'success'
							})
							loadData()
						} else {
							uni.showToast({
								title: res.data.message || `${actionText}失败`,
								icon: 'none'
							})
						}
					},
					fail: () => {
						uni.showToast({
							title: '操作失败',
							icon: 'none'
						})
					}
				})
			}
		}
	})
}

// 查看详情
function viewDetail(item) {
	uni.navigateTo({
		url: `/pages/approval/detail?id=${item._id}`
	})
}

// 获取当前节点名称
function getCurrentNodeName(item) {
	if (!item.currentNodeId) return '已完成'
	const record = item.records.find(r => r.nodeId === item.currentNodeId)
	return record ? record.nodeName : '未知节点'
}

// 格式化时间
function formatTime(time) {
	if (!time) return ''
	const date = new Date(time)
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 获取状态文本
function getStatusText(status) {
	const map = {
		pending: '审批中',
		approved: '已通过',
		rejected: '已拒绝',
		cancelled: '已取消'
	}
	return map[status] || status
}

// 获取状态样式类
function getStatusClass(status) {
	return status
}

// 发起审批
function startApproval() {
	uni.navigateTo({
		url: '/pages/approval/start'
	})
}
</script>

<style scoped>
.approval-page {
	min-height: 100vh;
	background: #f7f6fb;
}

.tabs {
	display: flex;
	background: #fff;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.tab-item {
	flex: 1;
	text-align: center;
	padding: 28rpx 0;
	font-size: 28rpx;
	color: #666;
	position: relative;
}

.tab-item.active {
	color: #5672ff;
	font-weight: 600;
}

.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 60rpx;
	height: 4rpx;
	background: #5672ff;
	border-radius: 2rpx;
}

.list {
	padding: 20rpx;
	height: calc(100vh - 88rpx);
}

.approval-card {
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.title {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
	flex: 1;
}

.status {
	padding: 6rpx 16rpx;
	border-radius: 8rpx;
	font-size: 22rpx;
}

.status.pending {
	background: #fff3e0;
	color: #ff9800;
}

.status.approved {
	background: #e8f5e9;
	color: #4caf50;
}

.status.rejected {
	background: #ffebee;
	color: #f44336;
}

.card-body {
	margin-bottom: 16rpx;
}

.info-row {
	display: flex;
	margin-top: 12rpx;
}

.label {
	color: #999;
	font-size: 24rpx;
	min-width: 140rpx;
}

.value {
	color: #333;
	font-size: 24rpx;
	flex: 1;
}

.card-actions {
	display: flex;
	gap: 16rpx;
	justify-content: flex-end;
}

.action-btn {
	padding: 12rpx 32rpx;
	border-radius: 8rpx;
	font-size: 24rpx;
	border: none;
}

.action-btn.reject {
	background: #fff;
	color: #f44336;
	border: 1rpx solid #f44336;
}

.action-btn.approve {
	background: #4caf50;
	color: #fff;
}

.empty {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 120rpx 0;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}

.loading {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 60rpx 0;
	font-size: 28rpx;
	color: #999;
}

/* 悬浮添加按钮 */
.fab {
	position: fixed;
	right: 40rpx;
	bottom: 100rpx;
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	background: #5672ff;
	box-shadow: 0 8rpx 24rpx rgba(86, 114, 255, 0.4);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;
}

.fab-icon {
	font-size: 60rpx;
	color: #fff;
	font-weight: 300;
	line-height: 1;
}
</style>
