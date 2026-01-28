<template>
	<view class="select-page">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="header-title">处理结果</text>
			<view class="header-right"></view>
		</view>

		<view class="content-card">
			<view 
				class="list-item" 
				v-for="item in resultOptions" 
				:key="item.value"
				@click="selectItem(item.value)"
			>
				<view class="radio-wrapper">
					<view :class="['radio', selectedValue === item.value ? 'checked' : '']">
						<view v-if="selectedValue === item.value" class="radio-dot"></view>
					</view>
					<text class="item-text">{{ item.label }}</text>
				</view>
			</view>
		</view>

		<view class="submit-bar">
			<button class="submit-btn" @click="handleConfirm">确定</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const selectedValue = ref('')

const resultOptions = [
	{ label: '已恢复正常', value: 'normal' },
	{ label: '缺少零部件,暂时挂起', value: 'suspended' },
	{ label: '未找到原因', value: 'unknown' }
]

onLoad((options) => {
	if (options.current) {
		selectedValue.value = decodeURIComponent(options.current)
	}
})

function selectItem(value) {
	selectedValue.value = value
}

function handleConfirm() {
	if (!selectedValue.value) {
		uni.showToast({
			title: '请选择处理结果',
			icon: 'none'
		})
		return
	}
	
	const selectedOption = resultOptions.find(item => item.value === selectedValue.value)
	const resultText = selectedOption ? selectedOption.label : selectedValue.value
	
	// 通过事件传递选中的值
	uni.$emit('abnormalResultSelected', resultText)
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

.content-card {
	background: #fff;
	border-radius: 12rpx;
	margin: 20rpx;
	padding: 0;
	box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
}

.list-item {
	padding: 32rpx 24rpx;
	border-bottom: 1rpx solid #f5f5f5;
}

.list-item:last-child {
	border-bottom: none;
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
