<template>
	<view class="page">
		<view class="header-stats">
			<view class="stat">
				<text class="stat-num">589</text>
				<text class="stat-label">计划数</text>
			</view>
			<view class="stat">
				<text class="stat-num">527</text>
				<text class="stat-label">完成数</text>
			</view>
			<view class="stat">
				<text class="stat-num">99.1</text>
				<text class="stat-label">达成率(%)</text>
			</view>
		</view>

		<scroll-view class="list" scroll-y>
			<view class="card" v-for="item in list" :key="item.planNo" @click="openDetail(item)">
				<text class="title">{{ item.planNo }}</text>
				<view class="row">
					<text class="k">产品名称</text>
					<text class="v">{{ item.productName }}</text>
					<text class="k right">规格型号</text>
					<text class="v">{{ item.spec }}</text>
				</view>
				<view class="row">
					<text class="k">计划数量</text>
					<text class="v">{{ item.planQty }}</text>
					<text class="k right">完工数量</text>
					<text class="v">{{ item.finishedQty }}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const list = ref([
	{ planNo: 'SCJHBH00000001', productName: '笔记本电脑', spec: '300*400mm', planQty: 1000, finishedQty: 990 },
	{ planNo: 'SCJHBH00000002', productName: '笔记本电脑', spec: '300*400mm', planQty: 1000, finishedQty: 990 },
	{ planNo: 'SCJHBH00000003', productName: '笔记本电脑', spec: '300*400mm', planQty: 1000, finishedQty: 990 },
])

function openDetail(item) {
	if(!item) return
	uni.navigateTo({ url: `/pages/workbench/product-management/product-complete/detail?planNo=${encodeURIComponent(item.planNo)}` })
}
</script>

<style>
.page {
	padding: 24rpx;
	background: #f7f8fb;
	min-height: 100vh;
}
.header-stats {
	display:flex;
	justify-content:space-between;
	margin-bottom:20rpx;
}
.stat {
	background:#fff;
	padding:20rpx;
	border-radius:12rpx;
	width:30%;
	text-align:center;
	box-shadow:0 6rpx 16rpx rgba(0,0,0,0.03);
}
.stat-num { font-size:36rpx; color:#3377cc; font-weight:700; }
.stat-label { font-size:22rpx; color:#666; margin-top:6rpx; display:block; }
.list { height: calc(100vh - 220rpx); }
.card {
	background:#fff;
	padding:20rpx;
	border-radius:12rpx;
	margin-bottom:16rpx;
	box-shadow:0 6rpx 14rpx rgba(0,0,0,0.03);
}
.title { font-weight:700; font-size:28rpx; margin-bottom:12rpx; display:block; }
.row { display:flex; align-items:center; gap:10rpx; color:#666; font-size:22rpx; margin-top:6rpx; }
.k { width:160rpx; color:#999; }
.v { flex:1; text-align:left; color:#333; }
.right { text-align:right; width:160rpx; }
</style>

