<template>
	<view class="detail-page">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="header-title">领料详情</text>
			<view class="header-right"></view>
		</view>

		<scroll-view class="content-scroll" scroll-y>
			<view class="info-section">
				<view class="info-row">
					<text class="info-label">领料编号</text>
					<text class="info-value">{{ detailData.code }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">领料单名称</text>
					<text class="info-value">{{ detailData.name }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">生产工单</text>
					<text class="info-value">{{ detailData.workOrder }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">生产车间</text>
					<text class="info-value">{{ detailData.workshop }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">生产工序</text>
					<text class="info-value">{{ detailData.process }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">领料人</text>
					<text class="info-value">{{ detailData.requisitionPerson }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">领料日期</text>
					<text class="info-value">{{ detailData.requisitionDate }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">物料编号</text>
					<text class="info-value">{{ detailData.materialCode }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">物料名称</text>
					<text class="info-value">{{ detailData.materialName }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">规格型号</text>
					<text class="info-value">{{ detailData.specification }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">单位</text>
					<text class="info-value">{{ detailData.unit }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">领取数量</text>
					<text class="info-value">{{ detailData.quantity }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">批次号</text>
					<text class="info-value">{{ detailData.batchNo }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">仓库</text>
					<text class="info-value">{{ detailData.warehouse }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">库区</text>
					<text class="info-value">{{ detailData.warehouseArea }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">库位</text>
					<text class="info-value">{{ detailData.warehouseLocation }}</text>
				</view>
			</view>

			<view class="section">
				<text class="section-title">备注</text>
				<text class="content-text">{{ detailData.remark || '无' }}</text>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getMaterialRequisitionDetail } from '@/api/mock.js'

const detailData = ref({
	code: '',
	name: '',
	workOrder: '',
	workshop: '',
	process: '',
	requisitionPerson: '',
	requisitionDate: '',
	materialCode: '',
	materialName: '',
	specification: '',
	unit: '',
	quantity: '',
	batchNo: '',
	warehouse: '',
	warehouseArea: '',
	warehouseLocation: '',
	remark: ''
})

onLoad((options) => {
	if (options.id) {
		loadDetail(options.id)
	}
})

async function loadDetail(id) {
	uni.showLoading({ title: '加载中...' })
	
	try {
		const res = await getMaterialRequisitionDetail({ id })
		
		if (res.code === 0) {
			detailData.value = res.data
		}
	} catch (error) {
		uni.showToast({
			title: '加载失败',
			icon: 'none'
		})
	} finally {
		uni.hideLoading()
	}
}

function goBack() {
	uni.navigateBack()
}
</script>

<style scoped>
.detail-page {
	background: #f7f6fb;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

.header {
	background: #fff;
	padding: 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1rpx solid #f0f0f0;
}

.back-btn {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-icon {
	font-size: 48rpx;
	color: #333;
	font-weight: 300;
}

.header-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
}

.header-right {
	width: 60rpx;
}

.content-scroll {
	flex: 1;
	padding: 20rpx;
	box-sizing: border-box;
}

.info-section {
	background: #fff;
	border-radius: 12rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
}

.info-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
}

.info-row:last-child {
	border-bottom: none;
}

.info-label {
	color: #9b9b9b;
	font-size: 28rpx;
	flex-shrink: 0;
}

.info-value {
	color: #333;
	font-size: 28rpx;
	text-align: right;
	flex: 1;
	margin-left: 40rpx;
}

.section {
	background: #fff;
	border-radius: 12rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
}

.section-title {
	color: #333;
	font-size: 28rpx;
	font-weight: 700;
	display: block;
	margin-bottom: 20rpx;
}

.content-text {
	color: #333;
	font-size: 28rpx;
	line-height: 1.6;
	display: block;
}
</style>
