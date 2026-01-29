// 通用请求封装：用于调用后端真实接口
// ⚠️ APP 端运行时没有 URL / import.meta 等 Web API，使用它们可能导致白屏（如：URL is not defined）
// 注意：真机/模拟器环境下 localhost 指向“手机/模拟器自身”，不是电脑
// 推荐：按平台在此处写死后端地址，或用 uni.setStorageSync('API_BASE_URL', 'http://xxx:3000') 动态覆盖
function getBaseUrl() {
	// 允许运行时覆盖（方便不重新打包就切换后端地址）
	const runtimeUrl = uni.getStorageSync('API_BASE_URL')
	if (runtimeUrl) return runtimeUrl

	// 兜底：尽量给出在不同平台更合理的默认值
	// #ifdef H5
	return 'http://localhost:3000'
	// #endif

	// #ifdef APP-PLUS
	// APP 真机建议改为你电脑局域网 IP，例如 192.168.x.x
	return 'http://192.168.8.24:3000'
	// #endif

	// #ifdef MP-WEIXIN
	// 小程序不支持直接请求 localhost；需要用可访问的域名/服务器IP，并在小程序后台配置合法域名
	return 'http://127.0.0.1:3000'
	// #endif

	return 'http://localhost:3000'
}

const BASE_URL = getBaseUrl()

export function request({ url, method = 'GET', data = {}, header = {} } = {}) {
	return new Promise((resolve, reject) => {
		const token = uni.getStorageSync('token')
		const finalHeader = {
			'Content-Type': 'application/json',
			...header,
		}
		if (token) {
			finalHeader.Authorization = `Bearer ${token}`
		}

		uni.request({
			url: BASE_URL + url,
			method,
			data,
			header: finalHeader,
			success(res) {
				// 保留 statusCode，方便前端定位 401/403/500/503 等问题
				const body = res && res.data ? res.data : {}
				resolve({
					...body,
					__statusCode: res.statusCode,
					__errMsg: res.errMsg,
				})
			},
			fail(err) {
				reject(err)
			},
		})
	})
}

