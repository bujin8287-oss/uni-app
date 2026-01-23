<template>
	<view class="feature-page">
		<view class="header">
			<text class="title">{{ name }}</text>
		</view>
		<view class="body">
			<text>这是“{{ name }}”的占位页面，你可以在这里实现具体功能。</text>
			<button @click="goBack" class="btn">返回</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from '@dcloudio/uni-app'

const route = useRoute()
const name = ref(route.query.name || '功能页面')

function goBack() {
	uni.navigateBack()
}
</script>

<style>
.feature-page { padding: 30rpx; background: #fff; min-height: 100vh; }
.header .title { font-size: 34rpx; font-weight: 700; margin-bottom: 20rpx; }
.body { font-size: 26rpx; color: #666; }
.btn { margin-top: 30rpx; padding: 14rpx 20rpx; background: #5b4bff; color: #fff; border-radius: 10rpx; }
</style>

