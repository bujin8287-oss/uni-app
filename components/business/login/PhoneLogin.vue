<template>
	<view class="phone-login">
		<input v-model="phone" type="number" placeholder="请输入手机号" class="input" maxlength="11" />
		<input v-model="code" type="number" placeholder="请输入验证码" class="input code-input" maxlength="6" />
		<button :disabled="codeLoading" @click="sendCode" class="code-btn">{{ codeText }}</button>
		<button :disabled="loading" @click="handleLogin" class="login-btn">
			{{ loading ? '登录中...' : '手机号登录' }}
		</button>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api'

const emit = defineEmits(['success', 'error'])

const phone = ref('')
const code = ref('')
const loading = ref(false)
const codeLoading = ref(false)
const codeText = ref('获取验证码')
const countdown = ref(0)

function sendCode() {
	if (!phone.value || !/^1\d{10}$/.test(phone.value)) {
		uni.showToast({
			title: '请输入正确的手机号',
			icon: 'none'
		})
		return
	}
	
	if (countdown.value > 0) return
	
	codeLoading.value = true
	// 模拟发送验证码
	setTimeout(() => {
		codeLoading.value = false
		uni.showToast({
			title: '验证码已发送',
			icon: 'success'
		})
		// 开始倒计时
		countdown.value = 60
		const timer = setInterval(() => {
			countdown.value--
			codeText.value = `${countdown.value}秒后重试`
			if (countdown.value <= 0) {
				clearInterval(timer)
				codeText.value = '获取验证码'
			}
		}, 1000)
	}, 500)
}

function handleLogin() {
	if (!phone.value || !/^1\d{10}$/.test(phone.value)) {
		uni.showToast({
			title: '请输入正确的手机号',
			icon: 'none'
		})
		return
	}
	
	if (!code.value || code.value.length !== 6) {
		uni.showToast({
			title: '请输入6位验证码',
			icon: 'none'
		})
		return
	}
	
	loading.value = true
	api.mobileLogin({ phone: phone.value })
		.then(res => {
			loading.value = false
			if (res && res.code === 0) {
				const { token, user } = res.data || {}
				if (token) uni.setStorageSync('token', token)
				if (user) uni.setStorageSync('user', user)
				emit('success', { token, user })
			} else {
				const errorMsg = res.message || '登录失败'
				uni.showToast({
					title: errorMsg,
					icon: 'none'
				})
				emit('error', new Error(errorMsg))
			}
		})
		.catch(err => {
			loading.value = false
			const errorMsg = err.message || '登录异常'
			uni.showToast({
				title: errorMsg,
				icon: 'none'
			})
			emit('error', err)
		})
}
</script>

<style scoped>
.phone-login {
	width: 100%;
	position: relative;
}

.input {
	width: 100%;
	height: 44px;
	padding: 8px 12px;
	border-radius: 6px;
	border: 1px solid #e6e6e6;
	margin-bottom: 16px;
	background: #fff;
	box-sizing: border-box;
}

.code-input {
	padding-right: 100px;
}

.code-btn {
	position: absolute;
	right: 0;
	top: 0;
	height: 44px;
	padding: 0 12px;
	background: #007aff;
	color: #fff;
	border-radius: 6px;
	font-size: 14px;
	border: none;
	line-height: 44px;
}

.code-btn[disabled] {
	opacity: 0.6;
}

.login-btn {
	width: 100%;
	height: 44px;
	background: #007aff;
	color: #fff;
	border-radius: 6px;
	text-align: center;
	line-height: 44px;
	font-size: 16px;
	border: none;
	margin-top: 16px;
}

.login-btn[disabled] {
	opacity: 0.6;
}
</style>
