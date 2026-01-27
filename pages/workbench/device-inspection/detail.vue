<template>
	<view class="detail-page">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="header-title">巡检点检详情</text>
			<view class="header-right"></view>
		</view>

		<scroll-view class="content-scroll" scroll-y>
			<view class="info-section">
				<view class="info-row">
					<text class="info-label">巡检点检编号</text>
					<text class="info-value">{{ detailData.code }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">巡检点检设备</text>
					<text class="info-value">{{ detailData.deviceName }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">操作人</text>
					<text class="info-value">{{ detailData.operator }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">巡检点检时间</text>
					<text class="info-value">{{ detailData.inspectionTime }}</text>
				</view>
			</view>

			<view class="section">
				<text class="section-title">巡检点检内容</text>
				<text class="content-text">{{ detailData.content || '无' }}</text>
			</view>

			<view class="section" v-if="detailData.images && detailData.images.length > 0">
				<text class="section-title">巡检点检图片</text>
				<view class="image-list">
					<image 
						v-for="(img, index) in detailData.images"
						:key="index"
						:src="img" 
						class="inspection-image"
						mode="aspectFill"
						@click="previewImage(index)"
					/>
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
import { getInspectionDetail } from '@/api/mock.js'

const detailData = ref({
	code: '',
	deviceName: '',
	operator: '',
	inspectionTime: '',
	content: '',
	images: [],
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
		const res = await getInspectionDetail({ id })
		
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

function previewImage(index) {
	uni.previewImage({
		current: index,
		urls: detailData.value.images
	})
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

.image-list {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.inspection-image {
	width: 200rpx;
	height: 200rpx;
	border-radius: 8rpx;
	background: #f5f5f5;
}
</style>
