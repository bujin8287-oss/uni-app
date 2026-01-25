<template>
	<view class="detail-page">
		<!-- basic info card -->
		<view class="info-card">
			<view class="row">
				<text class="label">产品编号</text>
				<text class="value">{{ detail.productCode }}</text>
			</view>
			<view class="row">
				<text class="label">产品名称</text>
				<text class="value">{{ detail.productName }}</text>
			</view>
			<view class="row">
				<text class="label">工单编号</text>
				<text class="value">{{ detail.workOrder }}</text>
			</view>
			<view class="row">
				<text class="label">创建时间</text>
				<text class="value">{{ detail.createTime }}</text>
			</view>
		</view>

		<!-- tabs -->
		<view class="tabs">
			<view class="tab" v-for="(t, idx) in tabs" :key="t" :class="{ active: currentTab === idx }" @click="switchTab(idx)">
				{{ t }}
			</view>
		</view>

		<!-- tab content -->
		<view class="tab-content">
			<view v-if="currentTab === 0">
				<view class="list-item" v-for="(step, i) in processList" :key="i">
					<text class="left">{{ step.name }}</text>
					<text class="right">{{ step.time }}</text>
				</view>
			</view>
			<view v-if="currentTab === 1">
				<view class="list-item" v-for="(m, i) in bomList" :key="i">
					<text class="left">{{ m.name }}</text>
					<text class="right">{{ m.qty }}</text>
				</view>
			</view>
			<view v-if="currentTab === 2">
				<view class="list-item" v-for="(q, i) in qualityList" :key="i">
					<text class="left">{{ q.name }}</text>
					<text class="right">{{ q.result }}</text>
				</view>
			</view>
			<view v-if="currentTab === 3">
				<view class="list-item" v-for="(a, i) in abnormalList" :key="i">
					<text class="left">{{ a.step }}</text>
					<text class="right">{{ a.msg }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			id: null,
			currentTab: 0,
			tabs: ['技术工艺', '物料BOM', '质量检验', '异常信息'],
			detail: {
				productCode: 'CPBH000001',
				productName: '笔记本电脑',
				workOrder: 'GDBH000001',
				createTime: '2025.01.01'
			},
			processList: [
				{ name: '预加工', time: '60min' },
				{ name: '安装NPU', time: '60min' },
				{ name: '安装主板', time: '60min' }
			],
			bomList: [
				{ name: '笔记本电脑', qty: 1 },
				{ name: '主机', qty: 1 },
				{ name: '内存条', qty: 2 },
			],
			qualityList: [
				{ name: '内存条', result: '合格' },
				{ name: '屏幕', result: '合格' },
				{ name: '硬盘', result: '合格' }
			],
			abnormalList: [
				{ step: '第五道工序', msg: '设备有异响，偶尔卡顿' },
				{ step: '第五道工序', msg: '设备有异响，偶尔卡顿' }
			]
		}
	},
	onLoad(options) {
		if (options && options.id) {
			this.id = options.id
			// In a real app we'd fetch detail by id. For now mock switching content.
		}
		if (options && options.tab) {
			this.currentTab = Number(options.tab) || 0
		}
	},
	methods: {
		switchTab(idx) {
			this.currentTab = idx
		}
	}
}
</script>

<style>
.detail-page {
	padding: 24rpx;
	background: #f7f6fb;
	min-height: 100vh;
}
.info-card {
	background: #fff;
	padding: 20rpx;
	border-radius: 12rpx;
	box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.04);
	margin-bottom: 18rpx;
}
.row {
	display: flex;
	justify-content: space-between;
	padding: 10rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}
.label {
	color: #8b8b8b;
}
.value {
	color: #222;
	font-weight: 600;
}
.tabs {
	display: flex;
	background: #fff;
	padding: 8rpx;
	border-radius: 12rpx;
	gap: 12rpx;
	margin-bottom: 12rpx;
	box-shadow: 0 6rpx 12rpx rgba(0,0,0,0.02);
}
.tab {
	padding: 12rpx 18rpx;
	color: #666;
	border-radius: 8rpx;
}
.tab.active {
	color: #6b46ff;
	border-bottom: 3rpx solid #6b46ff;
}
.tab-content {
	margin-top: 6rpx;
	background: #fff;
	border-radius: 12rpx;
	box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.04);
	padding: 12rpx;
}
.list-item {
	display: flex;
	justify-content: space-between;
	padding: 18rpx 12rpx;
	border-bottom: 1rpx solid #f3f3f3;
	font-size: 26rpx;
	color: #333;
}
.left { color: #333; }
.right { color: #8b8b8b; }
</style>

