<template>
	<view class="detail-page">
		<view v-if="loading" class="loading-state">
			<text class="loading-text">加载中...</text>
		</view>
		<view v-else-if="device" class="detail-content">
			<view class="info-card">
				<view class="info-row" v-for="field in basicFields" :key="field.key">
					<text class="info-label">{{ field.label }}</text>
					<text class="info-value">{{ device[field.key] || '-' }}</text>
				</view>
			</view>
			<view class="section">
				<text class="section-title">设备图片</text>
				<view class="image-list">
					<image v-for="(img, index) in device.images" :key="index" :src="img" class="device-image" mode="aspectFill" @click="previewImage(index)" />
				</view>
			</view>
			<view class="section">
				<text class="section-title">备注</text>
				<text class="remark-text">{{ device.remark || '无' }}</text>
			</view>
		</view>
		<view v-else class="error-state">
			<text class="error-text">加载失败</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDeviceDetail } from '../../../api/mock.js'

const device = ref(null)
const loading = ref(false)
const basicFields = [
	{ label: '设备编号', key: 'code' },
	{ label: '设备名称', key: 'name' },
	{ label: '规格型号', key: 'model' },
	{ label: '出厂编号', key: 'serialNumber' },
	{ label: '使用年限', key: 'serviceLife' },
	{ label: '开始时间', key: 'startDate' },
	{ label: '固定资产', key: 'assetCode' },
	{ label: '生产厂家', key: 'manufacturer' },
	{ label: '所属部门', key: 'department' },
]

onMounted(() => {
	loadDetail()
})

async function loadDetail() {
	loading.value = true
	try {
		const pages = getCurrentPages()
		const currentPage = pages[pages.length - 1]
		const deviceId = currentPage.options.id || currentPage.options.code
		const res = await getDeviceDetail({ id: deviceId })
		if (res.code === 0) {
			device.value = res.data
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
	if (!device.value || !device.value.images) return
	uni.previewImage({ current: index, urls: device.value.images })
}
</script>

<style>
.detail-page { background: #f7f6fb; min-height: 100vh; padding: 20rpx; padding-bottom: 40rpx; box-sizing: border-box; }
.loading-state, .error-state { display: flex; justify-content: center; align-items: center; padding: 200rpx 0; }
.loading-text, .error-text { color: #9b9b9b; font-size: 28rpx; }
.detail-content { display: flex; flex-direction: column; gap: 20rpx; }
.info-card { background: #fff; border-radius: 12rpx; padding: 24rpx; box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04); }
.info-row { display: flex; justify-content: space-between; align-items: center; padding: 20rpx 0; border-bottom: 1rpx solid #f5f5f5; }
.info-row:last-child { border-bottom: none; }
.info-label { color: #9b9b9b; font-size: 28rpx; flex-shrink: 0; }
.info-value { color: #333; font-size: 28rpx; text-align: right; flex: 1; margin-left: 40rpx; }
.section { background: #fff; border-radius: 12rpx; padding: 24rpx; box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04); }
.section-title { color: #333; font-size: 28rpx; font-weight: 700; display: block; margin-bottom: 20rpx; }
.image-list { display: flex; flex-wrap: wrap; gap: 16rpx; }
.device-image { width: 200rpx; height: 200rpx; border-radius: 8rpx; background: #f5f5f5; }
.remark-text { color: #333; font-size: 28rpx; line-height: 1.6; display: block; }
</style>
