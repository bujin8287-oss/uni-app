<template>
	<view class="detail-page">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="header-title">备品备件详情</text>
			<view class="header-right"></view>
		</view>

		<scroll-view class="content-scroll" scroll-y>
			<view class="info-section">
				<view class="info-row">
					<text class="info-label">备品备件编号</text>
					<text class="info-value">{{ detailData.code }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">备品备件名称</text>
					<text class="info-value">{{ detailData.name }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">型号</text>
					<text class="info-value">{{ detailData.model }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">使用天数</text>
					<text class="info-value">{{ detailData.usageDays }}天</text>
				</view>
				<view class="info-row">
					<text class="info-label">单位</text>
					<text class="info-value">{{ detailData.unit }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">周期</text>
					<text class="info-value">{{ detailData.period }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">生产厂家</text>
					<text class="info-value">{{ detailData.manufacturer }}</text>
				</view>
			</view>

			<view class="section" v-if="detailData.images && detailData.images.length > 0">
				<text class="section-title">备品备件图片</text>
				<view class="image-list">
					<image 
						v-for="(img, index) in detailData.images"
						:key="index"
						:src="img" 
						class="spare-part-image"
						mode="aspectFill"
						@click="previewImage(index)"
					/>
				</view>
			</view>

			<view class="section">
				<text class="section-title">使用说明</text>
				<text class="content-text">{{ detailData.usageNotes || '无' }}</text>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getSparePartDetail } from '@/api/mock.js'

const detailData = ref({
	code: '',
	name: '',
	model: '',
	usageDays: '',
	unit: '',
	period: '',
	manufacturer: '',
	images: [],
	usageNotes: ''
})

onLoad((options) => {
	if (options.id) {
		loadDetail(options.id)
	}
})

async function loadDetail(id) {
	uni.showLoading({ title: '加载中...' })
	
	try {
		const res = await getSparePartDetail({ id })
		
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

.spare-part-image {
	width: 200rpx;
	height: 200rpx;
	border-radius: 8rpx;
	background: #f5f5f5;
}
</style>
