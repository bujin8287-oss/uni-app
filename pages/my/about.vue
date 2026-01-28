<template>
	<view class="about-page">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="header-title">关于我们</text>
			<view class="header-right"></view>
		</view>

		<view class="content">
			<view class="logo-section">
				<text class="logo-icon">⚙️⚙️</text>
				<text class="platform-title">生产制造执行平台</text>
				<text class="platform-subtitle">Manufacturing Execution Platform</text>
			</view>

			<view class="description">
				<text class="desc-text">以数据驱动为核心，通过构建互联互通的智能生产网络，无缝集成生产线上各类设备与信息系统。依托实时数据采集与深度分析能力，系统为生产管理人员提供精准的决策依据，有效规避经验主义决策带来的风险。其功能覆盖生产全链条，从订销售订单的关联录入，到生产计划与调度的动态优化，再到生产过程的精细化控制、质量管控的全流程追溯、设备维护的预防性管理，并配合仓储管理的智能调配，形成闭环管理体系。</text>
			</view>
		</view>
	</view>
</template>

<script setup>
function goBack() {
	uni.navigateBack()
}
</script>

<style scoped>
.about-page {
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
	padding: 80rpx 40rpx 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.logo-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 80rpx;
}

.logo-icon {
	font-size: 140rpx;
	margin-bottom: 40rpx;
	letter-spacing: -20rpx;
}

.platform-title {
	font-size: 40rpx;
	font-weight: 700;
	color: #7c66ff;
	margin-bottom: 16rpx;
	letter-spacing: 2rpx;
}

.platform-subtitle {
	font-size: 26rpx;
	color: #a8a8b8;
	letter-spacing: 1rpx;
}

.description {
	width: 100%;
	padding: 0 20rpx;
}

.desc-text {
	font-size: 30rpx;
	line-height: 52rpx;
	color: #333;
	text-align: justify;
	letter-spacing: 0.5rpx;
}
</style>
