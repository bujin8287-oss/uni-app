<template>
	<view class="select-page">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="header-title">库位选择</text>
			<view class="header-right"></view>
		</view>

		<scroll-view class="list-scroll" scroll-y>
			<view 
				class="item" 
				v-for="item in locations" 
				:key="item.id"
				@click="selectItem(item)"
			>
				<view class="radio-icon" :class="{ checked: currentLocation === item.name }"></view>
				<text class="item-text">{{ item.name }}</text>
			</view>
		</scroll-view>

		<view class="confirm-bar">
			<button class="confirm-btn" @click="confirm">确定</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getWarehouseLocations } from '@/api/mock.js'

const locations = ref([])
const currentLocation = ref('')
const selectedLocation = ref('')

onLoad((options) => {
	if (options.current) {
		currentLocation.value = decodeURIComponent(options.current)
		selectedLocation.value = currentLocation.value
	}
	loadLocations()
})

async function loadLocations() {
	try {
		const res = await getWarehouseLocations()
		if (res.code === 0) {
			locations.value = res.data
		}
	} catch (error) {
		uni.showToast({
			title: '加载失败',
			icon: 'none'
		})
	}
}

function selectItem(item) {
	selectedLocation.value = item.name
	currentLocation.value = item.name
}

function confirm() {
	if (selectedLocation.value) {
		uni.$emit('outboundWarehouseLocationSelected', selectedLocation.value)
	}
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
	padding-bottom: 120rpx;
	box-sizing: border-box;
}

.item {
	background: #fff;
	padding: 28rpx 24rpx;
	margin-bottom: 16rpx;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	gap: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.radio-icon {
	width: 36rpx;
	height: 36rpx;
	border: 2rpx solid #cfcfe6;
	border-radius: 50%;
	flex-shrink: 0;
}

.radio-icon.checked {
	border-color: #7c66ff;
	background: #7c66ff;
	position: relative;
}

.radio-icon.checked::after {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 16rpx;
	height: 16rpx;
	background: #fff;
	border-radius: 50%;
}

.item-text {
	font-size: 28rpx;
	color: #333;
	flex: 1;
}

.confirm-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx;
	background: #fff;
	box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.confirm-btn {
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

.confirm-btn::after {
	border: none;
}
</style>
