<template>
	<view class="page">
		<view class="nav">
			<text class="back" @click="goBack">←</text>
			<text class="title">报工记录</text>
		</view>

		<scroll-view class="list" scroll-y="true">
			<view class="card" v-for="item in records" :key="item.id" @click="openDetail(item)">
				<view class="row top">
					<text class="badge">普通</text>
					<text class="code">{{ item.recordNo }}</text>
				</view>
				<view class="row">
					<text class="label">产品名称</text>
					<text class="value">{{ item.productName }}</text>
				</view>
				<view class="row">
					<text class="label">加工工序</text>
					<text class="value">{{ item.process }}</text>
				</view>
				<view class="row">
					<text class="label">合格数量</text>
					<text class="value">{{ item.passQty }}</text>
					<text class="label right">不合格数</text>
					<text class="value">{{ item.failQty }}</text>
				</view>
				<view class="row time">
					<text>报工时间</text>
					<text class="value">{{ item.time }}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { reactive } from 'vue'
const records = reactive([
	{
		id: '1',
		recordNo: 'BGJLBH0000001',
		productName: '笔记本电脑',
		process: '第一道工序',
		passQty: 100,
		failQty: 18,
		time: '2025.08.01 18:00:00'
	},
	{
		id: '2',
		recordNo: 'BGJLBH0000002',
		productName: '笔记本电脑',
		process: '第一道工序',
		passQty: 80,
		failQty: 5,
		time: '2025.08.02 09:20:00'
	}
])

function goBack() {
	uni.navigateBack()
}

function openDetail(item) {
	if (!item || !item.id) return
	uni.navigateTo({ url: `/pages/workbench/product-management/work-record/detail?id=${item.id}` })
}
</script>

<style>
.page {
	padding: 24rpx;
	background: #f7f6fb;
	min-height: 100vh;
}
.nav {
	display:flex;
	align-items:center;
	gap:12rpx;
	margin-bottom:12rpx;
}
.back {
	font-size: 34rpx;
}
.title {
	font-size: 32rpx;
	font-weight:700;
}
.list {
	margin-top: 8rpx;
}
.card {
	background:#fff;
	padding:20rpx;
	border-radius:12rpx;
	margin-bottom:18rpx;
	box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.04);
}
.row {
	display:flex;
	align-items:center;
	justify-content:space-between;
	margin-bottom:8rpx;
}
.top {
	justify-content:flex-start;
	gap:12rpx;
	margin-bottom:12rpx;
}
.badge {
	background:#eef6ff;
	color:#3b82f6;
	padding:6rpx 10rpx;
	border-radius:8rpx;
	font-size:24rpx;
}
.code {
	font-weight:700;
	font-size:28rpx;
}
.label {
	color:#666;
	font-size:24rpx;
}
.value {
	color:#111;
	font-size:24rpx;
}
.right {
	margin-left:auto;
	margin-right:8rpx;
}
.time {
	justify-content:flex-start;
	gap:12rpx;
	color:#999;
	font-size:22rpx;
}
</style>

