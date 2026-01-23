<template>
	<view class="app-root">
		<slot></slot>
		<!-- 自定义底部导航组件 -->
		
	</view>
</template>

<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
onLaunch(() => {
	console.log('App Launch')
})
onShow(() => {
	console.log('App Show')
})
onHide(() => {
	console.log('App Hide')
})
import BottomNav from '@/components/business/BottomNav.vue'
</script>

<style>
.app-root { padding-bottom: 140rpx; min-height: 100vh; background: #f7f6fb; }

.bottom-nav {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	height: 120rpx;
	display: flex;
	justify-content: space-around;
	align-items: center;
	background: #fff;
	box-shadow: 0 -6rpx 20rpx rgba(0,0,0,0.06);
	z-index: 1000;
	padding-left: 20rpx;
	padding-right: 20rpx;
}
.nav-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 120rpx;
}
.nav-icon {
	font-size: 32rpx;
}
.nav-text {
	font-size: 22rpx;
	color: #666;
	margin-top: 6rpx;
}
.nav-center {
	width: 110rpx;
	height: 110rpx;
	border-radius: 55rpx;
	background: linear-gradient(180deg,#6a5bff,#8b6cff);
	display: flex;
	justify-content: center;
	align-items: center;
	color: #fff;
	font-weight: 700;
	font-size: 26rpx;
	box-shadow: 0 10rpx 30rpx rgba(107,84,255,0.2);
	margin-bottom: 30rpx;
}
.center-icon {
	color: #fff;
}
</style>
