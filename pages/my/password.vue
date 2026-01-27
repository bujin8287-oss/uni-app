<template>
	<view class="password-page">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="header-title">密码修改</text>
			<view class="header-right"></view>
		</view>

		<view class="form-content">
			<view class="form-card">
				<view class="form-item">
					<text class="field-label">旧密码</text>
					<input 
						class="field-input" 
						type="password"
						placeholder="请输入旧密码" 
						v-model="formData.oldPassword"
					/>
				</view>
				<view class="form-item">
					<text class="field-label">新密码</text>
					<input 
						class="field-input" 
						type="password"
						placeholder="请输入新密码" 
						v-model="formData.newPassword"
					/>
				</view>
				<view class="form-item">
					<text class="field-label">确认密码</text>
					<input 
						class="field-input" 
						type="password"
						placeholder="请再次输入新密码" 
						v-model="formData.confirmPassword"
					/>
				</view>
			</view>
		</view>

		<view class="submit-bar">
			<button class="submit-btn" @click="handleSubmit">提交</button>
		</view>
	</view>
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
	oldPassword: '',
	newPassword: '',
	confirmPassword: ''
})

function handleSubmit() {
	if (!formData.oldPassword) {
		uni.showToast({ title: '请输入旧密码', icon: 'none' })
		return
	}
	if (!formData.newPassword) {
		uni.showToast({ title: '请输入新密码', icon: 'none' })
		return
	}
	if (formData.newPassword.length < 6) {
		uni.showToast({ title: '新密码至少6位', icon: 'none' })
		return
	}
	if (formData.newPassword !== formData.confirmPassword) {
		uni.showToast({ title: '两次密码不一致', icon: 'none' })
		return
	}

	uni.showLoading({ title: '提交中...' })
	
	setTimeout(() => {
		uni.hideLoading()
		uni.showToast({ 
			title: '修改成功', 
			icon: 'success',
			duration: 1500
		})
		
		setTimeout(() => {
			uni.navigateBack()
		}, 1500)
	}, 800)
}

function goBack() {
	uni.navigateBack()
}
</script>

<style scoped>
.password-page {
	background: #f5f5f5;
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
	font-size: 34rpx;
	font-weight: 600;
	color: #333;
}

.header-right {
	width: 60rpx;
}

.form-content {
	flex: 1;
	padding: 20rpx;
}

.form-card {
	background: #fff;
	border-radius: 16rpx;
	padding: 0 32rpx;
}

.form-item {
	display: flex;
	align-items: center;
	padding: 36rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.form-item:last-child {
	border-bottom: none;
}

.field-label {
	color: #333;
	font-size: 30rpx;
	width: 160rpx;
	flex-shrink: 0;
}

.field-input {
	flex: 1;
	font-size: 30rpx;
	color: #333;
	text-align: right;
}

.field-input::placeholder {
	color: #d0d0d0;
}

.submit-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 24rpx 32rpx;
	padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
	background: transparent;
}

.submit-btn {
	width: 100%;
	height: 96rpx;
	background: linear-gradient(135deg, #7c66ff, #9b7fff);
	color: #fff;
	font-size: 34rpx;
	font-weight: 600;
	border-radius: 48rpx;
	border: none;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 8rpx 24rpx rgba(124, 102, 255, 0.3);
}

.submit-btn::after {
	border: none;
}
</style>
