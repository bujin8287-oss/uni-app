<template>
	<view class="add-page">
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

			<!-- 报废原因 -->
			<view class="section">
				<text class="section-title">报废原因</text>
				<view class="form-card">
					<textarea 
						class="textarea-input"
						placeholder="请输入..."
						v-model="formData.reason"
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
import { ref, reactive, onMounted } from 'vue'

const formData = reactive({
	scrapCode: '',
	deviceName: '',
	model: '',
	applicant: '',
	scrapDate: '',
	reason: '',
})

const formFields = [
	{ label: '报废单编号', key: 'scrapCode', type: 'input', placeholder: '请输入设备编号' },
	{ label: '设备名称', key: 'deviceName', type: 'picker', placeholder: '请选择' },
	{ label: '规格型号', key: 'model', type: 'input', placeholder: '请输入规格型号' },
	{ label: '申请人', key: 'applicant', type: 'picker', placeholder: '请选择' },
	{ label: '报废时间', key: 'scrapDate', type: 'picker', placeholder: '请选择' },
]

onMounted(() => {
	// 监听设备选择返回
	uni.$on('deviceSelected', (device) => {
		formData.deviceName = device
	})
	
	// 监听申请人选择返回
	uni.$on('applicantSelected', (applicant) => {
		formData.applicant = applicant
	})
})

function openPicker(key) {
	if (key === 'deviceName') {
		// 跳转到设备选择页面
		uni.navigateTo({ 
			url: `/pages/workbench/device-select/index?current=${encodeURIComponent(formData.deviceName || '')}` 
		})
	} else if (key === 'applicant') {
		// 跳转到申请人选择页面
		uni.navigateTo({ 
			url: `/pages/workbench/applicant-select/index?current=${encodeURIComponent(formData.applicant || '')}` 
		})
	} else if (key === 'scrapDate') {
		// 日期选择
		uni.showModal({
			title: '提示',
			content: '日期选择功能待实现',
			showCancel: false
		})
	}
}

function handleSubmit() {
	// 验证必填项
	if (!formData.scrapCode) {
		uni.showToast({ title: '请输入报废单编号', icon: 'none' })
		return
	}
	if (!formData.deviceName) {
		uni.showToast({ title: '请选择设备名称', icon: 'none' })
		return
	}

	// 提交数据
	uni.showLoading({ title: '提交中...' })
	
	setTimeout(() => {
		uni.hideLoading()
		uni.showToast({ 
			title: '提交成功', 
			icon: 'success',
			duration: 1500
		})
		
		setTimeout(() => {
			uni.navigateBack()
		}, 1500)
	}, 1000)
}
</script>

<style>
.add-page {
	background: #f7f6fb;
	min-height: 100vh;
	position: relative;
}

.form-scroll {
	height: calc(100vh - 120rpx);
	padding: 20rpx;
	box-sizing: border-box;
}

.section {
	margin-bottom: 24rpx;
}

.section-title {
	color: #333;
	font-size: 28rpx;
	font-weight: 700;
	display: block;
	margin-bottom: 16rpx;
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
