<template>
	<view class="qq-login">
		<button :disabled="loading" @click="handleLogin" class="login-btn qq-btn">
			<view class="btn-content">
				<image class="btn-icon" src="/static/icons/qq.svg" mode="aspectFit" />
				<text>{{ loading ? '登录中...' : 'QQ登录' }}</text>
			</view>
		</button>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['success', 'error'])

const loading = ref(false)

function handleLogin() {
	loading.value = true
	
	// QQ登录（主要支持App）
	// #ifdef APP-PLUS
	uni.login({
		provider: 'qq',
		success: (loginRes) => {
			const authResult = loginRes.authResult || loginRes
			const token = authResult.access_token || authResult.accessToken || authResult.openid
			
			if (token) {
				uni.setStorageSync('token', token)
				uni.setStorageSync('authResult', authResult)
				const user = authResult.user || { name: 'QQ用户' }
				if (user) uni.setStorageSync('user', user)
				loading.value = false
				emit('success', { token, user })
			} else {
				loading.value = false
				uni.showToast({
					title: 'QQ登录失败',
					icon: 'none'
				})
				emit('error', new Error('QQ登录失败'))
			}
		},
		fail: (err) => {
			loading.value = false
			uni.showToast({
				title: 'QQ登录失败',
				icon: 'none'
			})
			emit('error', err)
		}
	})
	// #endif
	
	// 小程序和H5不支持QQ登录
	// #ifndef APP-PLUS
	uni.showToast({
		title: '当前环境不支持QQ登录',
		icon: 'none'
	})
	loading.value = false
	// #endif
}
</script>

<style scoped>
.qq-login {
	width: 100%;
}

.btn-content {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	height: 44px;
}

.btn-icon {
	width: 20px;
	height: 20px;
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

.qq-btn {
	background: #12b7f5;
	color: #fff;
}

.login-btn[disabled] {
	opacity: 0.6;
}
</style>
