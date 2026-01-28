// API index — 目前使用 mock 实现，后续可替换为真实请求实现
import * as mock from './mock'

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
	accountLogin: mock.accountLogin,
}

export default api

