<template>
	<view class="page">
		<view class="card">
			<view class="row"><text class="label">过程检验编号</text><text class="value">{{ code }}</text></view>
			<view class="row"><text class="label">检验物料名称</text><text class="value">内存条</text></view>
			<view class="row"><text class="label">检验数量</text><text class="value">1000</text></view>
			<view class="row"><text class="label">合格数量</text><text class="value">995</text></view>
			<view class="row"><text class="label">不合格数量</text><text class="value">5</text></view>
			<view class="row"><text class="label">检验人</text><text class="value">刘超</text></view>
			<view class="row"><text class="label">检验时间</text><text class="value">2025.04.24 14:00:00</text></view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const code = ref('')

onLoad((options) => {
	code.value = options.code || ''
})
</script>

<style>
.page { padding: 24rpx; background: #f7f6fb; min-height: 100vh; }
.card { background:#fff; border-radius:12rpx; padding:20rpx; }
.row { display:flex; justify-content:space-between; padding:12rpx 0; border-bottom:1rpx solid #f0f0f0; }
.label { color:#666; }
.value { color:#222; font-weight:600; }
</style>

