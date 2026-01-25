<template>
	<view class="page">
		<view class="summary">
			<view class="card">
				<text class="big">1000</text>
				<text class="label">计划数</text>
			</view>
			<view class="card">
				<text class="big">951</text>
				<text class="label">完成数</text>
			</view>
			<view class="card">
				<text class="big">95.1</text>
				<text class="label">准时率(%)</text>
			</view>
		</view>

		<scroll-view class="list" scroll-y="true">
			<view class="item" v-for="item in items" :key="item.id" @click="openDetail(item)">
				<view class="item-left">
					<text class="code">{{ item.code }}</text>
					<view class="meta">
						<text>产品名称</text><text class="meta-value">{{ item.productName }}</text>
						<text>计划数量</text><text class="meta-value">{{ item.planQty }}</text>
					</view>
				</view>
				<view class="item-right">
					<text class="spec">{{ item.spec }}</text>
					<text class="qty">完工数量 {{ item.finishQty }}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
const items = ref([
	{ id: 1, code: 'SCJHBH00000001', productName: '笔记本电脑', spec: '300*400mm', planQty: 1000, finishQty: 990 },
	{ id: 2, code: 'SCJHBH00000002', productName: '笔记本电脑', spec: '300*400mm', planQty: 1000, finishQty: 990 },
	{ id: 3, code: 'SCJHBH00000003', productName: '笔记本电脑', spec: '300*400mm', planQty: 1000, finishQty: 990 },
])

function openDetail(item) {
	if (!item) return
	uni.navigateTo({ url: `/pages/workbench/product-management/product-on-time/detail?id=${item.id}` })
}
</script>

<style>
.page { padding: 24rpx; background: #f7f6fb; min-height: 100vh; }
.summary { display:flex; gap:20rpx; margin-bottom:20rpx; }
.card { background:#fff; padding:20rpx; border-radius:12rpx; flex:1; text-align:center; box-shadow:0 6rpx 16rpx rgba(0,0,0,0.03); }
.big { font-size:36rpx; color:#4a6cff; font-weight:700; display:block; margin-bottom:8rpx; }
.label { color:#9b9b9b; font-size:24rpx; }
.list { min-height:60vh; }
.item { background:#fff; padding:20rpx; border-radius:12rpx; margin-bottom:14rpx; display:flex; justify-content:space-between; align-items:flex-start; box-shadow:0 6rpx 16rpx rgba(0,0,0,0.03); }
.code { font-weight:700; font-size:28rpx; color:#2b2b2b; display:block; margin-bottom:8rpx; }
.meta { color:#9b9b9b; font-size:24rpx; display:flex; gap:12rpx; flex-wrap:wrap; }
.meta-value { color:#2b2b2b; margin-left:6rpx; }
.spec { color:#9b9b9b; font-size:24rpx; }
.qty { color:#9b9b9b; font-size:24rpx; margin-top:8rpx; text-align:right; display:block; }
</style>

