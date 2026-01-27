<template>
	<view class="detail-page">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="header-title">待办详情</text>
			<view class="header-right"></view>
		</view>

		<scroll-view class="content-scroll" scroll-y>
			<view class="info-section">
				<view class="info-row">
					<text class="info-label">任务编号</text>
					<text class="info-value">{{ detailData.code }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">任务名称</text>
					<text class="info-value">{{ detailData.title }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">任务节点</text>
					<text class="info-value">{{ detailData.node }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">待办类型</text>
					<text class="info-value">{{ detailData.type }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">发起时间</text>
					<text class="info-value">{{ detailData.createTime }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">最终处理</text>
					<text class="info-value">{{ detailData.deadline }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">发起人</text>
					<text class="info-value">{{ detailData.initiator }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">处理状态</text>
					<text class="info-value status-text">{{ detailData.statusText }}</text>
				</view>
			</view>

			<view class="section">
				<text class="section-title">绑定</text>
				<text class="content-text">{{ detailData.binding || '工艺流转卡' }}</text>
			</view>

			<!-- 审批流程节点 -->
			<view class="section" v-if="detailData.nodes && detailData.nodes.length > 0">
				<text class="section-title">审批流程</text>
				<view class="workflow-nodes">
					<view 
						class="workflow-node" 
						v-for="(node, index) in detailData.nodes" 
						:key="node.nodeId"
					>
						<view class="node-header">
							<view class="node-number">{{ index + 1 }}</view>
							<text class="node-name">{{ node.nodeName }}</text>
							<view 
								class="node-status" 
								:class="{
									'status-pending': node.status === 'pending',
									'status-approved': node.status === 'approved',
									'status-rejected': node.status === 'rejected',
									'status-waiting': node.status === 'waiting'
								}"
							>
								<text class="status-text">
									{{ node.status === 'pending' ? '待审批' : 
									   node.status === 'approved' ? '已通过' : 
									   node.status === 'rejected' ? '已驳回' : '等待中' }}
								</text>
							</view>
						</view>
						<view class="node-info">
							<text class="node-label">审批人：</text>
							<text class="node-value">{{ node.approver || '待指定' }}</text>
						</view>
						<view class="node-info" v-if="node.approveTime">
							<text class="node-label">审批时间：</text>
							<text class="node-value">{{ node.approveTime }}</text>
						</view>
						<view class="node-info" v-if="node.comment">
							<text class="node-label">审批意见：</text>
							<text class="node-value">{{ node.comment }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 审批历史 -->
			<view class="section" v-if="detailData.history && detailData.history.length > 0">
				<text class="section-title">审批历史</text>
				<view class="history-list">
					<view 
						class="history-item" 
						v-for="(item, index) in detailData.history" 
						:key="index"
					>
						<view class="history-header">
							<text class="history-node">{{ item.nodeName }}</text>
							<text class="history-time">{{ item.time }}</text>
						</view>
						<view class="history-info">
							<text class="history-label">审批人：</text>
							<text class="history-value">{{ item.approver }}</text>
						</view>
						<view class="history-info">
							<text class="history-label">审批结果：</text>
							<text 
								class="history-value" 
								:class="{ 'text-success': item.action === 'approved', 'text-danger': item.action === 'rejected' }"
							>
								{{ item.action === 'approved' ? '通过' : '驳回' }}
							</text>
						</view>
						<view class="history-info" v-if="item.comment">
							<text class="history-label">审批意见：</text>
							<text class="history-value">{{ item.comment }}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<view class="submit-bar">
			<button class="submit-btn" @click="handleApproval">审批</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getApprovalDetail } from '@/api/mock.js'

const taskId = ref('')
const detailData = ref({
	code: '',
	title: '',
	node: '',
	type: '',
	createTime: '',
	deadline: '',
	initiator: '',
	statusText: '',
	binding: '',
	canApprove: false,
	nodes: [],
	history: []
})

onLoad((options) => {
	if (options.id) {
		taskId.value = options.id
		loadDetail(options.id)
	}
})

async function loadDetail(id) {
	try {
		const res = await getApprovalDetail({ id })
		if (res.code === 0) {
			detailData.value = res.data
		} else {
			uni.showToast({ title: res.message || '加载失败', icon: 'none' })
		}
	} catch (error) {
		console.error('加载详情失败:', error)
		uni.showToast({ title: '加载失败', icon: 'none' })
	}
}

function handleApproval() {
	if (!detailData.value.canApprove) {
		uni.showToast({ title: '无权限审批此任务', icon: 'none' })
		return
	}
	uni.navigateTo({ 
		url: `/pages/todo/approval?id=${taskId.value}` 
	})
}

function goBack() {
	uni.navigateBack()
}
</script>

<style scoped>
.detail-page {
	background: #f7f6fb;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

.header {
	background: #fff;
	padding: 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1rpx solid #f0f0f0;
}

.back-btn {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-icon {
	font-size: 48rpx;
	color: #333;
	font-weight: 300;
}

.header-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
}

.header-right {
	width: 60rpx;
}

.content-scroll {
	flex: 1;
	padding: 20rpx;
	box-sizing: border-box;
}

.info-section {
	background: #fff;
	border-radius: 12rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
}

.info-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
}

.info-row:last-child {
	border-bottom: none;
}

.info-label {
	color: #9b9b9b;
	font-size: 28rpx;
	flex-shrink: 0;
}

.info-value {
	color: #333;
	font-size: 28rpx;
	text-align: right;
	flex: 1;
	margin-left: 40rpx;
}

.status-text {
	color: #ff5a5a;
}

.section {
	background: #fff;
	border-radius: 12rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
}

.section-title {
	color: #333;
	font-size: 28rpx;
	font-weight: 700;
	display: block;
	margin-bottom: 20rpx;
}

.content-text {
	color: #333;
	font-size: 28rpx;
	line-height: 1.6;
	display: block;
}

.submit-bar {
	padding: 20rpx;
	background: #fff;
	box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.submit-btn {
	width: 100%;
	height: 88rpx;
	background: linear-gradient(135deg, #7c66ff, #9b7fff);
	color: #fff;
	font-size: 32rpx;
	font-weight: 700;
	border-radius: 44rpx;
	border: none;
	display: flex;
	justify-content: center;
	align-items: center;
}

.submit-btn::after {
	border: none;
}

.workflow-nodes {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.workflow-node {
	background: #f9f9fb;
	border-radius: 8rpx;
	padding: 20rpx;
	border-left: 4rpx solid #7c66ff;
}

.node-header {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 16rpx;
}

.node-number {
	width: 40rpx;
	height: 40rpx;
	background: #7c66ff;
	color: #fff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	font-weight: 700;
	flex-shrink: 0;
}

.node-name {
	font-size: 28rpx;
	font-weight: 700;
	color: #333;
	flex: 1;
}

.node-status {
	padding: 6rpx 16rpx;
	border-radius: 6rpx;
	font-size: 22rpx;
	flex-shrink: 0;
}

.status-pending {
	background: #fff3e0;
	color: #ff9800;
}

.status-approved {
	background: #e8f5e9;
	color: #4caf50;
}

.status-rejected {
	background: #ffebee;
	color: #f44336;
}

.status-waiting {
	background: #f5f5f5;
	color: #999;
}

.node-info {
	display: flex;
	align-items: flex-start;
	margin-bottom: 8rpx;
	font-size: 24rpx;
}

.node-info:last-child {
	margin-bottom: 0;
}

.node-label {
	color: #999;
	flex-shrink: 0;
	width: 140rpx;
}

.node-value {
	color: #333;
	flex: 1;
}

.history-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.history-item {
	background: #f9f9fb;
	border-radius: 8rpx;
	padding: 20rpx;
}

.history-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12rpx;
	padding-bottom: 12rpx;
	border-bottom: 1rpx solid #e8e8e8;
}

.history-node {
	font-size: 28rpx;
	font-weight: 700;
	color: #333;
}

.history-time {
	font-size: 22rpx;
	color: #999;
}

.history-info {
	display: flex;
	align-items: flex-start;
	margin-bottom: 8rpx;
	font-size: 24rpx;
}

.history-info:last-child {
	margin-bottom: 0;
}

.history-label {
	color: #999;
	flex-shrink: 0;
	width: 140rpx;
}

.history-value {
	color: #333;
	flex: 1;
}

.text-success {
	color: #4caf50;
}

.text-danger {
	color: #f44336;
}
</style>
