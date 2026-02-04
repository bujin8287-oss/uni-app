// 用户相关的通用工具方法

// 读取本地存储中的 user（登录后由各登录方式写入）
export function readStoredUser() {
	try {
		const raw = uni.getStorageSync('user')
		if (!raw) return null
		return typeof raw === 'string' ? JSON.parse(raw) : raw
	} catch (e) {
		console.warn('readStoredUser error', e)
		return null
	}
}

// 根据 user 对象，解析一个用于展示的用户名
export function resolveUserName(user) {
	if (!user) return '未登录'
	return user.realName || user.username || user.name || '用户'
}

