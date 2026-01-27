<template>
	<view class="select-page">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="header-title">选择设备</text>
			<view class="header-right"></view>
		</view>

		<scroll-view class="list-scroll" scroll-y>
			<view 
				class="list-item" 
				v-for="item in devices" 
				:key="item.id"
				@click="selectItem(item.name)"
			>
				<view class="radio-wrapper">
					<view :class="['radio', selectedValue === item.name ? 'checked' : '']">
						<view v-if="selectedValue === item.name" class="radio-dot"></view>
					</view>
					<text class="item-text">{{ item.name }}</text>
				</view>
			</view>
		</scroll-view>

		<view class="submit-bar">
			<button class="submit-btn" @click="handleConfirm">确定</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const selectedValue = ref('')

const devices = ref([
	{ id: 1, name: '螺杆式空压机' },
	{ id: 2, name: '活塞式空压机' },
	{ id: 3, name: '离心式空压机' },
	{ id: 4, name: '空气干燥机' },
	{ id: 5, name: '精密过滤器' },
	{ id: 6, name: '储气罐' },
	{ id: 7, name: '螺杆式冷水机' },
	{ id: 8, name: '风冷式冷水机' },
	{ id: 9, name: '水冷式冷水机' },
	{ id: 10, name: '工业冷却塔' },
	{ id: 11, name: '离心风机' },
	{ id: 12, name: '轴流风机' },
	{ id: 13, name: '罗茨风机' }
])

onLoad((options) => {
	if (options.current) {
		selectedValue.value = decodeURIComponent(options.current)
	}
})

function selectItem(name) {
	selectedValue.value = name
}

function handleConfirm() {
	if (!selectedValue.value) {
		uni.showToast({
			title: '请选择设备',
			icon: 'none'
		})
		return
	}
	
	uni.$emit('deviceSelected', selectedValue.value)
	uni.navigateBack()
}

function goBack() {
	uni.navigateBack()
}
</script>

<style scoped>
.select-page {
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

.list-scroll {
	flex: 1;
	padding: 20rpx;
}

.list-item {
	background: #fff;
	padding: 32rpx 24rpx;
	margin-bottom: 16rpx;
	border-radius: 12rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.radio-wrapper {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.radio {
	width: 36rpx;
	height: 36rpx;
	border: 2rpx solid #d0d0d0;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.radio.checked {
	border-color: #7c66ff;
}

.radio-dot {
	width: 20rpx;
	height: 20rpx;
	background: #7c66ff;
	border-radius: 50%;
}

.item-text {
	font-size: 28rpx;
	color: #333;
	flex: 1;
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
</style>
