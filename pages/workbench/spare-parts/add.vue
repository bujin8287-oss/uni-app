<template>
	<view class="add-page">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="header-title">新增备品备件</text>
			<view class="header-right"></view>
		</view>

		<scroll-view class="form-scroll" scroll-y>
			<!-- 基本信息 -->
			<view class="section">
				<text class="section-title">基本信息</text>
				<view class="form-card">
					<view class="form-item" v-for="field in formFields" :key="field.key">
						<text class="field-label">{{ field.label }}</text>
						
						<!-- 普通输入框 -->
						<input 
							v-if="field.type === 'input'"
							class="field-input" 
							:placeholder="field.placeholder"
							v-model="formData[field.key]"
						/>
						
						<!-- 选择器 -->
						<view 
							v-else-if="field.type === 'picker'"
							class="field-picker"
							@click="openPicker(field.key)"
						>
							<text :class="['picker-text', formData[field.key] ? '' : 'placeholder']">
								{{ formData[field.key] || field.placeholder }}
							</text>
							<text class="picker-arrow">›</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 备品备件图片 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">备品备件图片</text>
					<text class="section-tip">可上传jpg、png、pdf等格式文件</text>
				</view>
				<view class="image-upload">
					<view class="image-item" v-for="(img, index) in images" :key="index">
						<image :src="img" class="uploaded-image" mode="aspectFill" />
						<view class="image-delete" @click="deleteImage(index)">×</view>
					</view>
					<view v-if="images.length < 9" class="upload-btn" @click="chooseImage">
						<text class="upload-icon">+</text>
					</view>
				</view>
			</view>

			<!-- 使用说明 -->
			<view class="section">
				<text class="section-title">使用说明</text>
				<view class="form-card">
					<textarea 
						class="textarea-input"
						placeholder="请输入使用说明..."
						v-model="formData.usageNotes"
						:maxlength="200"
					/>
				</view>
			</view>

			<!-- 底部占位 -->
			<view class="bottom-placeholder"></view>
		</scroll-view>

		<!-- 提交按钮 -->
		<view class="submit-bar">
			<button class="submit-btn" @click="handleSubmit">提交</button>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { createSparePart } from '@/api/mock.js'

const formData = reactive({
	code: '',
	name: '',
	model: '',
	usageDays: '',
	unit: '',
	period: '',
	manufacturer: '',
	usageNotes: '',
})

const images = ref([])

onMounted(() => {
	// 自动生成备品备件编号
	generateCode()
	
	// 监听单位选择返回
	uni.$on('unitSelected', handleUnitSelected)
	
	// 监听生产厂家选择返回
	uni.$on('sparePartsManufacturerSelected', handleManufacturerSelected)
})

onUnmounted(() => {
	// 清理事件监听
	uni.$off('unitSelected', handleUnitSelected)
	uni.$off('sparePartsManufacturerSelected', handleManufacturerSelected)
})

function generateCode() {
	// 生成备品备件编号：BPBJBH + 时间戳后7位
	const timestamp = Date.now().toString()
	formData.code = `BPBJBH${timestamp.slice(-7)}`
}

function handleUnitSelected(unit) {
	formData.unit = unit
}

function handleManufacturerSelected(manufacturer) {
	formData.manufacturer = manufacturer
}

const formFields = [
	{ label: '备品备件编号', key: 'code', type: 'input', placeholder: '请输入编号' },
	{ label: '备品备件名称', key: 'name', type: 'input', placeholder: '请输入名称' },
	{ label: '型号', key: 'model', type: 'input', placeholder: '请输入型号' },
	{ label: '使用天数', key: 'usageDays', type: 'input', placeholder: '请输入使用天数' },
	{ label: '单位', key: 'unit', type: 'picker', placeholder: '请选择' },
	{ label: '周期', key: 'period', type: 'input', placeholder: '请输入周期' },
	{ label: '生产厂家', key: 'manufacturer', type: 'picker', placeholder: '请选择' },
]

function openPicker(key) {
	if (key === 'unit') {
		// 跳转到单位选择页面
		uni.navigateTo({ 
			url: `/pages/workbench/spare-parts/unit-select?current=${encodeURIComponent(formData.unit || '')}` 
		})
	} else if (key === 'manufacturer') {
		// 跳转到生产厂家选择页面
		uni.navigateTo({ 
			url: `/pages/workbench/spare-parts/manufacturer-select?current=${encodeURIComponent(formData.manufacturer || '')}` 
		})
	}
}

function chooseImage() {
	uni.chooseImage({
		count: 9 - images.value.length,
		sizeType: ['compressed'],
		sourceType: ['album', 'camera'],
		success: (res) => {
			images.value = images.value.concat(res.tempFilePaths)
		}
	})
}

function deleteImage(index) {
	images.value.splice(index, 1)
}

async function handleSubmit() {
	// 验证必填项
	if (!formData.code) {
		uni.showToast({ title: '请输入备品备件编号', icon: 'none' })
		return
	}
	if (!formData.name) {
		uni.showToast({ title: '请输入备品备件名称', icon: 'none' })
		return
	}

	// 提交数据
	uni.showLoading({ title: '提交中...' })
	
	try {
		const submitData = {
			...formData,
			images: images.value
		}
		
		const res = await createSparePart(submitData)
		
		if (res.code === 0) {
			uni.hideLoading()
			uni.showToast({ 
				title: '提交成功', 
				icon: 'success',
				duration: 1500
			})
			
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)
		} else {
			uni.hideLoading()
			uni.showToast({
				title: res.message || '提交失败',
				icon: 'none'
			})
		}
	} catch (error) {
		uni.hideLoading()
		uni.showToast({
			title: '提交失败',
			icon: 'none'
		})
	}
}

function goBack() {
	uni.navigateBack()
}
</script>

<style scoped>
.add-page {
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

.form-scroll {
	flex: 1;
	padding: 20rpx;
	box-sizing: border-box;
}

.section {
	margin-bottom: 24rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.section-title {
	color: #333;
	font-size: 28rpx;
	font-weight: 700;
	display: block;
	margin-bottom: 16rpx;
}

.section-tip {
	color: #9b9b9b;
	font-size: 22rpx;
}

.form-card {
	background: #fff;
	border-radius: 12rpx;
	padding: 0 24rpx;
	box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
}

.form-item {
	display: flex;
	align-items: center;
	padding: 28rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
}

.form-item:last-child {
	border-bottom: none;
}

.field-label {
	color: #333;
	font-size: 28rpx;
	width: 160rpx;
	flex-shrink: 0;
}

.field-input {
	flex: 1;
	text-align: right;
	font-size: 28rpx;
	color: #333;
	padding-right: 8rpx;
}

.field-input::placeholder {
	color: #cfcfe6;
}

.field-picker {
	flex: 1;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 8rpx;
	padding-right: 8rpx;
}

.picker-text {
	font-size: 28rpx;
	color: #333;
}

.picker-text.placeholder {
	color: #cfcfe6;
}

.picker-arrow {
	color: #cfcfe6;
	font-size: 32rpx;
}

.image-upload {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.image-item {
	position: relative;
	width: 200rpx;
	height: 200rpx;
}

.uploaded-image {
	width: 100%;
	height: 100%;
	border-radius: 8rpx;
	background: #f5f5f5;
}

.image-delete {
	position: absolute;
	top: -8rpx;
	right: -8rpx;
	width: 40rpx;
	height: 40rpx;
	background: #ff5a5a;
	color: #fff;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 32rpx;
	line-height: 1;
}

.upload-btn {
	width: 200rpx;
	height: 200rpx;
	border: 2rpx dashed #cfcfe6;
	border-radius: 8rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #fafafa;
}

.upload-icon {
	font-size: 60rpx;
	color: #cfcfe6;
	line-height: 1;
}

.textarea-input {
	width: 100%;
	min-height: 200rpx;
	padding: 24rpx;
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
	box-sizing: border-box;
}

.textarea-input::placeholder {
	color: #cfcfe6;
}

.bottom-placeholder {
	height: 40rpx;
}

.submit-bar {
	padding: 20rpx;
	background: #fff;
	box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.submit-btn {
	width: 100%;
	height: 88rpx;
	background: linear-gradient(135deg, #7c66ff, #9b7fff);
	color: #fff;
	font-size: 32rpx;
	font-weight: 700;
	border-radius: 44rpx;
	border: none;
	display: flex;
	justify-content: center;
	align-items: center;
}

.submit-btn::after {
	border: none;
}
</style>
