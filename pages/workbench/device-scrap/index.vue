<template>
	<view class="scrap-page">
		<!-- 自定义导航栏 -->
		<view class="custom-nav">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">设备报废</text>
			<view class="nav-right" @click="goToAdd">
				<text class="add-btn">新增</text>
			</view>
		</view>

		<!-- 报废设备列表 -->
		<scroll-view class="list" scroll-y>
			<view class="scrap-card" v-for="item in scrapList" :key="item.id" @click="openDetail(item)">
				<view class="card-header">
					<text class="device-code">{{ item.code }}</text>
					<view class="arrow">›</view>
				</view>
				<view class="card-body">
					<view class="info-row">
						<view class="info-item">
							<text class="label">设备名称</text>
							<text class="value">{{ item.name }}</text>
						</view>
					</view>
					<view class="info-row">
						<view class="info-item">
							<text class="label">使用年限</text>
							<text class="value">{{ item.serviceLife }}</text>
						</view>
						<view class="info-item">
							<text class="label">报废时间</text>
							<text class="value">{{ item.scrapDate }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 空状态 -->
			<view v-if="scrapList.length === 0 && !loading" class="empty-state">
				<text class="empty-text">暂无报废设备</text>
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
import { getDeviceScrapList } from '../../../api/mock.js'

const scrapList = ref([])
const loading = ref(false)

onMounted(() => {
	loadScrapList()
})

async function loadScrapList() {
	loading.value = true
	try {
		const res = await getDeviceScrapList()
		if (res.code === 0) {
			scrapList.value = res.data
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
		url: `/pages/workbench/device-scrap/detail?id=${item.id}&code=${encodeURIComponent(item.code)}` 
	})
}

function goBack() {
	uni.navigateBack()
}

function goToAdd() {
	uni.navigateTo({ url: '/pages/workbench/device-scrap/add' })
}
</script>

<style>
.scrap-page {
	background: #f7f6fb;
	min-height: 100vh;
}

.custom-nav {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 88rpx;
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 24rpx;
	z-index: 100;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.nav-left {
	width: 80rpx;
}

.back-icon {
	font-size: 48rpx;
	color: #333;
	line-height: 1;
}

.nav-title {
	font-size: 32rpx;
	font-weight: 700;
	color: #333;
}

.nav-right {
	width: 80rpx;
	display: flex;
	justify-content: flex-end;
}

.add-btn {
	color: #7C66FF;
	font-size: 28rpx;
}

.list {
	height: calc(100vh - 88rpx);
	margin-top: 88rpx;
	padding: 20rpx;
	padding-bottom: 40rpx;
	box-sizing: border-box;
}

.scrap-card {
	background: #fff;
	padding: 24rpx;
	margin-bottom: 16rpx;
	border-radius: 12rpx;
	box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
}

.card-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16rpx;
}

.device-code {
	font-size: 32rpx;
	font-weight: 700;
	color: #333;
}

.arrow {
	color: #cfcfe6;
	font-size: 32rpx;
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
