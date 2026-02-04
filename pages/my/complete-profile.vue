<template>
	<view class="complete-page">
		<view class="header">
			<text class="header-title">完善个人信息</text>
		</view>

		<view class="tips">
			<text class="tips-text">首次登录需要绑定手机号、设置账号与密码，完成后将进入首页。</text>
		</view>

		<view class="form-card">
			<view class="form-item">
				<text class="field-label">手机号</text>
				<input class="field-input" type="number" maxlength="11" placeholder="请输入11位手机号" v-model="form.phone" />
			</view>
			<view class="form-item">
				<text class="field-label">账号</text>
				<input class="field-input" type="text" maxlength="30" placeholder="请输入账号(3-30位)" v-model="form.username" />
			</view>
			<view class="form-item">
				<text class="field-label">真实姓名</text>
				<input class="field-input" type="text" maxlength="20" placeholder="请输入真实姓名" v-model="form.realName" />
			</view>
			<view class="form-item">
				<text class="field-label">密码</text>
				<input class="field-input" type="password" placeholder="请输入密码(至少6位)" v-model="form.password" />
			</view>
			<view class="form-item">
				<text class="field-label">确认密码</text>
				<input class="field-input" type="password" placeholder="请再次输入密码" v-model="form.confirmPassword" />
			</view>
		</view>

		<view class="submit-bar">
			<button class="submit-btn" :disabled="submitting" @click="handleSubmit">
				{{ submitting ? '提交中...' : '提交并进入首页' }}
			</button>
		</view>
	</view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import api from '@/api'
import { readStoredUser } from '@/utils/user'

const submitting = ref(false)

const storedUser = readStoredUser()

const form = reactive({
	phone: storedUser?.phone || '',
	username: '',
	realName: '',
	password: '',
	confirmPassword: '',
})

function validate() {
	if (!form.phone) return '请输入手机号'
	if (!/^\d{11}$/.test(String(form.phone))) return '手机号格式不正确'
	if (!form.username || String(form.username).trim().length < 3) return '账号至少3位'
	if (String(form.username).trim().length > 30) return '账号最多30位'
	if (!form.realName || !String(form.realName).trim()) return '请输入真实姓名'
	if (String(form.realName).trim().length > 20) return '真实姓名最多20位'
	if (!form.password || form.password.length < 6) return '密码至少6位'
	if (form.password !== form.confirmPassword) return '两次密码不一致'
	return ''
}

async function handleSubmit() {
	const msg = validate()
	if (msg) {
		uni.showToast({ title: msg, icon: 'none' })
		return
	}

	submitting.value = true
	try {
		const res = await api.completeProfile({
			username: String(form.username).trim(),
			realName: String(form.realName).trim(),
			phone: String(form.phone),
			password: form.password,
		})

		if (res && res.success) {
			// 更新本地 token/user（后端会重新签发 token）
			if (res.token) uni.setStorageSync('token', res.token)
			if (res.user) uni.setStorageSync('user', res.user)

			uni.showToast({ title: '完善成功', icon: 'success', duration: 1200 })
			setTimeout(() => {
				uni.reLaunch({ url: '/pages/index/index' })
			}, 600)
		} else {
			uni.showToast({ title: res?.message || '提交失败', icon: 'none' })
		}
	} catch (e) {
		uni.showToast({ title: e?.message || '提交异常', icon: 'none' })
	} finally {
		submitting.value = false
	}
}
</script>

<style scoped>
.complete-page {
	background: #f5f5f5;
	min-height: 100vh;
	padding: 24rpx;
	padding-bottom: calc(24rpx + 120rpx + env(safe-area-inset-bottom));
}

.header {
	padding: 12rpx 0 24rpx;
}

.header-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #111;
}

.tips {
	background: #fff7e6;
	border: 1rpx solid #ffe7ba;
	padding: 20rpx 24rpx;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
}

.tips-text {
	color: #ad6800;
	font-size: 26rpx;
	line-height: 40rpx;
}

.form-card {
	background: #fff;
	border-radius: 16rpx;
	padding: 0 28rpx;
	overflow: hidden;
}

.form-item {
	display: flex;
	align-items: center;
	padding: 32rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.form-item:last-child {
	border-bottom: none;
}

.field-label {
	width: 160rpx;
	flex-shrink: 0;
	font-size: 30rpx;
	color: #333;
}

.field-input {
	flex: 1;
	font-size: 30rpx;
	color: #111;
	text-align: right;
}

.submit-bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 24rpx;
	padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
	background: transparent;
}

.submit-btn {
	width: 100%;
	height: 96rpx;
	border-radius: 48rpx;
	border: none;
	color: #fff;
	font-size: 34rpx;
	font-weight: 600;
	background: linear-gradient(135deg, #07c160, #2bd37d);
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 24rpx rgba(7, 193, 96, 0.25);
}

.submit-btn[disabled] {
	opacity: 0.6;
}

.submit-btn::after {
	border: none;
}
</style>

