<template>
	<view class="detail-page">
		<!-- 加载状态 -->
		<view v-if="loading" class="loading-state">
			<text class="loading-text">加载中...</text>
		</view>

		<!-- 详情内容 -->
		<view v-else-if="repairDetail" class="detail-content">
			<!-- 基本信息卡片 -->
			<view class="info-card">
				<view class="info-row" v-for="field in basicFields" :key="field.key">
					<text class="info-label">{{ field.label }}</text>
					<text class="info-value">{{ repairDetail[field.key] || '-' }}</text>
				</view>
			</view>

			<!-- 故障描述 -->
			<view class="section">
				<text class="section-title">故障描述</text>
				<text class="content-text">{{ repairDetail.faultDescription || '无' }}</text>
			</view>

			<!-- 处理结果 -->
			<view class="section">
				<text class="section-title">处理结果</text>
				<view class="result-info">
					<view class="info-row">
						<text class="info-label">处理结果</text>
						<text class="info-value">{{ repairDetail.result || '-' }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">处理人</text>
						<text class="info-value">{{ repairDetail.handler || '-' }}</text>
					</view>
				</view>
			</view>

			<!-- 原因分析 -->
			<view class="section">
				<text class="section-title">原因分析</text>
				<text class="content-text">{{ repairDetail.causeAnalysis || '无' }}</text>
			</view>

			<!-- 处理措施 -->
			<view class="section">
				<text class="section-title">处理措施</text>
				<text class="content-text">{{ repairDetail.solution || '无' }}</text>
			</view>

			<!-- 处理图片 -->
			<view class="section">
				<text class="section-title">处理图片</text>
				<view class="image-list">
					<image 
						v-for="(img, index) in repairDetail.images" 
						:key="index"
						:src="img" 
						class="repair-image"
						mode="aspectFill"
						@click="previewImage(index)"
					/>
				</view>
			</view>
		</view>

		<!-- 错误状态 -->
		<view v-else class="error-state">
			<text class="error-text">加载失败</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDeviceRepairDetail } from '../../../api/mock.js'

const repairDetail = ref(null)
const loading = ref(false)

const basicFields = [
	{ label: '维修单编号', key: 'repairCode' },
	{ label: '报修设备编号', key: 'deviceCode' },
	{ label: '报修设备名称', key: 'deviceName' },
	{ label: '报修部门', key: 'department' },
	{ label: '报修人', key: 'reporter' },
	{ label: '报修时间', key: 'reportTime' },
]

onMounted(() => {
	loadDetail()
})

async function loadDetail() {
	loading.value = true
	try {
		const pages = getCurrentPages()
		const currentPage = pages[pages.length - 1]
		const repairId = currentPage.options.id || currentPage.options.code
		
		const res = await getDeviceRepairDetail({ id: repairId })
		if (res.code === 0) {
			repairDetail.value = res.data
		} else {
			uni.showToast({ title: '加载失败', icon: 'none' })
		}
	} catch (error) {
		uni.showToast({ title: '网络错误', icon: 'none' })
	} finally {
		loading.value = false
	}
}

function previewImage(index) {
	if (!repairDetail.value || !repairDetail.value.images) return
	uni.previewImage({
		current: index,
		urls: repairDetail.value.images
	})
}
</script>

<style>
.detail-page {
	background: #f7f6fb;
	min-height: 100vh;
	padding: 20rpx;
	padding-bottom: 40rpx;
	box-sizing: border-box;
}

.loading-state,
.error-state {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 200rpx 0;
}

.loading-text,
.error-text {
	color: #9b9b9b;
	font-size: 28rpx;
}

.detail-content {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.info-card {
	background: #fff;
	border-radius: 12rpx;
	padding: 24rpx;
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

.result-info {
	display: flex;
	flex-direction: column;
}

.image-list {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.repair-image {
	width: 200rpx;
	height: 200rpx;
	border-radius: 8rpx;
	background: #f5f5f5;
}
</style>
