<template>
	<view class="repair-page">
		<!-- 维修单列表 -->
		<scroll-view class="list" scroll-y>
			<view class="repair-card" v-for="item in repairList" :key="item.id" @click="openDetail(item)">
				<view class="card-header">
					<text class="repair-code">{{ item.code }}</text>
					<view :class="['status-tag', item.status]">
						<text class="status-text">{{ item.statusText }}</text>
					</view>
					<view class="arrow">›</view>
				</view>
				<view class="card-body">
					<view class="info-row">
						<view class="info-item">
							<text class="label">报修设备</text>
							<text class="value">{{ item.deviceName }}</text>
						</view>
						<view class="info-item">
							<text class="label">报修人</text>
							<text class="value">{{ item.reporter }}</text>
						</view>
					</view>
					<view class="info-row">
						<view class="info-item">
							<text class="label">报修部门</text>
							<text class="value">{{ item.department }}</text>
						</view>
						<view class="info-item">
							<text class="label">报修时间</text>
							<text class="value">{{ item.reportTime }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 空状态 -->
			<view v-if="repairList.length === 0 && !loading" class="empty-state">
				<text class="empty-text">暂无维修记录</text>
			</view>

			<!-- 加载状态 -->
			<view v-if="loading" class="loading-state">
				<text class="loading-text">加载中...</text>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDeviceRepairList } from '../../../api/mock.js'

const repairList = ref([])
const loading = ref(false)

onMounted(() => {
	loadRepairList()
})

async function loadRepairList() {
	loading.value = true
	try {
		const res = await getDeviceRepairList()
		if (res.code === 0) {
			repairList.value = res.data
		} else {
			uni.showToast({ title: '加载失败', icon: 'none' })
		}
	} catch (error) {
		uni.showToast({ title: '网络错误', icon: 'none' })
	} finally {
		loading.value = false
	}
}

function openDetail(item) {
	uni.navigateTo({ 
		url: `/pages/workbench/device-repair/detail?id=${item.id}&code=${encodeURIComponent(item.code)}` 
	})
}
</script>

<style>
.repair-page {
	background: #f7f6fb;
	min-height: 100vh;
	padding: 20rpx;
	padding-bottom: 40rpx;
	box-sizing: border-box;
}

.list {
	height: calc(100vh - 40rpx);
}

.repair-card {
	background: #fff;
	padding: 24rpx;
	margin-bottom: 16rpx;
	border-radius: 12rpx;
	box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
}

.card-header {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 16rpx;
}

.repair-code {
	font-size: 32rpx;
	font-weight: 700;
	color: #333;
	flex: 1;
}

.status-tag {
	padding: 6rpx 16rpx;
	border-radius: 8rpx;
	font-size: 22rpx;
	border: 1rpx solid;
}

.status-tag.pending {
	background: #f0f6ff;
	color: #5672ff;
	border-color: rgba(86, 114, 255, 0.2);
}

.status-tag.completed {
	background: #f0fff4;
	color: #52c41a;
	border-color: rgba(82, 196, 26, 0.2);
}

.status-text {
	font-size: 22rpx;
}

.arrow {
	color: #cfcfe6;
	font-size: 32rpx;
	margin-left: auto;
}

.card-body {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.info-row {
	display: flex;
	gap: 40rpx;
}

.info-item {
	display: flex;
	gap: 16rpx;
	flex: 1;
}

.label {
	color: #9b9b9b;
	font-size: 24rpx;
	flex-shrink: 0;
}

.value {
	color: #333;
	font-size: 24rpx;
}

.empty-state {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 120rpx 0;
}

.empty-text {
	color: #9b9b9b;
	font-size: 28rpx;
}

.loading-state {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 80rpx 0;
}

.loading-text {
	color: #9b9b9b;
	font-size: 26rpx;
}
</style>
