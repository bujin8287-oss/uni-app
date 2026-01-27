<template>
	<view class="select-page">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="header-title">申请人</text>
			<view class="header-right"></view>
		</view>

		<scroll-view class="list-scroll" scroll-y>
			<view 
				class="list-item" 
				v-for="item in applicants" 
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

const applicants = ref([
	{ id: 1, name: '李伟' },
	{ id: 2, name: '陈曦' },
	{ id: 3, name: '王梓涵' },
	{ id: 4, name: '赵雨桐' },
	{ id: 5, name: '刘畅' },
	{ id: 6, name: '张梦琪' },
	{ id: 7, name: '陈明宇' },
	{ id: 8, name: '杨悦' },
	{ id: 9, name: '黄思睿' },
	{ id: 10, name: '周浩然' },
	{ id: 11, name: '吴桐' },
	{ id: 12, name: '马雨欣' },
	{ id: 13, name: '朱星辰' }
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
			title: '请选择申请人',
			icon: 'none'
		})
		return
	}
	
	uni.$emit('applicantSelected', selectedValue.value)
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
