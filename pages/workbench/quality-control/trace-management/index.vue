<template>
	<view class="trace-page">
		<view class="list">
			<view class="card" v-for="item in list" :key="item.id" @click="openDetail(item)">
				<view class="card-left">
					<text class="title">{{ item.productName }}</text>
					<view class="meta">
						<text class="label">工单编号</text>
						<text class="value">{{ item.workOrder }}</text>
					</view>
					<view class="meta">
						<text class="label">制造时间</text>
						<text class="value">{{ item.manufactureDate }}</text>
						<text class="spacer">入库时间</text>
						<text class="value">{{ item.entryDate }}</text>
					</view>
				</view>
				<view class="card-right">›</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [
				{ id: '1', productName: '笔记本电脑', workOrder: 'GDBH000001', manufactureDate: '2025.04.24', entryDate: '2025.08.01' },
				{ id: '2', productName: '笔记本电脑', workOrder: 'GDBH000002', manufactureDate: '2025.04.24', entryDate: '2025.08.01' },
				{ id: '3', productName: '笔记本电脑', workOrder: 'GDBH000003', manufactureDate: '2025.04.24', entryDate: '2025.08.01' }
			]
		}
	},
	methods: {
		openDetail(item) {
			if (!item || !item.id) return
			uni.navigateTo({ url: `/pages/workbench/quality-control/trace-management/detail?id=${item.id}` })
		}
	}
}
</script>

<style>
.trace-page {
	padding: 24rpx;
	background: #f7f6fb;
	min-height: 100vh;
}
.list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}
.card {
	background: #fff;
	padding: 20rpx;
	border-radius: 12rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.04);
}
.card-left {
	flex: 1;
}
.title {
	font-size: 30rpx;
	font-weight: 700;
	color: #222;
	margin-bottom: 12rpx;
}
.meta {
	display: flex;
	align-items: center;
	gap: 18rpx;
	color: #8b8b8b;
	font-size: 24rpx;
	margin-top: 6rpx;
}
.label {
	color: #b5b5b5;
	margin-right: 8rpx;
}
.value {
	color: #333;
}
.spacer {
	margin-left: 18rpx;
	color: #b5b5b5;
}
.card-right {
	color: #bfbfbf;
	font-size: 36rpx;
	padding-left: 12rpx;
}
</style>

