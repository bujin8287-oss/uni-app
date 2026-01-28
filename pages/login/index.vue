<template>
	<view class="login-page">
		<view class="logo">
			<image class="logo-img" src="@/static/images/log.webp" mode="widthFix" />
		</view>
		<view class="form">
			<input v-model="username" type="text" placeholder="请输入账号" class="input" />
			<input v-model="password" password placeholder="请输入密码" class="input" />
			<button :disabled="loading" @click="accountLogin" class="login-btn">
				{{ loading ? '登录中...' : '账号密码登录' }}
			</button>
		</view>
	</view>
</template>

<script>
import api from '@/api'
export default {
	data() {
		return {
			username: '',
			password: '',
			loading: false
		}
	},
	// Handle pull-down refresh: reload page data and stop refresh when done
	onPullDownRefresh() {
		console.log('onPullDownRefresh')
		if (this.reloadPage && typeof this.reloadPage === 'function') {
			const result = this.reloadPage()
			if (result && typeof result.then === 'function') {
				result.then(() => uni.stopPullDownRefresh()).catch(() => uni.stopPullDownRefresh())
			} else {
				uni.stopPullDownRefresh()
			}
		} else {
			uni.stopPullDownRefresh()
		}
	},
	methods: {
		// Reload logic for the page; return a Promise so pull-down can wait
		reloadPage() {
			return new Promise((resolve) => {
				// Re-initialize any data or re-fetch if needed
				this.loading = false
				// short delay to allow UI to show refresh
				setTimeout(() => {
					resolve()
				}, 300)
			})
		},
		accountLogin() {
			if (!this.username || !this.password) {
				uni.showToast({
					title: '请输入账号和密码',
					icon: 'none'
				})
				return
			}
			this.loading = true
			api.accountLogin({ username: this.username, password: this.password }).then(res => {
				this.loading = false
				if (res && res.code === 0) {
					const { token, user } = res.data || {}
					if (token) uni.setStorageSync('token', token)
					if (user) uni.setStorageSync('user', user)
					uni.reLaunch({ url: '/pages/index/index' })
				} else {
					uni.showToast({
						title: res.message || '登录失败',
						icon: 'none'
					})
				}
			}).catch(err => {
				this.loading = false
				uni.showToast({
					title: err.message || '登录异常',
					icon: 'none'
				})
			})
		}
	}
}

uni.login({
	provider: 'univerify',
	univerifyStyle: { // 自定义登录框样式

		"fullScreen": false, // 是否全屏显示，默认值： false
		"backgroundColor": "#ffffff", // 授权页面背景颜色，默认值：#ffffff
		"backgroundImage": "", // 全屏显示的背景图片，默认值："" （仅支持本地图片，只有全屏显示时支持）
		"icon": {
			"path": "static/xxx.png", // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
			"width": "60px", //图标宽度 默认值：60px
			"height": "60px" //图标高度 默认值：60px
		},
		"closeIcon": {
			"path": "static/xxx.png", // 自定义显示在授权框中的logo，仅支持本地图片
			"width": "60px", //图标宽度 默认值：60px (HBuilderX 4.0+ 仅iOS支持)
			"height": "60px" //图标高度 默认值：60px (HBuilderX 4.0+ 仅iOS支持)
		},
		"phoneNum": {
			"color": "#202020" // 手机号文字颜色 默认值：#202020
		},
		"slogan": {
			"color": "#BBBBBB" // slogan 字体颜色 默认值：#BBBBBB
		},
		"authButton": {
			"normalColor": "#3479f5", // 授权按钮正常状态背景颜色 默认值：#3479f5
			"highlightColor": "#2861c5", // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）
			"disabledColor": "#73aaf5", // 授权按钮不可点击时背景颜色 默认值：#73aaf5（仅ios支持）
			"textColor": "#ffffff", // 授权按钮文字颜色 默认值：#ffffff
			"title": "本机号码一键登录", // 授权按钮文案 默认值：“本机号码一键登录”
			"borderRadius": "24px" // 授权按钮圆角 默认值："24px" （按钮高度的一半）
		},
		"otherLoginButton": {
			"visible": true, // 是否显示其他登录按钮，默认值：true
			"normalColor": "", // 其他登录按钮正常状态背景颜色 默认值：透明
			"highlightColor": "", // 其他登录按钮按下状态背景颜色 默认值：透明
			"textColor": "#656565", // 其他登录按钮文字颜色 默认值：#656565
			"title": "其他登录方式", // 其他登录方式按钮文字 默认值：“其他登录方式”
			"borderColor": "", //边框颜色 默认值：透明（仅iOS支持）
			"borderRadius": "0px" // 其他登录按钮圆角 默认值："24px" （按钮高度的一半）
		},
		"privacyTerms": {
			"defaultCheckBoxState": true, // 条款勾选框初始状态 默认值： true
			"isCenterHint": false, //未勾选服务条款时点击登录按钮的提示是否居中显示 默认值: false (3.7.13+ 版本支持)
			"uncheckedImage": "", // 可选 条款勾选框未选中状态图片（仅支持本地图片 建议尺寸 24x24px）(3.2.0+ 版本支持)
			"checkedImage": "", // 可选 条款勾选框选中状态图片（仅支持本地图片 建议尺寸24x24px）(3.2.0+ 版本支持)
			"checkBoxSize": 12, // 可选 条款勾选框大小
			"textColor": "#BBBBBB", // 文字颜色 默认值：#BBBBBB
			"termsColor": "#5496E3", // 协议文字颜色 默认值： #5496E3
			"prefix": "我已阅读并同意", // 条款前的文案 默认值：“我已阅读并同意”
			"suffix": "并使用本机号码登录", // 条款后的文案 默认值：“并使用本机号码登录”
			"privacyItems": [ // 自定义协议条款，最大支持2个，需要同时设置url和title. 否则不生效
				{
					"url": "https://", // 点击跳转的协议详情页面
					"title": "用户服务协议" // 协议名称
				}
			]
		},
		"buttons": { // 自定义页面下方按钮仅全屏模式生效（3.1.14+ 版本支持）
			"iconWidth": "45px", // 图标宽度（高度等比例缩放） 默认值：45px
			"list": [
				{
					"provider": "apple",
					"iconPath": "/static/apple.png" // 图标路径仅支持本地图片
				},
				{
					"provider": "weixin",
					"iconPath": "/static/wechat.png" // 图标路径仅支持本地图片
				}
			]
		}


	},
	success(res) { // 登录成功：保存授权结果到本地存储后跳转
		console.log('univerify success', res)
		// 兼容 authResult 为字符串或对象的情况
		let authResult = res && res.authResult !== undefined ? res.authResult : res
		try {
			// 如果是字符串尝试解析 JSON
			if (typeof authResult === 'string') {
				try {
					authResult = JSON.parse(authResult)
				} catch (e) {
					// 保留原始字符串
					authResult = { raw: authResult }
				}
			}
			// 提取可能的 token 字段
			const token = authResult && (authResult.access_token || authResult.accessToken || authResult.token || authResult.openid)
			// 存储授权结果与 token / user（若有）
			uni.setStorageSync('authResult', authResult)
			if (token) uni.setStorageSync('token', token)
			if (authResult && authResult.user) uni.setStorageSync('user', authResult.user)
		} catch (e) {
			console.error('store authResult error', e)
		}

		if (uni.closeAuthView) {
			uni.closeAuthView()
		}
		uni.reLaunch({ url: '/pages/index/index' })
	},
	fail(res) { // 登录失败
		uni.showToast({
			title: "手机号获取失败",
			icon: 'none'
		})
	}
})
</script>

<style scoped>
.login-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	padding-top: 80px;
	background: #f8f8f8;
	height: 100vh;
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

.input {
	width: 100%;
	height: 44px;
	padding: 8px 12px;
	border-radius: 6px;
	border: 1px solid #e6e6e6;
	margin-bottom: 16px;
	background: #fff;
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
}

.auto-btn {
	margin-top: 8px;
	background: #00c853;
}

.login-btn[disabled] {
	opacity: 0.6;
}
</style>
