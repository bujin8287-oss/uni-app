// Mock API functions — 返回 Promise，模拟延迟
function withDelay(result, ms = 300) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(result), ms)
	})
}

export function getHomeStats() {
	// 用于首页统计卡片
	const data = {
		yesterdayProduction: 234,
		reachRate: '95.3%',
		passRate: '89.5%',
		reworkCount: 23,
		yesterdayOrders: 23,
		yesterdayOutbound: 345,
	}
	return withDelay({ code: 0, data })
}

export function getWorkbenchSections() {
	const data = [
		{
			key: 'plan',
			title: '计划管理',
			items: [
				{ name: '销售订单', icon: 'sales_order' },
				{ name: '生产计划', icon: 'plan' },
			],
		},
		{
			key: 'production',
			title: '生产管理',
			items: [
				{ name: '生产工单', icon: 'work_order' },
				{ name: '生产报工', icon: 'report' },
				{ name: '报工记录', icon: 'record' },
				{ name: '生产达成', icon: 'achieve' },
				{ name: '生产准时', icon: 'ontime' },
			],
		},
		{
			key: 'quality',
			title: '质量管理',
			items: [
				{ name: '来料检验', icon: 'incoming' },
				{ name: '过程检验', icon: 'process' },
				{ name: '最终检验', icon: 'final' },
				{ name: '追溯管理', icon: 'trace' },
			],
		},
	]
	return withDelay({ code: 0, data })
}

export function getAbnormalList({ page = 1, pageSize = 10 } = {}) {
	const total = 25
	const items = []
	for (let i = 0; i < pageSize; i++) {
		const id = (page - 1) * pageSize + i + 1
		if (id > total) break
		items.push({
			id,
			code: `YCBH${String(id).padStart(8, '0')}`,
			process: '第五道工序',
			category: '设备异常',
			time: '2025-04-23 14:00:20',
			status: ['unhandled', 'processing', 'handled'][id % 3],
			statusText: ['未处理', '处理中', '已处理'][id % 3],
		})
	}
	return withDelay({ code: 0, data: { items, total, page, pageSize } }, 400)
}

export function getTodoList({ page = 1, pageSize = 10 } = {}) {
	const total = 12
	const items = []
	for (let i = 0; i < pageSize; i++) {
		const id = (page - 1) * pageSize + i + 1
		if (id > total) break
		items.push({
			id,
			tag: '审批特办',
			title: `审批任务 ${id}`,
			initiator: '李民浩',
			node: '处理人',
			time: '2025-04-23 14:00:20',
			status: id % 4 === 0 ? 'handled' : 'unhandled',
			statusText: id % 4 === 0 ? '已办结' : '未处理',
		})
	}
	return withDelay({ code: 0, data: { items, total, page, pageSize } }, 350)
}

export function getMyData() {
	const data = {
		user: { name: '刘明湘', company: '华某产业股份有限公司' },
		stats: { devices: 158, parts: 5846 },
		tasks: [
			{ title: '工单任务', completed: 1, total: 5, rate: '20%' },
			{ title: '待办任务', completed: 2, total: 4, rate: '50%' },
			{ title: '异常管理', completed: 3, total: 3, rate: '100%' },
		],
	}
	return withDelay({ code: 0, data })
}

export function getFeatureDetail({ name = '功能页面', code } = {}) {
	return withDelay({
		code: 0,
		data: { name, code, description: `这是 ${name} 的模拟详情数据` },
	})
}

export function loginWithPassword({ username, password } = {}) {
	// 简单模拟：任意非空用户名密码成功
	if (!username || !password) {
		return withDelay({ code: 1, message: '用户名或密码不能为空' }, 200)
	}
	return withDelay({ code: 0, data: { token: 'mock-token-password', user: { name: username } } }, 400)
}

export function loginWithPhone({ phone } = {}) {
	// 模拟一键登录：若手机号格式简单校验通过则成功
	const phoneStr = String(phone || '')
	const phoneOk = /^[0-9]{11}$/.test(phoneStr)
	if (!phoneOk) {
		return withDelay({ code: 1, message: '手机号格式不正确' }, 200)
	}
	// 返回用户信息和token
	return withDelay({ code: 0, data: { token: 'mock-token-phone', user: { name: `用户${phoneStr.slice(-4)}` } } }, 500)
}
export function getDeviceList() {
	const data = [
		{
			id: 1,
			name: '车床',
			code: 'SBBH0000001',
			useDate: '2025.04.24',
			department: '第一生产车间',
		},
		{
			id: 2,
			name: '车床',
			code: 'SBBH0000002',
			useDate: '2025.04.24',
			department: '第一生产车间',
		},
		{
			id: 3,
			name: '车床',
			code: 'SBBH0000003',
			useDate: '2025.04.24',
			department: '第一生产车间',
		},
		{
			id: 4,
			name: '车床',
			code: 'SBBH0000004',
			useDate: '2025.04.24',
			department: '第一生产车间',
		},
		{
			id: 5,
			name: '车床',
			code: 'SBBH0000005',
			useDate: '2025.04.24',
			department: '第一生产车间',
		},
		{
			id: 6,
			name: '车床',
			code: 'SBBH0000006',
			useDate: '2025.04.24',
			department: '第一生产车间',
		},
	]
	return withDelay({ code: 0, data }, 300)
}

export function getDeviceDetail({ id } = {}) {
	const data = {
		id: id || 1,
		code: 'SBBH0000001',
		name: '车床',
		model: 'GGXH00001',
		serialNumber: 'CCBH00001',
		serviceLife: '20',
		startDate: '2020.01.01',
		assetCode: 'GDZC000001',
		manufacturer: '比亚华设备生产有限公司',
		department: '第一生产车间',
		images: [
			'/static/logo.png', // 使用项目中的示例图片
		],
		remark: '无',
	}
	return withDelay({ code: 0, data }, 300)
}

export function getDeviceScrapList() {
	const data = [
		{
			id: 1,
			code: 'BFDBH0000001',
			name: '车床',
			serviceLife: '20',
			scrapDate: '2025.04.24',
		},
		{
			id: 2,
			code: 'BFDBH0000001',
			name: '车床',
			serviceLife: '20',
			scrapDate: '2025.04.24',
		},
		{
			id: 3,
			code: 'BFDBH0000001',
			name: '车床',
			serviceLife: '20',
			scrapDate: '2025.04.24',
		},
		{
			id: 4,
			code: 'BFDBH0000001',
			name: '车床',
			serviceLife: '20',
			scrapDate: '2025.04.24',
		},
		{
			id: 5,
			code: 'BFDBH0000001',
			name: '车床',
			serviceLife: '20',
			scrapDate: '2025.04.24',
		},
		{
			id: 6,
			code: 'BFDBH0000001',
			name: '车床',
			serviceLife: '20',
			scrapDate: '2025.04.24',
		},
	]
	return withDelay({ code: 0, data }, 300)
}

export function getDeviceScrapDetail({ id } = {}) {
	const data = {
		id: id || 1,
		scrapCode: 'BFDBH000001',
		deviceCode: 'SBBH0000001',
		deviceName: '车床',
		model: 'GGXH00001',
		usedYears: '20',
		startDate: '2020.01.01',
		assetCode: 'GDZC000001',
		manufacturer: '比亚华设备生产有限公司',
		applicant: '张浩',
		scrapDate: '2025.04.24 14:00:00',
		reason: '无法正常使用',
	}
	return withDelay({ code: 0, data }, 300)
}

export function getDeviceRepairList() {
	const data = [
		{
			id: 1,
			code: 'WXDH00000001',
			deviceName: '切割机',
			reporter: '孙磊',
			department: '第五生产车间',
			reportTime: '2025.04.24',
			status: 'pending',
			statusText: '未处理',
		},
		{
			id: 2,
			code: 'WXDH00000001',
			deviceName: '切割机',
			reporter: '孙磊',
			department: '第五生产车间',
			reportTime: '2025.04.24',
			status: 'pending',
			statusText: '未处理',
		},
		{
			id: 3,
			code: 'WXDH00000001',
			deviceName: '切割机',
			reporter: '孙磊',
			department: '第五生产车间',
			reportTime: '2025.04.24',
			status: 'pending',
			statusText: '未处理',
		},
		{
			id: 4,
			code: 'WXDH00000001',
			deviceName: '切割机',
			reporter: '孙磊',
			department: '第五生产车间',
			reportTime: '2025.04.24',
			status: 'completed',
			statusText: '已处理',
		},
		{
			id: 5,
			code: 'WXDH00000001',
			deviceName: '切割机',
			reporter: '孙磊',
			department: '第五生产车间',
			reportTime: '2025.04.24',
			status: 'completed',
			statusText: '已处理',
		},
		{
			id: 6,
			code: 'WXDH00000001',
			deviceName: '切割机',
			reporter: '孙磊',
			department: '第五生产车间',
			reportTime: '2025.04.24',
			status: 'completed',
			statusText: '已处理',
		},
	]
	return withDelay({ code: 0, data }, 300)
}

export function getDeviceRepairDetail({ id } = {}) {
	const data = {
		id: id || 1,
		repairCode: 'BXDBH00001',
		deviceCode: 'SBBH0000001',
		deviceName: '切割机',
		department: '第五生产车间',
		reporter: '孙磊',
		reportTime: '2025.04.24 14:00:00',
		faultDescription: '设备有异响，偶尔卡顿',
		result: '已恢复正常',
		handler: '章邵',
		causeAnalysis: '设备零件损坏',
		solution: '更换零件',
		images: [
			'/static/logo.png',
		],
	}
	return withDelay({ code: 0, data }, 300)
}

