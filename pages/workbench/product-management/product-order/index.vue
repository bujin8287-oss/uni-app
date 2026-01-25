<template>
	<view class="page">
		<view class="header">
			<text class="title">生产工单</text>
		</view>

		<scroll-view class="list" scroll-y>
			<view class="card" v-for="item in items" :key="item.code" @click="openDetail(item)">
				<view class="left">
					<view class="tag">普通</view>
					<text class="code">{{ item.code }}</text>
					<view class="meta">
						<text>产品名称</text><text class="value">{{ item.productName }}</text>
					</view>
					<view class="meta">
						<text>生产数量</text><text class="value">{{ item.quantity }}</text>
					</view>
					<view class="meta">
						<text>生产日期</text><text class="value">{{ item.dateRange }}</text>
					</view>
				</view>
				<view class="right">›</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const items = ref([])

async function load() {
	try {
		const res = await api.getProductOrders({ page: 1, pageSize: 20 })
		if (res && res.code === 0) {
			items.value = res.data.items || []
		}
	} catch (e) {
		console.error('getProductOrders error', e)
	}
}

function openDetail(item) {
	uni.navigateTo({ url: `/pages/workbench/product-management/product-order/detail?code=${encodeURIComponent(item.code)}` })
}

onMounted(() => {
	load()
})
</script>

<style scoped>
.page { padding: 20rpx; background: #f7f6fb; min-height: 100vh; padding-bottom: 120rpx; }
.header { margin-bottom: 12rpx; }
.title { font-size: 32rpx; font-weight: 700; }
.list { margin-top: 10rpx; }
.card { background: #fff; border-radius: 12rpx; padding: 18rpx; margin-bottom: 12rpx; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.04); }
.left { flex: 1; }
.tag { display: inline-block; background: #eaf0ff; color: #5b7cff; padding: 6rpx 10rpx; border-radius: 8rpx; font-size: 22rpx; margin-bottom: 8rpx; }
.code { display: block; font-weight: 700; font-size: 28rpx; margin-bottom: 8rpx; }
.meta { display: flex; gap: 12rpx; color: #666; margin-bottom: 6rpx; }
.value { color: #333; margin-left: 6rpx; }
.right { color: #cfcfe6; font-size: 28rpx; padding-left: 12rpx; }
</style>