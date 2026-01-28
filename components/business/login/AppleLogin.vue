<template>
	<view class="apple-login">
		<button :disabled="loading" @click="handleLogin" class="login-btn apple-btn">
			{{ loading ? '登录中...' : 'Apple登录' }}
		</button>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['success', 'error'])

const loading = ref(false)

function handleLogin() {
	loading.value = true
	
	// Apple登录（仅支持iOS App）
	// #ifdef APP-PLUS
	// 检查是否为iOS
	const systemInfo = uni.getSystemInfoSync()
	if (systemInfo.platform.toLowerCase() !== 'ios') {
		uni.showToast({
			title: 'Apple登录仅支持iOS设备',
			icon: 'none'
		})
		loading.value = false
		return
	}
	
	uni.login({
		provider: 'apple',
		success: (loginRes) => {
			const authResult = loginRes.authResult || loginRes
			const token = authResult.identityToken || authResult.authorizationCode || authResult.user
			
			if (token) {
				uni.setStorageSync('token', token)
				uni.setStorageSync('authResult', authResult)
				const user = authResult.user || { name: 'Apple用户' }
				if (user) uni.setStorageSync('user', user)
				loading.value = false
				emit('success', { token, user })
			} else {
				loading.value = false
				uni.showToast({
					title: 'Apple登录失败',
					icon: 'none'
				})
				emit('error', new Error('Apple登录失败'))
			}
		},
		fail: (err) => {
			loading.value = false
			uni.showToast({
				title: 'Apple登录失败',
				icon: 'none'
			})
			emit('error', err)
		}
	})
	// #endif
	
	// 非App环境不支持Apple登录
	// #ifndef APP-PLUS
	uni.showToast({
		title: '当前环境不支持Apple登录',
		icon: 'none'
	})
	loading.value = false
	// #endif
}
</script>

<style scoped>
.apple-login {
	width: 100%;
}

.login-btn {
	width: 100%;
	height: 44px;
	border-radius: 6px;
	text-align: center;
	line-height: 44px;
	font-size: 16px;
	border: none;
}

.apple-btn {
	background: #000000;
	color: #fff;
}

.login-btn[disabled] {
	opacity: 0.6;
}
</style>
