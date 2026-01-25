<template>
	<view class="detail-page">
		<view class="card">
			<view class="row"><text class="label">工单编号</text><text class="value">{{ detail.code }}</text></view>
			<view class="row"><text class="label">产品名称</text><text class="value">{{ detail.productName }}</text></view>
			<view class="row"><text class="label">生产状态</text><text class="value">{{ detail.status }}</text></view>
			<view class="row"><text class="label">生产数量</text><text class="value">{{ detail.quantity }}</text></view>
			<view class="row"><text class="label">生产车间</text><text class="value">{{ detail.workshop }}</text></view>
			<view class="row"><text class="label">加工工序</text><text class="value">{{ detail.step }}</text></view>
			<view class="row"><text class="label">已报工</text><text class="value">{{ detail.reported }}</text></view>
			<view class="row"><text class="label">单位</text><text class="value">{{ detail.unit }}</text></view>
		</view>
		<view class="footer-actions">
			<button class="btn" @click="openStart">开工</button>
			<button class="btn" @click="openReport">报工</button>
			<button class="btn danger" @click="openAbnormal">异常填报</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const detail = ref({
	code: '',
	productName: '',
	status: '待生产',
	quantity: 0,
	workshop: '',
	step: '',
	reported: 0,
	unit: '台'
})

onLoad((options) => {
	const code = decodeURIComponent(options?.code || '')
	if (!code) return
	// demo: fill with mock data
	detail.value = { code, productName: '笔记本电脑', status: '生产中', quantity: 1000, workshop: '第一生产车间', step: '第一道工序', reported: 800, unit: '台' }
})

function openStart() {
	uni.showToast({ title: '开工', icon: 'none' })
}
function openReport() {
	uni.navigateTo({ url: `/pages/workbench/product-management/product-record-sub/report?code=${encodeURIComponent(detail.value.code)}` })
}
function openAbnormal() {
	uni.navigateTo({ url: `/pages/workbench/product-management/product-record-sub/abnormal?code=${encodeURIComponent(detail.value.code)}` })
}
</script>

<style scoped>
.detail-page { padding: 20rpx; background: #f7f6fb; min-height: 100vh; padding-bottom: 120rpx; }
.card { background: #fff; border-radius: 12rpx; padding: 16rpx; margin-bottom: 14rpx; box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.04); }
.row { display:flex; justify-content: space-between; padding: 12rpx 0; border-bottom: 1rpx solid #f1f1f6; align-items:center; }
.label { color: #9b9b9b; font-size: 22rpx; }
.value { color:#333; font-size:22rpx; }
.footer-actions { position: fixed; left:0; right:0; bottom: 20rpx; display:flex; gap:12rpx; padding: 12rpx; justify-content:center; background: transparent; }
.btn { background:#eef4ff; color:#4a6df6; padding:12rpx 24rpx; border-radius:40rpx; }
.danger { background:#fff0f0; color:#ff6b6b; }
</style>

