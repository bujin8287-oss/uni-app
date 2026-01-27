<template>
	<view class="add-page">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="header-title">新增巡检点检</text>
			<view class="header-right"></view>
		</view>

		<scroll-view class="form-scroll" scroll-y>
			<!-- 设备信息 -->
			<view class="section">
				<text class="section-title">设备信息</text>
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

			<!-- 巡检点检内容 -->
			<view class="section">
				<text class="section-title">巡检点检内容</text>
				<view class="form-card">
					<textarea 
						class="textarea-input"
						placeholder="请输入备注信息..."
						v-model="formData.content"
						:maxlength="200"
					/>
				</view>
			</view>

			<!-- 巡检点检图片 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">巡检点检图片</text>
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

			<!-- 备注 -->
			<view class="section">
				<text class="section-title">备注</text>
				<view class="form-card">
					<textarea 
						class="textarea-input"
						placeholder="请输入备注信息..."
						v-model="formData.remark"
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
import { createInspection } from '@/api/mock.js'

const formData = reactive({
	code: '',
	deviceName: '',
	operator: '',
	inspectionTime: '',
	content: '',
	remark: ''
})

const images = ref([])

const formFields = [
	{ label: '巡检点检编号', key: 'code', type: 'input', placeholder: '请输入巡检点检编号' },
	{ label: '巡检点检设备', key: 'deviceName', type: 'picker', placeholder: '请选择' },
	{ label: '操作人', key: 'operator', type: 'picker', placeholder: '请选择' },
	{ label: '巡检点检时间', key: 'inspectionTime', type: 'picker', placeholder: '请选择' }
]

onMounted(() => {
	// 自动生成巡检点检编号
	generateCode()
	
	// 监听设备选择返回
	uni.$on('inspectionDeviceSelected', handleDeviceSelected)
	
	// 监听操作人选择返回
	uni.$on('inspectionOperatorSelected', handleOperatorSelected)
})

onUnmounted(() => {
	// 清理事件监听
	uni.$off('inspectionDeviceSelected', handleDeviceSelected)
	uni.$off('inspectionOperatorSelected', handleOperatorSelected)
})

function generateCode() {
	// 生成巡检点检编号：SBXDJBH + 时间戳后7位
	const timestamp = Date.now().toString()
	formData.code = `SBXDJBH${timestamp.slice(-7)}`
}

function handleDeviceSelected(device) {
	formData.deviceName = device
}

function handleOperatorSelected(operator) {
	formData.operator = operator
}

function openPicker(key) {
	if (key === 'deviceName') {
		// 跳转到设备选择页面
		uni.navigateTo({ 
			url: `/pages/workbench/device-inspection/device-select?current=${encodeURIComponent(formData.deviceName || '')}` 
		})
	} else if (key === 'operator') {
		// 跳转到操作人选择页面
		uni.navigateTo({ 
			url: `/pages/workbench/device-inspection/operator-select?current=${encodeURIComponent(formData.operator || '')}` 
		})
	} else if (key === 'inspectionTime') {
		// 日期时间选择
		const now = new Date()
		const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
		const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
		
		uni.showActionSheet({
			itemList: ['选择日期和时间'],
			success: () => {
				// 先选择日期
				uni.showModal({
					title: '选择日期',
					editable: true,
					placeholderText: currentDate,
					success: (dateRes) => {
						if (dateRes.confirm) {
							const selectedDate = dateRes.content || currentDate
							// 再选择时间
							uni.showModal({
								title: '选择时间',
								editable: true,
								placeholderText: currentTime,
								success: (timeRes) => {
									if (timeRes.confirm) {
										const selectedTime = timeRes.content || currentTime
										// 格式化为 2025.04.24 14:00:00
										const [year, month, day] = selectedDate.split('-')
										const [hour, minute] = selectedTime.split(':')
										formData.inspectionTime = `${year}.${month}.${day} ${hour}:${minute}:00`
									}
								}
							})
						}
					}
				})
			}
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
		uni.showToast({ title: '请输入巡检点检编号', icon: 'none' })
		return
	}
	if (!formData.deviceName) {
		uni.showToast({ title: '请选择巡检点检设备', icon: 'none' })
		return
	}

	// 提交数据
	uni.showLoading({ title: '提交中...' })
	
	try {
		const submitData = {
			...formData,
			images: images.value
		}
		
		const res = await createInspection(submitData)
		
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
	width: 200rpx;
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
