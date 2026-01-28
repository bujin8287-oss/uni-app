<template>
	<view class="login-page">
		<view class="logo">
			<image class="logo-img" src="@/static/images/log.webp" mode="widthFix" />
		</view>
		<view class="form">
			<!-- 根据平台显示不同的登录组件 -->
			<!-- 微信小程序：显示微信登录和账号密码登录 -->
			<!-- #ifdef MP-WEIXIN -->
			<WechatLogin @success="handleLoginSuccess" @error="handleLoginError" />
			<view class="divider">
				<text class="divider-text">或</text>
			</view>
			<AccountLogin @success="handleLoginSuccess" @error="handleLoginError" />
			<!-- #endif -->

			<!-- App环境：显示一键登录、微信登录、QQ登录、Apple登录（iOS）和账号密码登录 -->
			<!-- #ifdef APP-PLUS -->
			<AccountLogin @success="handleLoginSuccess" @error="handleLoginError" />

			<UniverifyLogin v-if="showUniverify" @success="handleLoginSuccess" @error="handleLoginError"
				style="margin: 10rpx 0;" />

			<view v-if="showUniverify" class="divider">
				<text class="divider-text">其他登录方式</text>
			</view>
			<view style="display: flex; align-items: center; justify-content: space-between;">
				<WechatLogin @success="handleLoginSuccess" @error="handleLoginError" style="flex: 1; margin-right: 10rpx;" />
				<QQLogin @success="handleLoginSuccess" @error="handleLoginError" style="flex: 1; margin-right: 10rpx;" />
				<AppleLogin v-if="isIOS" @success="handleLoginSuccess" @error="handleLoginError" style="flex: 1;" />
			</view>
			<!-- #endif -->

			<!-- H5环境：显示账号密码登录和手机号登录 -->
			<!-- #ifdef H5 -->
			<view v-if="flag">
				<AccountLogin @success="handleLoginSuccess" @error="handleLoginError" />
			</view>
			<view v-else>
				<PhoneLogin @success="handleLoginSuccess" @error="handleLoginError" />
			</view>
			<!-- 登录方式切换按钮 -->
			<view class="login-tabs">
				<view :class="['login-tab', flag ? 'active' : '']" @click="switchLoginType(true)">
					<text>账号密码登录</text>
				</view>
				<view :class="['login-tab', !flag ? 'active' : '']" @click="switchLoginType(false)">
					<text>手机号登录</text>
				</view>
			</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import { getPlatform, isIOS as detectIOS } from '@/utils/platform'
import AccountLogin from '@/components/business/login/AccountLogin.vue'
import PhoneLogin from '@/components/business/login/PhoneLogin.vue'
import WechatLogin from '@/components/business/login/WechatLogin.vue'
import QQLogin from '@/components/business/login/QQLogin.vue'
import UniverifyLogin from '@/components/business/login/UniverifyLogin.vue'
import AppleLogin from '@/components/business/login/AppleLogin.vue'

const flag = ref(true)
const loading = ref(false)
const platform = ref(null)
const isIOS = ref(false)
const showUniverify = ref(false) // 是否显示一键登录（需要检查是否支持）

onLoad(() => {
	// 获取平台信息
	platform.value = getPlatform()
	// #ifdef APP-PLUS
	isIOS.value = detectIOS()
	// 检查是否支持一键登录（需要配置manifest.json）
	// 这里可以根据实际情况判断，暂时默认显示
	showUniverify.value = true
	// #endif
})

// 下拉刷新：重新加载页面数据，完成后停止刷新
onPullDownRefresh(() => {
	console.log('onPullDownRefresh')
	const result = reloadPage()
	if (result && typeof result.then === 'function') {
		result.then(() => uni.stopPullDownRefresh()).catch(() => uni.stopPullDownRefresh())
	} else {
		uni.stopPullDownRefresh()
	}
})

// Reload logic for the page; return a Promise so pull-down can wait
function reloadPage() {
	return new Promise((resolve) => {
		// Re-initialize any data or re-fetch if needed
		loading.value = false
		// short delay to allow UI to show refresh
		setTimeout(() => {
			resolve()
		}, 300)
	})
}

// 登录成功回调
function handleLoginSuccess(data) {
	console.log('登录成功', data)
	uni.reLaunch({ url: '/pages/index/index' })
}

// 登录失败回调
function handleLoginError(error) {
	console.error('登录失败', error)
	// 错误提示已在各组件内部处理
}

// 切换登录方式
function switchLoginType(isAccount) {
	flag.value = isAccount
}
</script>

<style scoped>
.login-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	padding-top: 80px;
}

.logo-img {
	width: 120px;
	height: 120px;
	border-radius: 8px;
	margin-bottom: 30px;
}

.form {
	width: 88%;
}

.divider {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 20px 0;
	position: relative;
}

.divider::before,
.divider::after {
	content: '';
	flex: 1;
	height: 1px;
	background: #e6e6e6;
}

.divider-text {
	padding: 0 12px;
	color: #999;
	font-size: 14px;
}

/* 登录方式切换标签 */
.login-tabs {
	display: flex;
	justify-content: center;
	gap: 20px;
	margin-bottom: 30px;
}

.login-tab {
	padding: 8px 20px;
	font-size: 16px;
	color: #666;
	cursor: pointer;
	position: relative;
	transition: color 0.3s;
}

.login-tab.active {
	color: #007aff;
	font-weight: 600;
}

.login-tab.active::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 30px;
	height: 2px;
	background: #007aff;
	border-radius: 1px;
}
</style>
