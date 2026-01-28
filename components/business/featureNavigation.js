export function openFeature(item) {
	if (!item || !item.name) return

	// 销售订单跳转到销售订单页面
	if (item.name === '销售订单') {
		uni.navigateTo({ url: '/pages/workbench/plan-management/sales-order/index' })
		return
	}
	// 生产计划跳转到生产计划页面
	if (item.name === '生产计划') {
		uni.navigateTo({ url: '/pages/workbench/plan-management/product-plan/index' })
		return
	}
	// 生产报工跳转到生产报工页面
	if (item.name === '生产报工') {
		uni.navigateTo({ url: '/pages/workbench/product-management/product-record-sub/index' })
		return
	}
	// 生产工单跳转到生产工单页面
	if (item.name === '生产工单') {
		uni.navigateTo({ url: '/pages/workbench/product-management/product-order/index' })
		return
	}
	// 报工记录跳转到报工记录页面
	if (item.name === '报工记录') {
		uni.navigateTo({ url: '/pages/workbench/product-management/work-record/index' })
		return
	}
	// 生产达成跳转到生产达成页面
	if (item.name === '生产达成') {
		uni.navigateTo({ url: '/pages/workbench/product-management/product-complete/index' })
		return
	}
	// 生产准时跳转到生产准时页面
	if (item.name === '生产准时') {
		uni.navigateTo({ url: '/pages/workbench/product-management/product-on-time/index' })
		return
	}
	// 来料检验跳转到来料检验页面
	if (item.name === '来料检验') {
		uni.navigateTo({ url: '/pages/workbench/quality-control/incoming-inspection/index' })
		return
	}
	// 过程检验跳转到过程检验页面
	if (item.name === '过程检验') {
		uni.navigateTo({ url: '/pages/workbench/quality-control/process-inspection/index' })
		return
	}
	// 最终检验跳转到最终检验页面
	if (item.name === '最终检验') {
		uni.navigateTo({ url: '/pages/workbench/quality-control/final-inspection/index' })
		return
	}
	// 设备维修跳转到设备维修页面
	if (item.name === '设备维修') {
		uni.navigateTo({ url: '/pages/workbench/device-repair/index' })
		return
	}
	// 追溯管理跳转到追溯管理页面
	if (item.name === '追溯管理') {
		uni.navigateTo({ url: '/pages/workbench/quality-control/trace-management/index' })
		return
	}
	// 设备档案跳转到档案页面
	if (item.name === '设备档案') {
		uni.navigateTo({ url: '/pages/workbench/archive/index' })
		return
	}
	// 设备报废跳转到报废页面
	if (item.name === '设备报废') {
		uni.navigateTo({ url: '/pages/workbench/device-scrap/index' })
		return
	}
	// 仓库功能跳转（采购入库/生产领料/生产退料/产品出库）
	if (item.name === '采购入库') {
		uni.navigateTo({ url: '/pages/workbench/warehouse/purchase-inbound/index' })
		return
	}
	// 生产领料、生产退料、产品出库页面暂未开发，跳转到通用功能页
	if (item.name === '生产领料' || item.name === '生产退料' || item.name === '产品出库') {
		uni.showToast({
			title: '功能开发中',
			icon: 'none'
		})
		// 可选：跳转到通用功能页
		// const url = `/pages/feature/index?name=${encodeURIComponent(item.name)}`
		// uni.navigateTo({ url })
		return
	}

	// 其他功能跳转到通用功能页
	const url = `/pages/feature/index?name=${encodeURIComponent(item.name)}`
	uni.navigateTo({ url })
}
