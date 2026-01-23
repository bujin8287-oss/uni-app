<template>
	<view class="detail-page">
		<!-- 加载状态 -->
		<view v-if="loading" class="loading-state">
			<text class="loading-text">加载中...</text>
		</view>

		<!-- 详情内容 -->
		<view v-else-if="scrapDetail" class="detail-content">
			<!-- 基本信息卡片 -->
			<view class="info-card">
				<view class="info-row" v-for="field in detailFields" :key="field.key">
					<text class="info-label">{{ field.label }}</text>
					<text class="info-value">{{ scrapDetail[field.key] || '-' }}</text>
				</view>
			</view>

			<!-- 报废原因 -->
			<view class="section">
				<text class="section-title">报废原因</text>
				<text class="reason-text">{{ scrapDetail.reason || '无' }}</text>
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
import { getDeviceScrapDetail } from '../../../api/mock.js'

const scrapDetail = ref(null)
const loading = ref(false)

const detailFields = [
	{ label: '报废单编号', key: 'scrapCode' },
	{ label: '设备编号', key: 'deviceCode' },
	{ label: '设备名称', key: 'deviceName' },
	{ label: '规格型号', key: 'model' },
	{ label: '已使用年限', key: 'usedYears' },
	{ label: '开始使用时间', key: 'startDate' },
	{ label: '固定资产编号', key: 'assetCode' },
	{ label: '生产厂家', key: 'manufacturer' },
	{ label: '申请人', key: 'applicant' },
	{ label: '报废时间', key: 'scrapDate' },
]

onMounted(() => {
	loadDetail()
})

async function loadDetail() {
	loading.value = true
	try {
		const pages = getCurrentPages()
		const currentPage = pages[pages.length - 1]
		const scrapId = currentPage.options.id || currentPage.options.code
		
		const res = await getDeviceScrapDetail({ id: scrapId })
		if (res.code === 0) {
			scrapDetail.value = res.data
		} else {
			uni.showToast({ title: '加载失败', icon: 'none' })
		}
	} catch (error) {
		uni.showToast({ title: '网络错误', icon: 'none' })
	} finally {
		loading.value = false
	}
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

.reason-text {
	color: #333;
	font-size: 28rpx;
	line-height: 1.6;
	display: block;
}
</style>
