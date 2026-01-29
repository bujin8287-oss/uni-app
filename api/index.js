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
	mobileLogin: mock.mobileLogin,

	// 账号密码登录：调用后端 /bj/login 接口，返回 { success, token, user, ... }
	accountLogin({ username, password } = {}) {
		return request({
			url: '/bj/login',
			method: 'POST',
			data: { username, password },
		})
	},
}

export default api