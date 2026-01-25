<template>
	<view class="select-page">
		<scroll-view class="list" scroll-y>
			<view class="item" v-for="(w, idx) in items" :key="idx" @click="select(w)">
				<radio :value="w.name" :checked="selected && selected.id === w.id"></radio>
				<text class="name">{{ w.name }}</text>
			</view>
		</scroll-view>

		<button class="confirm" @click="confirm">确定</button>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
	{ id: 1, name: '第一生产产线' },
	{ id: 2, name: '第二生产产线' },
	{ id: 3, name: '第三生产产线' },
])
const selected = ref(null)

function select(w) {
	selected.value = w
}

function confirm() {
	if (!selected.value) {
		uni.showToast({ title: '请选择生产产线', icon: 'none' })
		return
	}
	uni.setStorageSync('product_plan_selected_line', selected.value)
	uni.navigateBack()
}
</script>

<style scoped>
.select-page {
	padding: 20rpx;
	background: #f7f6fb;
	min-height: 100vh;
	padding-bottom: 140rpx;
}
.list {
	margin-top: 10rpx;
}
.item {
	background: #fff;
	padding: 18rpx;
	border-radius: 12rpx;
	margin-bottom: 12rpx;
	display: flex;
	align-items: center;
	gap: 12rpx;
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

