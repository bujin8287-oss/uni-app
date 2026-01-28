<template>
	<view class="univerify-login">
		<button :disabled="loading" @click="handleLogin" class="login-btn univerify-btn">
			{{ loading ? '登录中...' : '本机号码一键登录' }}
		</button>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['success', 'error'])

const loading = ref(false)

function handleLogin() {
	loading.value = true
	
	// 一键登录（仅支持App）
	// #ifdef APP-PLUS
	uni.login({
		provider: 'univerify',
		univerifyStyle: {
			fullScreen: false,
			backgroundColor: '#ffffff',
			icon: {
				path: '/static/logo.png',
				width: '60px',
				height: '60px'
			},
			phoneNum: {
				color: '#202020'
			},
			slogan: {
				color: '#BBBBBB'
			},
			authButton: {
				normalColor: '#3479f5',
				highlightColor: '#2861c5',
				disabledColor: '#73aaf5',
				textColor: '#ffffff',
				title: '本机号码一键登录',
				borderRadius: '24px'
			},
			otherLoginButton: {
				visible: true,
				normalColor: '',
				highlightColor: '',
				textColor: '#656565',
				title: '其他登录方式',
				borderColor: '',
				borderRadius: '0px'
			},
			privacyTerms: {
				defaultCheckBoxState: false,
				isCenterHint: false,
				textColor: '#BBBBBB',
				termsColor: '#5496E3',
				prefix: '我已阅读并同意',
				suffix: '并使用本机号码登录',
				privacyItems: [
					{
						url: 'https://',
						title: '用户服务协议'
					}
				]
			}
		},
		success: (res) => {
			console.log('univerify success', res)
			let authResult = res && res.authResult !== undefined ? res.authResult : res
			
			try {
				if (typeof authResult === 'string') {
					try {
						authResult = JSON.parse(authResult)
					} catch (e) {
						authResult = { raw: authResult }
					}
				}
				
				const token = authResult && (authResult.access_token || authResult.accessToken || authResult.token || authResult.openid)
				
				uni.setStorageSync('authResult', authResult)
				if (token) uni.setStorageSync('token', token)
				if (authResult && authResult.user) uni.setStorageSync('user', authResult.user)
				
				if (uni.closeAuthView) {
					uni.closeAuthView()
				}
				
				loading.value = false
				emit('success', { token, user: authResult.user || { name: '用户' } })
			} catch (e) {
				console.error('store authResult error', e)
				loading.value = false
				uni.showToast({
					title: '登录处理失败',
					icon: 'none'
				})
				emit('error', e)
			}
		},
		fail: (res) => {
			loading.value = false
			uni.showToast({
				title: '手机号获取失败',
				icon: 'none'
			})
			emit('error', res)
		}
	})
	// #endif
	
	// 非App环境不支持一键登录
	// #ifndef APP-PLUS
	uni.showToast({
		title: '当前环境不支持一键登录',
		icon: 'none'
	})
	loading.value = false
	// #endif
}
</script>

<style scoped>
.univerify-login {
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

.univerify-btn {
	background: #3479f5;
	color: #fff;
}

.login-btn[disabled] {
	opacity: 0.6;
}
</style>
