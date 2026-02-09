<template>
	<view class="detail-page">
		<view class="header">
			<text class="title">{{ instance.title }}</text>
			<view class="status" :class="getStatusClass(instance.status)">
				{{ getStatusText(instance.status) }}
			</view>
		</view>

		<view class="section">
			<view class="section-title">基本信息</view>
			<view class="info-item">
				<text class="label">申请人：</text>
				<text class="value">{{ instance.applicantName }}</text>
			</view>
			<view class="info-item">
				<text class="label">申请时间：</text>
				<text class="value">{{ formatTime(instance.startTime) }}</text>
			</view>
			<view class="info-item" v-if="instance.endTime">
				<text class="label">完成时间：</text>
				<text class="value">{{ formatTime(instance.endTime) }}</text>
			</view>
		</view>

		<view class="section">
			<view class="section-title">审批流程</view>
			<view class="timeline">
				<view 
					class="timeline-item" 
					v-for="(record, index) in instance.records" 
					:key="index"
				>
					<view class="timeline-dot" :class="getRecordClass(record.action)"></view>
					<view class="timeline-content">
						<view class="node-name">{{ record.nodeName }}</view>
						<view class="node-info">
							<text v-if="record.approverName">审批人：{{ record.approverName }}</text>
							<text v-if="record.approvedAt">{{ formatTime(record.approvedAt) }}</text>
						</view>
						<view class="node-status" :class="getRecordClass(record.action)">
							{{ getRecordText(record.action) }}
						</view>
						<view class="node-comment" v-if="record.comment">
							备注：{{ record.comment }}
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="section" v-if="instance.formData">
			<view class="section-title">表单数据</view>
			<view class="form-data">
				<view 
					class="form-item" 
					v-for="(value, key) in instance.formData" 
					:key="key"
				>
					<text class="label">{{ key }}：</text>
					<text class="value">{{ value }}</text>
				</view>
			</view>
		</view>

		<view class="loading" v-if="loading">
			<text>加载中...</text>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const instance = ref({})
const loading = ref(false)
let instanceId = ''

onLoad((options) => {
	instanceId = options.id
	if (instanceId) {
		loadDetail()
	}
})

// 加载详情
function loadDetail() {
	loading.value = true
	uni.request({
		url: `http://localhost:3000/approval/instances/${instanceId}`,
		method: 'GET',
		success: (res) => {
			loading.value = false
			if (res.data.success) {
				instance.value = res.data.data
			} else {
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
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

// 获取记录文本
function getRecordText(action) {
	const map = {
		pending: '待审批',
		approved: '已通过',
		rejected: '已拒绝',
		auto_approved: '自动通过'
	}
	return map[action] || action
}

// 获取记录样式类
function getRecordClass(action) {
	if (action === 'approved' || action === 'auto_approved') return 'approved'
	if (action === 'rejected') return 'rejected'
	return 'pending'
}
</script>

<style scoped>
.detail-page {
	min-height: 100vh;
	background: #f7f6fb;
	padding: 20rpx;
	padding-bottom: 40rpx;
}

.header {
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	display: block;
	margin-bottom: 16rpx;
}

.status {
	display: inline-block;
	padding: 8rpx 20rpx;
	border-radius: 8rpx;
	font-size: 24rpx;
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

.section {
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.section-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 20rpx;
	padding-bottom: 16rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.info-item {
	display: flex;
	margin-bottom: 16rpx;
}

.label {
	color: #999;
	font-size: 26rpx;
	min-width: 140rpx;
}

.value {
	color: #333;
	font-size: 26rpx;
	flex: 1;
}

.timeline {
	position: relative;
	padding-left: 40rpx;
}

.timeline-item {
	position: relative;
	padding-bottom: 40rpx;
}

.timeline-item:last-child {
	padding-bottom: 0;
}

.timeline-item::before {
	content: '';
	position: absolute;
	left: -28rpx;
	top: 32rpx;
	bottom: -8rpx;
	width: 2rpx;
	background: #e0e0e0;
}

.timeline-item:last-child::before {
	display: none;
}

.timeline-dot {
	position: absolute;
	left: -36rpx;
	top: 8rpx;
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	background: #e0e0e0;
	border: 3rpx solid #fff;
	box-shadow: 0 0 0 2rpx #e0e0e0;
}

.timeline-dot.approved {
	background: #4caf50;
	box-shadow: 0 0 0 2rpx #4caf50;
}

.timeline-dot.rejected {
	background: #f44336;
	box-shadow: 0 0 0 2rpx #f44336;
}

.timeline-dot.pending {
	background: #ff9800;
	box-shadow: 0 0 0 2rpx #ff9800;
}

.timeline-content {
	padding-left: 20rpx;
}

.node-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 8rpx;
}

.node-info {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 8rpx;
	display: flex;
	gap: 20rpx;
}

.node-status {
	display: inline-block;
	padding: 4rpx 12rpx;
	border-radius: 6rpx;
	font-size: 22rpx;
	margin-bottom: 8rpx;
}

.node-status.approved {
	background: #e8f5e9;
	color: #4caf50;
}

.node-status.rejected {
	background: #ffebee;
	color: #f44336;
}

.node-status.pending {
	background: #fff3e0;
	color: #ff9800;
}

.node-comment {
	font-size: 24rpx;
	color: #666;
	margin-top: 8rpx;
	padding: 12rpx;
	background: #f5f5f5;
	border-radius: 8rpx;
}

.form-data {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.form-item {
	display: flex;
}

.loading {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 60rpx 0;
	font-size: 28rpx;
	color: #999;
}
</style>
