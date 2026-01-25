<template>
	<view class="page-wrap">
		<view class="list">
			<view class="card" v-for="item in list" :key="item.code" @click="openDetail(item)">
				<view class="top">
					<text class="badge">普通</text>
					<text class="code">{{ item.code }}</text>
				</view>
				<view class="info">
					<view class="row"><text class="label">产品名称</text><text class="value">{{ item.productName }}</text></view>
					<view class="row"><text class="label">生产数量</text><text class="value">{{ item.quantity }}</text></view>
					<view class="row"><text class="label">加工工序</text><text class="value">{{ item.step }}</text></view>
				</view>
				<view class="actions">
					<button class="btn" @click.stop="startWork(item)">开工</button>
					<button class="btn" @click.stop="toReport(item)">报工</button>
					<button class="btn danger" @click.stop="toAbnormal(item)">异常填报</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const list = ref([
	{ code: 'GDBH0000001', productName: '笔记本电脑', quantity: 1000, step: '第一道工序' },
	{ code: 'GDBH0000002', productName: '笔记本电脑', quantity: 1000, step: '第一道工序' },
])

function openDetail(item) {
	uni.navigateTo({ url: `/pages/workbench/product-management/product-record-sub/detail?code=${encodeURIComponent(item.code)}` })
}
function startWork(item) {
	uni.showToast({ title: '开工（示例）', icon: 'none' })
}
function toReport(item) {
	uni.navigateTo({ url: `/pages/workbench/product-management/product-record-sub/report?code=${encodeURIComponent(item.code)}` })
}
function toAbnormal(item) {
	uni.navigateTo({ url: `/pages/workbench/product-management/product-record-sub/abnormal?code=${encodeURIComponent(item.code)}` })
}

onShow(() => {
	// placeholder if we need to refresh after selections
})
</script>

<style scoped>
.page-wrap { padding: 24rpx; background:#f7f8fb; min-height:100vh; }
.card { background:#fff; padding:18rpx; border-radius:12rpx; margin-bottom:16rpx; box-shadow:0 6rpx 16rpx rgba(0,0,0,0.04); }
.top { display:flex; align-items:center; gap:12rpx; margin-bottom:12rpx; }
.badge { background:#e9f3ff; color:#2a77ff; padding:6rpx 10rpx; border-radius:8rpx; font-size:22rpx; }
.code { font-weight:700; color:#333; font-size:26rpx; margin-left:8rpx; }
.row { display:flex; justify-content:space-between; padding:8rpx 0; border-bottom:1rpx solid #f1f1f6; align-items:center; }
.label { color:#9b9b9b; font-size:22rpx; }
.value { color:#333; font-size:22rpx; }
.actions { display:flex; gap:12rpx; margin-top:12rpx; }
.btn { background:#eef4ff; color:#4a6df6; padding:10rpx 18rpx; border-radius:8rpx; }
.danger { background:#fff0f0; color:#ff6b6b; }
</style>

