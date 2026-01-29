<template>
	<view class="bottom-nav">
		<view class="nav-item" :class="{ active: active === 'index' }" @click="switchTo('index')">
			<text class="nav-icon">🏠</text>
			<text class="nav-text">首页</text>
		</view>
		<view class="nav-item" :class="{ active: active === 'abnormal' }" @click="switchTo('abnormal')">
			<text class="nav-icon">⚠️</text>
			<text class="nav-text">异常</text>
		</view>

		<view class="nav-center" @click="switchTo('workbench')">
			<text class="center-icon">工作台</text>
		</view>

		<view class="nav-item" :class="{ active: active === 'todo' }" @click="switchTo('todo')">
			<text class="nav-icon">📥</text>
			<text class="nav-text">待办</text>
		</view>
		<view class="nav-item" :class="{ active: active === 'my' }" @click="switchTo('my')">
			<text class="nav-icon">👤</text>
			<text class="nav-text">我的</text>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const active = ref('index')

function updateActive() {
	const pages = getCurrentPages && getCurrentPages()
	if (!pages || pages.length === 0) return
	const route = '/' + (pages[pages.length - 1].route || '')
	if (route.includes('/pages/index/index')) active.value = 'index'
	else if (route.includes('/pages/abnormal/index')) active.value = 'abnormal'
	else if (route.includes('/pages/workbench/index')) active.value = 'workbench'
	else if (route.includes('/pages/todo/index')) active.value = 'todo'
	else if (route.includes('/pages/my/index')) active.value = 'my'
}

onShow(() => {
	updateActive()
})

function switchTo(key) {
	const routes = {
		index: '/pages/index/index',
		abnormal: '/pages/abnormal/index',
		workbench: '/pages/workbench/index',
		todo: '/pages/todo/index',
		my: '/pages/my/index',
	}
	const url = routes[key]
	if (!url) return
	uni.reLaunch({ url })
}
</script>

<style>
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
	box-shadow: 0 -6rpx 20rpx rgba(0, 0, 0, 0.06);
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
.nav-item.active .nav-text {
	color: #5b4bff;
	font-weight: 700;
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
	background: linear-gradient(180deg, #6a5bff, #8b6cff);
	display: flex;
	justify-content: center;
	align-items: center;
	color: #fff;
	font-weight: 700;
	font-size: 26rpx;
	box-shadow: 0 10rpx 30rpx rgba(107, 84, 255, 0.2);
	margin-bottom: 30rpx;
}
</style>

