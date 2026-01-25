<template>
	<view class="page">
		<view class="nav">
			<text class="back" @click="goBack">←</text>
			<text class="title">报工详情</text>
		</view>

		<view class="card">
			<view class="row">
				<text class="label">报工记录编号</text>
				<text class="value">{{ detail.recordNo }}</text>
			</view>
			<view class="row">
				<text class="label">工单编号</text>
				<text class="value">{{ detail.workOrderNo }}</text>
			</view>
			<view class="row">
				<text class="label">工单名称</text>
				<text class="value">{{ detail.workOrderName }}</text>
			</view>
			<view class="row">
				<text class="label">紧急程度</text>
				<text class="value">{{ detail.urgency }}</text>
			</view>
			<view class="row">
				<text class="label">产品编号</text>
				<text class="value">{{ detail.productCode }}</text>
			</view>
			<view class="row">
				<text class="label">产品名称</text>
				<text class="value">{{ detail.productName }}</text>
			</view>
			<view class="row">
				<text class="label">生产车间</text>
				<text class="value">{{ detail.workshop }}</text>
			</view>
			<view class="row">
				<text class="label">加工工序</text>
				<text class="value">{{ detail.process }}</text>
			</view>
			<view class="row">
				<text class="label">生产状态</text>
				<text class="value">{{ detail.status }}</text>
			</view>
			<view class="row">
				<text class="label">报工班组</text>
				<text class="value">{{ detail.group }}</text>
			</view>
			<view class="row">
				<text class="label">报工人</text>
				<text class="value">{{ detail.employee }}</text>
			</view>
			<view class="row">
				<text class="label">工时(分)</text>
				<text class="value">{{ detail.workMinutes }}</text>
			</view>
			<view class="row">
				<text class="label">报工合格数</text>
				<text class="value">{{ detail.passQty }}</text>
			</view>
			<view class="row">
				<text class="label">报工不合格数</text>
				<text class="value">{{ detail.failQty }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const detail = reactive({
	recordNo: '',
	workOrderNo: '',
	workOrderName: '',
	urgency: '',
	productCode: '',
	productName: '',
	workshop: '',
	process: '',
	status: '',
	group: '',
	employee: '',
	workMinutes: 0,
	passQty: 0,
	failQty: 0
})

function goBack() {
	uni.navigateBack()
}

onLoad((options) => {
	// 使用路由参数 id 加载真实数据；这里使用静态样例数据以匹配设计稿
	const id = options && options.id
	if (id) {
		// mock 数据填充
		detail.recordNo = 'BGJLBH0000001'
		detail.workOrderNo = 'GDBH0000001'
		detail.workOrderName = '外贸生产一工单'
		detail.urgency = '普通'
		detail.productCode = 'CPBH000001'
		detail.productName = '笔记本电脑'
		detail.workshop = '第一生产车间'
		detail.process = '第一道工序'
		detail.status = '生产中'
		detail.group = '第一班组'
		detail.employee = '张奎'
		detail.workMinutes = 480
		detail.passQty = 100
		detail.failQty = 18
	}
})
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
.card {
	background:#fff;
	padding:20rpx;
	border-radius:12rpx;
	box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.04);
}
.row {
	display:flex;
	justify-content:space-between;
	padding:14rpx 0;
	border-bottom:1rpx solid #f0f0f0;
}
.label {
	color:#666;
	font-size:24rpx;
}
.value {
	color:#111;
	font-size:24rpx;
}
</style>

