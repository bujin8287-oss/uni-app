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

// Simulate WeChat login: accept a temporary code and return a token + user info
// (WeChat login mock removed)

// Simulate mobile one-click login: accept phone and return token + user info
export function mobileLogin({ phone, encryptedData, iv } = {}) {
	// 如果传入了 encryptedData（小程序一键获取），模拟后端解密并返回固定手机号
	if (encryptedData) {
		const simulatedPhone = '13800138000'
		const token = `mock-token-${simulatedPhone}`
		const user = { id: 1001, name: '模拟用户', phone: simulatedPhone }
		return withDelay({ code: 0, data: { token, user } }, 500)
	}
	if (!/^1\d{10}$/.test(String(phone || '').trim())) {
		return withDelay({ code: 1, message: '手机号不合法' }, 200)
	}
	const token = `mock-token-${phone}`
	const user = { id: 1001, name: '模拟用户', phone }
	return withDelay({ code: 0, data: { token, user } }, 500)
}

export function getSalesOrders({ page = 1, pageSize = 10 } = {}) {
	const total = 26
	const items = []
	for (let i = 0; i < pageSize; i++) {
		const id = (page - 1) * pageSize + i + 1
		if (id > total) break
		items.push({
			id,
			code: `XSDBH${String(id).padStart(8, '0')}`,
			productName: '笔记本电脑',
			totalQuantity: 1000,
			deliveryDate: '2025.10.01',
			type: '普通',
		})
	}
	return withDelay({ code: 0, data: { items, total, page, pageSize } }, 350)
}
export function getSalesOrderDetail({ code } = {}) {
	const demo = {
		code: code || 'XSDBH00000001',
		customerName: '霍的微漾有限公司',
		urgency: '普通',
		deliveryDate: '2025.10.01',
		productCode: 'CPHB00001',
		productName: '笔记本电脑',
		quantity: 1000,
		unit: '台',
		attachments: [
			{ name: '合同.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
			{ name: '封面.png', url: 'https://via.placeholder.com/800x600.png' },
		],
		remark: '新客户，注意',
	}
	return withDelay({ code: 0, data: demo }, 300)
}
// Product plan mocks
export function getProductPlans({ page = 1, pageSize = 10 } = {}) {
	const total = 12
	const items = []
	for (let i = 0; i < pageSize; i++) {
		const id = (page - 1) * pageSize + i + 1
		if (id > total) break
		items.push({
			id,
			code: `SCJHBH${String(id).padStart(8, '0')}`,
			product: '笔记本电脑普通',
			qty: 1000,
			date: '2025.05.01 ~ 2025.10.01',
			status: id % 2 === 0 ? '进行中' : '未开始',
		})
	}
	return withDelay({ code: 0, data: { items, total, page, pageSize } }, 300)
}

export function getProductPlanDetail({ code } = {}) {
	const demo = {
		code: code || 'SCJHBH00000001',
		customerName: '霍的微漾有限公司',
		productCode: 'CPBH00001',
		productName: '笔记本电脑普通',
		deliveryDate: '2025.10.01',
		quantity: 1000,
		unit: '台',
		urgency: '普通',
		createTime: '2025.03.12 10:00',
		creator: '刘超',
	}
	return withDelay({ code: 0, data: demo }, 300)
}
// Product order mocks
export function getProductOrders({ page = 1, pageSize = 10 } = {}) {
	const total = 20
	const items = []
	for (let i = 0; i < pageSize; i++) {
		const id = (page - 1) * pageSize + i + 1
		if (id > total) break
		items.push({
			id,
			code: `GDBH${String(id).padStart(8, '0')}`,
			productName: '笔记本电脑',
			quantity: 1000,
			dateRange: '2025.08.01 ~ 2025.10.01',
		})
	}
	return withDelay({ code: 0, data: { items, total, page, pageSize } }, 300)
}

export function getProductOrderDetail({ code } = {}) {
	const demo = {
		code: code || 'SCGD00000001',
		orderName: '外贸一生产工单',
		urgency: '普通',
		productCode: 'CPBH000001',
		productName: '笔记本电脑',
		quantity: 1000,
		produced: 800,
		unit: '台',
		batchNo: 'PCH000001',
		startDate: '2025.08.01',
		endDate: '2025.10.01',
		salesOrder: 'XSDDH000001',
		customerName: '霍的微漾有限公司',
		creator: '刘超',
	}
	return withDelay({ code: 0, data: demo }, 300)
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

export function getCustomers({ page = 1, pageSize = 10, query = '' } = {}) {
	const all = [
		'启航智联科技有限公司',
		'悦动新能源发展公司',
		'星瀚文化传媒工作室',
		'安瑞医药研发有限公司',
		'途顺物流运输集团',
		'创美家居设计公司',
		'恒信金融服务有限公司',
		'绿源生态农业发展公司',
		'锐科电子科技有限公司',
		'品尚餐饮管理集团',
		'博远工程建设有限公司',
		'乐活健康管理公司',
		'智诚法律咨询事务所',
	]
	const filtered = all.filter((name) => !query || name.includes(query))
	const total = filtered.length
	const items = filtered.slice((page - 1) * pageSize, page * pageSize).map((name, idx) => ({
		id: (page - 1) * pageSize + idx + 1,
		name,
	}))
	return withDelay({ code: 0, data: { items, total, page, pageSize } }, 300)
}

export function getProducts({ page = 1, pageSize = 10, query = '' } = {}) {
	const all = [
		{ code: 'CPHB00001', name: '无线快充双模机械键盘' },
		{ code: 'CPHB00002', name: '高清夜视双录行车记录仪' },
		{ code: 'CPHB00003', name: '便携式迷你投影仪' },
		{ code: 'CPHB00004', name: '智能手环心率监测手表' },
		{ code: 'CPHB00005', name: '高清4K智能网络电视' },
		{ code: 'CPHB00006', name: '便携式移动固态硬盘' },
		{ code: 'CPHB00007', name: '家用迷你激光打印机' },
		{ code: 'CPHB00008', name: '智能语音控制音箱' },
		{ code: 'CPHB00009', name: '无线充电立式手机支架' },
		{ code: 'CPHB00010', name: '高清运动相机防水套装' },
		{ code: 'CPHB00011', name: '电子墨水屏阅读器' },
		{ code: 'CPHB00012', name: '迷你无线鼠标静音款' },
		{ code: 'CPHB00013', name: '无线降噪头戴式耳机' },
	]
	const filtered = all.filter((p) => !query || p.code.includes(query) || p.name.includes(query))
	const total = filtered.length
	const items = filtered.slice((page - 1) * pageSize, page * pageSize)
	return withDelay({ code: 0, data: { items, total, page, pageSize } }, 300)
}
