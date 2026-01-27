<template>
	<view class="workpage">
		<!-- 搜索 -->
		<view class="search-wrap">
			<view class="search-box">
				<text class="search-icon">🔍</text>
				<text class="search-placeholder">请输入需要查找的内容</text>
			</view>
		</view>

		<!-- 分区列表 -->
		<view class="sections">
			<view class="section-card" v-for="section in sections" :key="section.key">
				<text class="section-title">{{ section.title }}</text>
				<view class="section-grid">
					<view class="grid-item" v-for="item in section.items" :key="item.name" @click="openFeature(item)">
						<view class="icon-box">{{ item.icon }}</view>
						<text class="item-text">{{ item.name }}</text>
					</view>
				</view>
			</view>
		</view>
		<BottomNav />
	</view>
</template>

<script setup>
import { reactive } from 'vue'
import BottomNav from '@/components/business/BottomNav.vue'

const sections = reactive([
	{
		key: 'plan',
		title: '计划管理',
		items: [
			{ name: '销售订单', icon: '🧾' },
			{ name: '生产计划', icon: '⚙️' },
		],
	},
	{
		key: 'production',
		title: '生产管理',
		items: [
			{ name: '生产工单', icon: '📋' },
			{ name: '生产报工', icon: '📝' },
			{ name: '报工记录', icon: '📄' },
			{ name: '生产达成', icon: '🎯' },
			{ name: '生产准时', icon: '⏱️' },
		],
	},
	{
		key: 'quality',
		title: '质量管理',
		items: [
			{ name: '来料检验', icon: '🔬' },
			{ name: '过程检验', icon: '📦' },
			{ name: '最终检验', icon: '✅' },
			{ name: '追溯管理', icon: '🔁' },
		],
	},
	{
		key: 'equipment',
		title: '设备管理',
		items: [
			{ name: '设备档案', icon: '📇' },
			{ name: '设备报废', icon: '🗑️' },
			{ name: '设备维修', icon: '🛠️' },
			{ name: '设备保养', icon: '🧴' },
			{ name: '巡检点检', icon: '🔎' },
			{ name: '备品备件', icon: '🔩' },
		],
	},
	{
		key: 'warehouse',
		title: '仓库管理',
		items: [
			{ name: '采购入库', icon: '📥' },
			{ name: '生产领料', icon: '📦' },
			{ name: '生产退料', icon: '↩️' },
			{ name: '产品出库', icon: '📤' },
		],
	},
])

function openFeature(item) {
	if (!item || !item.name) return
	// 销售订单跳转到专门的页面
	if(item.name === '销售订单') {
		uni.navigateTo({ url: '/pages/workbench/plan-management/sales-order/index' })
		return
	}
	// 生产计划跳转到生产计划页面
	if (item.name === '生产计划') {
		uni.navigateTo({ url: '/pages/workbench/plan-management/product-plan/index' })
		return
	}
	// 生产工单跳转到生产工单页面
	if (item.name === '生产工单') {
		uni.navigateTo({ url: '/pages/workbench/product-management/product-order/index' })
		return
	}
	// 生产报工跳转到生产报工页面
	if (item.name === '生产报工') {
		uni.navigateTo({ url: '/pages/workbench/product-management/product-record-sub/index' })
		return
	}
	// 生产达成跳转到生产达成页面
	if (item.name === '生产达成') {
		uni.navigateTo({ url: '/pages/workbench/product-management/product-complete/index' })
		return
	}
	// 生产准时跳转到生产准时页面
	if (item.name === '生产准时') {
		uni.navigateTo({ url: '/pages/workbench/product-management/product-on-time/index' })
		return
	}
	// 报工记录跳转到报工记录页面
	if (item.name === '报工记录') {
		uni.navigateTo({ url: '/pages/workbench/product-management/work-record/index' })
		return
	}
	// 设备档案跳转到专门的页面
	if (item.name === '设备档案') {
		uni.navigateTo({ url: '/pages/workbench/archive/index' })
		return
	}
	
	// 设备报废跳转到专门的页面
	if (item.name === '设备报废') {
		uni.navigateTo({ url: '/pages/workbench/device-scrap/index' })
		return
	}
	
	// 设备维修跳转到专门的页面
	if (item.name === '设备维修') {
		uni.navigateTo({ url: '/pages/workbench/device-repair/index' })
		return
	}
	
	// 设备保养跳转到专门的页面
	if (item.name === '设备保养') {
		uni.navigateTo({ url: '/pages/workbench/device-maintenance/index' })
		return
	}
	
	// 巡检点检跳转到专门的页面
	if (item.name === '巡检点检') {
		uni.navigateTo({ url: '/pages/workbench/device-inspection/index' })
		return
	}
	
	// 备品备件跳转到专门的页面
	if (item.name === '备品备件') {
		uni.navigateTo({ url: '/pages/workbench/spare-parts/index' })
		return
	}
	
	// 采购入库跳转到专门的页面
	if (item.name === '采购入库') {
		uni.navigateTo({ url: '/pages/workbench/warehouse/purchase-inbound/index' })
		return
	}
	
	// 生产领料跳转到专门的页面
	if (item.name === '生产领料') {
		uni.navigateTo({ url: '/pages/workbench/warehouse/material-requisition/index' })
		return
	}
	
	// 生产退料跳转到专门的页面
	if (item.name === '生产退料') {
		uni.navigateTo({ url: '/pages/workbench/warehouse/material-return/index' })
		return
	}
	
	// 产品出库跳转到专门的页面
	if (item.name === '产品出库') {
		uni.navigateTo({ url: '/pages/workbench/warehouse/product-outbound/index' })
		return
	}
	
	// 其他功能跳转到通用功能页
	// 来料检验跳转到质量管理 -> 来料检验列表
	if (item.name === '来料检验') {
		uni.navigateTo({ url: '/pages/workbench/quality-control/incoming-inspection/index' })
		return
	}
	// 过程检验跳转到质量管理 -> 过程检验列表
	if (item.name === '过程检验') {
		uni.navigateTo({ url: '/pages/workbench/quality-control/process-inspection/index' })
		return
	}
	// 追溯管理跳转到追溯管理页面
	if (item.name === '追溯管理') {
		uni.navigateTo({ url: '/pages/workbench/quality-control/trace-management/index' })
		return
	}
	// 最终检验跳转到质量管理 -> 最终检验列表
	if (item.name === '最终检验') {
		uni.navigateTo({ url: '/pages/workbench/quality-control/final-inspection/index' })
		return
	}
	const url = `/pages/feature/index?name=${encodeURIComponent(item.name)}`
	uni.navigateTo({ url })
}
</script>

<style>
.workpage {
	padding: 24rpx;
	background: #f7f6fb;
	min-height: 100vh;
	padding-bottom: 160rpx;
}

.page-title {
	font-size: 34rpx;
	font-weight: 700;
	color: #2b2b2b;
}
.search-wrap {
	margin-top: 14rpx;
	margin-bottom: 18rpx;
}
.search-box {
	background: #fff;
	padding: 18rpx;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	gap: 12rpx;
	box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.03);
}
.search-icon {
	font-size: 28rpx;
	color: #9b9b9b;
}
.search-placeholder {
	color: #cfcfe6;
	font-size: 26rpx;
}
.sections {
	display: flex;
	flex-direction: column;
	gap: 18rpx;
}
.section-card {
	background: #fff;
	padding: 20rpx;
	border-radius: 12rpx;
	box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.04);
}
.section-title {
	font-size: 28rpx;
	font-weight: 700;
	margin-bottom: 12rpx;
}
.section-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}
.grid-item {
	width: calc((100% - 64rpx) / 4);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 8rpx 4rpx;
}
.icon-box {
	width: 82rpx;
	height: 82rpx;
	border-radius: 14rpx;
	background: linear-gradient(180deg,#f5f6ff,#fff);
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 36rpx;
	margin-bottom: 8rpx;
	box-shadow: 0 6rpx 14rpx rgba(15,15,15,0.03);
}
.item-text {
	font-size: 22rpx;
	color: #333;
	text-align: center;
}
</style>

