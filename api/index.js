// API index — 默认使用 mock，实现登录等功能时可替换为真实请求
import * as mock from './mock'
import { request } from './request'

export const api = {
	getHomeStats: mock.getHomeStats,
	getWorkbenchSections: mock.getWorkbenchSections,
	getAbnormalList: mock.getAbnormalList,
	getTodoList: mock.getTodoList,
	getMyData: mock.getMyData,
	getFeatureDetail: mock.getFeatureDetail,
	getSalesOrders: mock.getSalesOrders,
	getCustomers: mock.getCustomers,
	getProducts: mock.getProducts,
	getSalesOrderDetail: mock.getSalesOrderDetail,
	getProductPlans: mock.getProductPlans,
	getProductPlanDetail: mock.getProductPlanDetail,
	getProductOrders: mock.getProductOrders,
	getProductOrderDetail: mock.getProductOrderDetail,

	// 之前用于模拟登录的接口，保留以兼容其他地方的 mock 调用
	mobileLogin: mock.mobileLogin,

	// 账号密码登录：调用后端 /bj/login 接口，返回 { success, token, user, ... }
	accountLogin({ username, password } = {}) {
		return request({
			url: '/bj/login',
			method: 'POST',
			data: { username, password },
		})
	},

	// 微信登录：统一通过后端 /bj/wechat-login 接口处理
	// body: { code?, platform, authResult? }
	wechatLogin({ code, platform, authResult } = {}) {
		return request({
			url: '/bj/wechat-login',
			method: 'POST',
			data: {
				code,
				platform,
				authResult,
			},
		})
	},

	// 获取当前用户信息
	getMe() {
		return request({
			url: '/bj/me',
			method: 'GET',
		})
	},

	// 首次登录完善资料：绑定手机号、设置账号与密码
	completeProfile({ username, phone, password, realName } = {}) {
		return request({
			url: '/bj/complete-profile',
			method: 'POST',
			data: { username, phone, password, realName },
		})
	},

	// 一键登录：根据手机号验证用户是否存在
	univerifyLogin({ phone, accessToken, openid, authResult } = {}) {
		return request({
			url: '/bj/univerify-login',
			method: 'POST',
			data: { phone, accessToken, openid, authResult },
		})
	},

	// 组织架构管理 - 部门
	getDepartments() {
		return request({
			url: '/approval/departments',
			method: 'GET',
		})
	},

	createDepartment(data) {
		return request({
			url: '/approval/departments',
			method: 'POST',
			data,
		})
	},

	updateDepartment(id, data) {
		return request({
			url: `/approval/departments/${id}`,
			method: 'PUT',
			data,
		})
	},

	deleteDepartment(id) {
		return request({
			url: `/approval/departments/${id}`,
			method: 'DELETE',
		})
	},

	// 组织架构管理 - 岗位
	getPositions() {
		return request({
			url: '/approval/positions',
			method: 'GET',
		})
	},

	createPosition(data) {
		return request({
			url: '/approval/positions',
			method: 'POST',
			data,
		})
	},

	updatePosition(id, data) {
		return request({
			url: `/approval/positions/${id}`,
			method: 'PUT',
			data,
		})
	},

	deletePosition(id) {
		return request({
			url: `/approval/positions/${id}`,
			method: 'DELETE',
		})
	},
}

export default api