<template>
	<view class="profile-page">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="header-title">个人资料</text>
			<view class="header-right"></view>
		</view>

		<view class="content">
			<view class="info-card">
				<view class="info-item" @click="chooseAvatar">
					<text class="info-label">我的头像</text>
					<view class="info-value-wrap">
						<image class="avatar-img" :src="profileData.avatar" mode="aspectFill" />
						<text class="arrow">›</text>
					</view>
				</view>
				<view class="info-item">
					<text class="info-label">我的姓名</text>
					<view class="info-value-wrap">
						<text class="info-value">{{ profileData.name }}</text>
						<text class="arrow">›</text>
					</view>
				</view>
				<view class="info-item">
					<text class="info-label">我的职位</text>
					<view class="info-value-wrap">
						<text class="info-value">{{ profileData.position }}</text>
						<text class="arrow">›</text>
					</view>
				</view>
				<view class="info-item">
					<text class="info-label">所在部门</text>
					<view class="info-value-wrap">
						<text class="info-value">{{ profileData.department }}</text>
						<text class="arrow">›</text>
					</view>
				</view>
				<view class="info-item">
					<text class="info-label">所在公司</text>
					<view class="info-value-wrap">
						<text class="info-value">{{ profileData.company }}</text>
						<text class="arrow">›</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { reactive } from 'vue'

const profileData = reactive({
	avatar: '/static/logo.png',
	name: '刘明湘',
	position: '车间负责人',
	department: '生产部',
	company: '华某产业股份有限公司'
})

function chooseAvatar() {
	uni.chooseImage({
		count: 1,
		sizeType: ['compressed'],
		sourceType: ['album', 'camera'],
		success: (res) => {
			profileData.avatar = res.tempFilePaths[0]
			uni.showToast({ title: '头像已更新', icon: 'success' })
		}
	})
}

function goBack() {
	uni.navigateBack()
}
</script>

<style scoped>
.profile-page {
	background: #f5f5f5;
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
	font-size: 34rpx;
	font-weight: 600;
	color: #333;
}

.header-right {
	width: 60rpx;
}

.content {
	flex: 1;
	padding: 20rpx;
}

.info-card {
	background: #fff;
	border-radius: 16rpx;
	overflow: hidden;
}

.info-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 32rpx 32rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.info-item:last-child {
	border-bottom: none;
}

.info-label {
	color: #333;
	font-size: 30rpx;
	flex-shrink: 0;
}

.info-value-wrap {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.info-value {
	color: #666;
	font-size: 30rpx;
	text-align: right;
}

.avatar-img {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50rpx;
	background: #e8e8f0;
}

.arrow {
	color: #d0d0d0;
	font-size: 32rpx;
}
</style>
