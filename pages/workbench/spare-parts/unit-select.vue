<template>
	<view class="select-page">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="header-title">选择单位</text>
			<view class="header-right"></view>
		</view>

		<scroll-view class="list-scroll" scroll-y>
			<view 
				class="item" 
				v-for="item in units" 
				:key="item.id"
				@click="selectItem(item)"
			>
				<text class="item-text">{{ item.name }}</text>
				<text v-if="currentUnit === item.name" class="check-icon">✓</text>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getUnits } from '@/api/mock.js'

const units = ref([])
const currentUnit = ref('')

onLoad((options) => {
	if (options.current) {
		currentUnit.value = decodeURIComponent(options.current)
	}
	loadUnits()
})

async function loadUnits() {
	try {
		const res = await getUnits()
		if (res.code === 0) {
			units.value = res.data
		}
	} catch (error) {
		uni.showToast({
			title: '加载失败',
			icon: 'none'
		})
	}
}

function selectItem(item) {
	uni.$emit('unitSelected', item.name)
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

.item {
	background: #fff;
	padding: 28rpx 24rpx;
	margin-bottom: 16rpx;
	border-radius: 12rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.item-text {
	font-size: 28rpx;
	color: #333;
}

.check-icon {
	font-size: 32rpx;
	color: #7c66ff;
	font-weight: 700;
}
</style>
