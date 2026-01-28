<template>
	<view class="handle-page">
		<!-- 异常处理表单 -->
		<view class="form-section">
			<view class="form-item" @click="selectResult">
				<text class="form-label">处理结果</text>
				<view class="form-value-wrapper">
					<text class="form-value" :class="formData.result ? '' : 'placeholder'">{{ formData.result || '请选择 >' }}</text>
				</view>
			</view>
			<view class="form-item" @click="selectHandler">
				<text class="form-label">处理人</text>
				<view class="form-value-wrapper">
					<text class="form-value" :class="formData.handler ? '' : 'placeholder'">{{ formData.handler || '请选择 >' }}</text>
				</view>
			</view>
		</view>

		<!-- 原因分析 -->
		<view class="form-section">
			<text class="section-title">原因分析</text>
			<textarea 
				class="textarea-input" 
				v-model="formData.causeAnalysis"
				placeholder="请输入故障原因..."
				maxlength="500"
			/>
		</view>

		<!-- 处理措施 -->
		<view class="form-section">
			<text class="section-title">处理措施</text>
			<textarea 
				class="textarea-input" 
				v-model="formData.solution"
				placeholder="请输入处理措施..."
				maxlength="500"
			/>
		</view>

		<!-- 处理图片 -->
		<view class="form-section">
			<view class="section-header">
				<text class="section-title">处理图片</text>
				<text class="section-tip">可上传jpg、png、pdf等格式文件</text>
			</view>
			<view class="image-upload-area">
				<view 
					class="image-item" 
					v-for="(img, index) in formData.images" 
					:key="index"
				>
					<image :src="img" class="uploaded-image" mode="aspectFill" @click="previewImage(index)" />
					<view class="delete-btn" @click="removeImage(index)">×</view>
				</view>
				<view class="upload-btn" @click="chooseImage" v-if="formData.images.length < 9">
					<text class="upload-icon">+</text>
				</view>
			</view>
		</view>

		<!-- 提交按钮 -->
		<view class="submit-bar">
			<button class="submit-btn" @click="handleSubmit">提交</button>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const formData = ref({
	result: '',
	handler: '',
	causeAnalysis: '',
	solution: '',
	images: []
})

const abnormalCode = ref('')

onLoad((options) => {
	abnormalCode.value = options.code ? decodeURIComponent(options.code) : ''
	
	// 监听处理结果选择
	uni.$on('abnormalResultSelected', (result) => {
		formData.value.result = result
	})
	
	// 监听处理人选择
	uni.$on('abnormalHandlerSelected', (handler) => {
		formData.value.handler = handler
	})
})

onMounted(() => {
	// 清理事件监听
	return () => {
		uni.$off('abnormalResultSelected')
		uni.$off('abnormalHandlerSelected')
	}
})

function selectResult() {
	uni.navigateTo({
		url: `/pages/abnormal/result-select?current=${encodeURIComponent(formData.value.result || '')}`
	})
}

function selectHandler() {
	uni.navigateTo({
		url: `/pages/abnormal/handler-select?current=${encodeURIComponent(formData.value.handler || '')}`
	})
}

function chooseImage() {
	uni.chooseImage({
		count: 9 - formData.value.images.length,
		success: (res) => {
			formData.value.images = [...formData.value.images, ...res.tempFilePaths]
		},
		fail: (err) => {
			console.error('选择图片失败', err)
		}
	})
}

function removeImage(index) {
	formData.value.images.splice(index, 1)
}

function previewImage(index) {
	uni.previewImage({
		current: index,
		urls: formData.value.images
	})
}

function handleSubmit() {
	// 验证必填项
	if (!formData.value.result) {
		uni.showToast({
			title: '请选择处理结果',
			icon: 'none'
		})
		return
	}
	
	if (!formData.value.handler) {
		uni.showToast({
			title: '请选择处理人',
			icon: 'none'
		})
		return
	}
	
	// 提交数据
	uni.showLoading({
		title: '提交中...'
	})
	
	// 模拟提交
	setTimeout(() => {
		uni.hideLoading()
		uni.showToast({
			title: '提交成功',
			icon: 'success'
		})
		
		// 通知详情页更新数据
		uni.$emit('abnormalHandled', {
			code: abnormalCode.value,
			result: formData.value.result,
			handler: formData.value.handler
		})
		
		// 返回详情页
		setTimeout(() => {
			uni.navigateBack({
				delta: 1
			})
		}, 1500)
	}, 1000)
}
</script>

<style scoped>
.handle-page {
	background: #f7f6fb;
	min-height: 100vh;
	padding: 20rpx;
	padding-bottom: 120rpx;
	box-sizing: border-box;
}

.form-section {
	background: #fff;
	border-radius: 12rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
}

.form-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
}

.form-item:last-child {
	border-bottom: none;
}

.form-label {
	color: #333;
	font-size: 28rpx;
	font-weight: 500;
	flex-shrink: 0;
}

.form-value-wrapper {
	flex: 1;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	margin-left: 40rpx;
}

.form-value {
	color: #333;
	font-size: 28rpx;
	text-align: right;
}

.form-value.placeholder {
	color: #999;
}

.section-title {
	color: #333;
	font-size: 28rpx;
	font-weight: 700;
	display: block;
	margin-bottom: 20rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.section-tip {
	color: #999;
	font-size: 24rpx;
}

.textarea-input {
	width: 100%;
	min-height: 200rpx;
	padding: 20rpx;
	background: #f7f6fb;
	border-radius: 8rpx;
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
	box-sizing: border-box;
}

.image-upload-area {
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

.delete-btn {
	position: absolute;
	top: -10rpx;
	right: -10rpx;
	width: 40rpx;
	height: 40rpx;
	background: #ff5a5a;
	color: #fff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	font-weight: 300;
	line-height: 1;
	box-shadow: 0 2rpx 8rpx rgba(255, 90, 90, 0.4);
}

.upload-btn {
	width: 200rpx;
	height: 200rpx;
	border: 2rpx dashed #d0d0d0;
	border-radius: 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #fafafa;
}

.upload-icon {
	font-size: 60rpx;
	color: #999;
	font-weight: 300;
	line-height: 1;
}

.submit-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
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
