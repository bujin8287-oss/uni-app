<template>
	<view class="select-page">

		<view class="card">
			<view class="item" v-for="u in units" :key="u" @click="select(u)">
				<radio :value="u" :checked="selected === u"></radio>
				<text class="name">{{ u }}</text>
			</view>
		</view>

		<button class="confirm" @click="confirm">确定</button>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const units = ref([])
const selected = ref(null)

// 从 mock api 获取单位（这里复用静态数据 via api 模拟）
async function loadUnits() {
	// 直接使用本地数组，但保留异步接口以便以后替换
	units.value = ['吨', '件', '台', '个', '部']
}

function select(u) { selected.value = u }
function confirm() {
	if (!selected.value) return uni.showToast({ title: '请选择单位', icon: 'none' })
	uni.setStorageSync('sales_order_selected_unit', selected.value)
	uni.navigateBack()
}
function goBack() { uni.navigateBack() }

onMounted(() => {
	loadUnits()
})
</script>

<style scoped>
.select-page {
	padding: 20rpx;
	background: #f7f6fb;
	min-height: 100vh;
	padding-bottom: 140rpx;
}


.header-title {
	font-size: 28rpx;
	font-weight: 700;
	flex: 1;
	text-align: center;
	margin-right: 36rpx;
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
