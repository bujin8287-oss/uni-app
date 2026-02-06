<template>
	<view class="univerify-login">
		<button :disabled="loading" @click="handleLogin" class="login-btn univerify-btn">
			{{ loading ? '登录中...' : '本机号码一键登录' }}
		</button>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api'

const emit = defineEmits(['success', 'error'])

const loading = ref(false)

async function handleLogin() {
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
		success: async (res) => {
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
				
				// 打印完整的authResult以便调试
				console.log('authResult完整内容:', JSON.stringify(authResult, null, 2))
				
				// 从authResult中提取手机号
				// 根据uni-app文档，手机号可能在 phoneNumber 或 phone 字段中
				// 也可能在 res.phoneNumber 中（不在authResult中）
				let phone = authResult.phoneNumber || authResult.phone || authResult.mobile || res.phoneNumber
				const accessToken = authResult.access_token || authResult.accessToken
				const openid = authResult.openid || authResult.openId
				
				console.log('提取的信息:', { phone, hasAccessToken: !!accessToken, hasOpenid: !!openid })
				
				// 注意：uni.getPhoneNumber() 只能在云函数中使用，客户端不可用
				// 如果没有直接获取到手机号，但有access_token和openid，将传给后端处理
				// 后端需要通过运营商API获取手机号（需要配置运营商密钥）
				
				// 如果还是没有手机号，且没有accessToken和openid，返回错误
				if (!phone && (!accessToken || !openid)) {
					loading.value = false
					uni.showToast({
						title: '未获取到登录信息',
						icon: 'none'
					})
					emit('error', { message: '未获取到登录信息' })
					return
				}
				
				// 调用后端API验证手机号
				// 如果前端有手机号直接传，否则传access_token和openid让后端获取
				try {
					const response = await api.univerifyLogin({
						phone, // 如果有手机号直接传
						accessToken, // 如果没有手机号，传access_token
						openid, // 如果没有手机号，传openid
						authResult
					})
					
					if (response && response.success) {
						// 保存token和用户信息
						if (response.token) {
							uni.setStorageSync('token', response.token)
						}
						if (response.user) {
							uni.setStorageSync('user', response.user)
						}
						
						// 保存authResult（可选）
						uni.setStorageSync('authResult', authResult)
						
						if (uni.closeAuthView) {
							uni.closeAuthView()
						}
						
						loading.value = false
						// 传递登录类型标识，方便登录页面判断
						emit('success', { 
							token: response.token, 
							user: response.user,
							loginType: 'univerify' // 标识这是一键登录
						})
					} else {
						// 检查是否需要用户输入手机号
						if (response?.needPhoneInput || response?.code === 'NEED_PHONE_NUMBER') {
							// 需要用户输入手机号，弹出输入框
							uni.showModal({
								title: '请输入手机号',
								editable: true,
								placeholderText: '请输入11位手机号',
								success: async (modalRes) => {
									if (modalRes.confirm && modalRes.content) {
										const inputPhone = modalRes.content.trim()
										// 验证手机号格式
										if (!/^\d{11}$/.test(inputPhone)) {
											uni.showToast({
												title: '手机号格式不正确',
												icon: 'none'
											})
											loading.value = false
											return
										}
										
										// 使用用户输入的手机号重新调用登录接口
										try {
											const retryResponse = await api.univerifyLogin({
												phone: inputPhone,
												accessToken,
												openid,
												authResult
											})
											
											if (retryResponse && retryResponse.success) {
												if (retryResponse.token) {
													uni.setStorageSync('token', retryResponse.token)
												}
												if (retryResponse.user) {
													uni.setStorageSync('user', retryResponse.user)
												}
												
												if (uni.closeAuthView) {
													uni.closeAuthView()
												}
												
												loading.value = false
												emit('success', { 
													token: retryResponse.token, 
													user: retryResponse.user,
													loginType: 'univerify'
												})
											} else {
												loading.value = false
												uni.showToast({
													title: retryResponse?.message || '登录失败',
													icon: 'none'
												})
												emit('error', retryResponse)
											}
										} catch (retryError) {
											loading.value = false
											uni.showToast({
												title: retryError?.message || '登录失败',
												icon: 'none'
											})
											emit('error', retryError)
										}
									} else {
										loading.value = false
									}
								}
							})
						} else {
							loading.value = false
							uni.showToast({
								title: response?.message || '登录失败',
								icon: 'none'
							})
							emit('error', response)
						}
					}
				} catch (apiError) {
					console.error('调用后端API失败', apiError)
					loading.value = false
					uni.showToast({
						title: apiError?.message || '验证手机号失败',
						icon: 'none'
					})
					emit('error', apiError)
				}
			} catch (e) {
				console.error('处理authResult失败', e)
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
