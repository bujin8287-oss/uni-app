<template>
	<view class="wechat-login">
		<button :disabled="loading" @click="handleLogin" class="login-btn wechat-btn">
			<view class="btn-content">
				<image class="btn-icon" src="/static/icons/wechat.svg" mode="aspectFit" />
				<text>{{ loading ? '登录中...' : '微信登录' }}</text>
			</view>
		</button>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api'

const emit = defineEmits(['success', 'error'])

const loading = ref(false)

// 统一处理后端返回的登录结果
function handleLoginResponse(res) {
	loading.value = false

	if (!res) {
		uni.showToast({
			title: '登录失败，后端无响应',
			icon: 'none'
		})
		emit('error', new Error('登录失败，后端无响应'))
		return
	}

	// 后端 BJ 登录/微信登录返回结构：{ success, message, token, user, loginType, ... }
	if (res.success) {
		const { token, user, loginType } = res
		if (token) uni.setStorageSync('token', token)
		if (user) uni.setStorageSync('user', user)
		emit('success', { token, user, loginType: loginType || 'wechat' })
	} else {
		const errorMsg = res.message || '登录失败'
		uni.showToast({
			title: errorMsg,
			icon: 'none'
		})
		emit('error', new Error(errorMsg))
	}
}

function handleLogin() {
	loading.value = true

	// 微信小程序登录
	// #ifdef MP-WEIXIN
	uni.login({
		provider: 'weixin',
		success: (loginRes) => {
			if (loginRes.code) {
				// 将 code 发送到后端换取系统 token（真实后端接口）
				api.wechatLogin({
					code: loginRes.code,
					platform: 'mp-weixin'
				})
					.then(handleLoginResponse)
					.catch(err => {
						loading.value = false
						uni.showToast({
							title: err.message || '登录异常',
							icon: 'none'
						})
						emit('error', err)
					})
			} else {
				loading.value = false
				uni.showToast({
					title: '获取微信授权失败',
					icon: 'none'
				})
				emit('error', new Error('获取微信授权失败'))
			}
		},
		fail: (err) => {
			loading.value = false
			uni.showToast({
				title: '微信登录失败',
				icon: 'none'
			})
			emit('error', err)
		}
	})
	// #endif

	// App 微信登录
	// #ifdef APP-PLUS
	uni.login({
		provider: 'weixin',
		success: (loginRes) => {
			// App 微信登录返回的是 authResult，由后端统一处理并生成 token
			const authResult = loginRes.authResult || loginRes

			api.wechatLogin({
				platform: 'app-plus',
				authResult
			})
				.then(handleLoginResponse)
				.catch(err => {
					loading.value = false
					uni.showToast({
						title: err.message || '登录异常',
						icon: 'none'
					})
					emit('error', err)
				})
		},
		fail: (err) => {
			loading.value = false
			uni.showToast({
				title: '微信登录失败',
				icon: 'none'
			})
			emit('error', err)
		}
	})
	// #endif

	// H5 微信登录（需要跳转到微信授权页面）
	// #ifdef H5
	uni.showToast({
		title: 'H5环境暂不支持微信登录',
		icon: 'none'
	})
	loading.value = false
	// #endif
}
</script>

<style scoped>
.wechat-login {
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

.wechat-btn {
	background: #07c160;
	color: #fff;
}

.login-btn[disabled] {
	opacity: 0.6;
}
</style>
