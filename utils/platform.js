/**
 * 平台环境检测工具
 * 用于判断当前运行环境（微信小程序、App、Android、iOS等）
 */

/**
 * 获取当前平台信息
 * @returns {Object} 平台信息对象
 */
export function getPlatform() {
	// #ifdef MP-WEIXIN
	return {
		type: 'mp-weixin',
		name: '微信小程序',
		isMiniProgram: true,
		isApp: false,
		isH5: false,
		isAndroid: false,
		isIOS: false,
	}
	// #endif

	// #ifdef APP-PLUS
	const systemInfo = uni.getSystemInfoSync()
	const platform = systemInfo.platform.toLowerCase()
	return {
		type: 'app',
		name: platform === 'android' ? 'Android App' : 'iOS App',
		isMiniProgram: false,
		isApp: true,
		isH5: false,
		isAndroid: platform === 'android',
		isIOS: platform === 'ios',
	}
	// #endif

	// #ifdef H5
	return {
		type: 'h5',
		name: 'H5',
		isMiniProgram: false,
		isApp: false,
		isH5: true,
		isAndroid: false,
		isIOS: false,
	}
	// #endif

	// 默认返回
	return {
		type: 'unknown',
		name: '未知平台',
		isMiniProgram: false,
		isApp: false,
		isH5: false,
		isAndroid: false,
		isIOS: false,
	}
}

/**
 * 判断是否为微信小程序
 */
export function isWechatMiniProgram() {
	const platform = getPlatform()
	return platform.isMiniProgram && platform.type === 'mp-weixin'
}

/**
 * 判断是否为App
 */
export function isApp() {
	return getPlatform().isApp
}

/**
 * 判断是否为Android
 */
export function isAndroid() {
	return getPlatform().isAndroid
}

/**
 * 判断是否为iOS
 */
export function isIOS() {
	return getPlatform().isIOS
}

/**
 * 判断是否为H5
 */
export function isH5() {
	return getPlatform().isH5
}

export default {
	getPlatform,
	isWechatMiniProgram,
	isApp,
	isAndroid,
	isIOS,
	isH5,
}
