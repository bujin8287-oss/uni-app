<template>
	<view class="select-page">

		<view class="card">
			<view class="item" v-for="(s, idx) in options" :key="idx" @click="select(s)">
				<radio :value="s" :checked="selected === s"></radio>
				<text class="name">{{ s }}</text>
			</view>
		</view>

		<button class="confirm" @click="confirm">确定</button>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const options = ['普通', '紧急', '非常紧急']
const selected = ref(null)

function select(s) {
	selected.value = s
}
function confirm() {
	if (!selected.value) return uni.showToast({ title: '请选择', icon: 'none' })
	uni.setStorageSync('sales_order_selected_urgency', selected.value)
	uni.navigateBack()
}
function goBack() { uni.navigateBack() }
</script>

<style scoped>
.select-page {
	padding: 20rpx;
	background: #f7f6fb;
	min-height: 100vh;
	padding-bottom: 140rpx;
}

.card {
	background: #fff;
	border-radius: 12rpx;
	padding: 12rpx;
}

.item {
	display: flex;
	align-items: center;
	gap: 12rpx;
	padding: 16rpx 8rpx;
	border-bottom: 1rpx solid #f1f1f6;
}

.name {
	font-size: 22rpx;
}

.confirm {
	position: fixed;
	left: 20rpx;
	right: 20rpx;
	bottom: 24rpx;
	background: linear-gradient(180deg, #6a5bff, #8b6cff);
	color: #fff;
	padding: 14rpx;
	border-radius: 28rpx;
	font-size: 22rpx;
}
</style>
