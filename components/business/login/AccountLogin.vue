<template>
	<view class="account-login">
		<input v-model="username" type="text" placeholder="请输入账号" class="input" />
		<input v-model="password" password placeholder="请输入密码" class="input" />
		<button :disabled="loading" @click="handleLogin" class="login-btn">
			{{ loading ? '登录中...' : '账号密码登录' }}
		</button>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api'

const emit = defineEmits(['success', 'error'])

const username = ref('')
const password = ref('')
const loading = ref(false)

function handleLogin() {
	if (!username.value || !password.value) {
		uni.showToast({
			title: '请输入账号和密码',
			icon: 'none'
		})
		return
	}
	
	loading.value = true
	api.accountLogin({ username: username.value, password: password.value })
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
.account-login {
	width: 100%;
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
}

.login-btn[disabled] {
	opacity: 0.6;
}
</style>
