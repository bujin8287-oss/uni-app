// Mock API functions — 返回 Promise，模拟延迟
function withDelay(result, ms = 300) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(result), ms)
	})
}

export function getHomeStats({ timeRange = 'yesterday' } = {}) {
	// 用于首页统计卡片，支持昨日/本周/本月
	const dataMap = {
		yesterday: {
			production: 234,
			reachRate: '95.3%',
			passRate: '89.5%',
			reworkCount: 23,
			orders: 23,
			outbound: 345,
		},
		week: {
			production: 542,
			reachRate: '92.4%',
			passRate: '91.2%',
			reworkCount: 103,
			orders: 124,
			outbound: 890,
		},
		month: {
			production: 3408,
			reachRate: '93.6%',
			passRate: '91.7%',
			reworkCount: 268,
			orders: 869,
			outbound: 2030,
		},
	}
	
	const selected = dataMap[timeRange] || dataMap.yesterday
	const data = {
		production: selected.production,
		reachRate: selected.reachRate,
		passRate: selected.passRate,
		reworkCount: selected.reworkCount,
		orders: selected.orders,
		outbound: selected.outbound,
		timeRange, // 返回当前时间范围
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

// 账号密码登录：简单校验后返回固定用户信息
export function accountLogin({ username, password } = {}) {
	const u = String(username || '').trim()
	const p = String(password || '').trim()
	if (!u || !p) {
		return withDelay({ code: 1, message: '账号或密码不能为空' }, 200)
	}
	// 这里可以根据需要增加更多校验逻辑
	const token = `mock-token-${u}`
	const user = { id: 1001, name: '模拟用户', username: u }
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

// 设备保养相关 API
export function getMaintenanceList({ page = 1, pageSize = 10 } = {}) {
	const total = 25
	const items = []
	for (let i = 0; i < pageSize; i++) {
		const id = (page - 1) * pageSize + i + 1
		if (id > total) break
		items.push({
			id,
			code: `SBBYBH${String(id).padStart(7, '0')}`,
			deviceName: ['切割机', '焊接机', '打磨机', '喷涂机', '冲压机'][i % 5],
			maintainer: ['孙磊', '李伟', '陈曦', '王梓涵'][i % 4],
			maintenanceTime: '2025.04.24 14:00:00',
		})
	}
	return withDelay({ code: 0, data: { items, total, page, pageSize } }, 350)
}

export function getMaintenanceDetail({ id } = {}) {
	const data = {
		id: id || 1,
		code: `SBBYBH${String(id || 1).padStart(7, '0')}`,
		deviceName: '切割机',
		maintainer: '孙磊',
		maintenanceTime: '2025.04.24 14:00:00',
		content: '设备履带保养',
		images: ['/static/logo.png'],
		remark: '无',
	}
	return withDelay({ code: 0, data }, 300)
}

export function createMaintenance(data) {
	// 模拟创建保养记录
	const result = {
		id: Date.now(),
		...data,
	}
	return withDelay({ code: 0, data: result, message: '创建成功' }, 800)
}

export function getMaintenanceDevices() {
	const data = [
		{ id: 1, name: '螺杆式空压机' },
		{ id: 2, name: '活塞式空压机' },
		{ id: 3, name: '离心式空压机' },
		{ id: 4, name: '空气干燥机' },
		{ id: 5, name: '精密过滤器' },
		{ id: 6, name: '储气罐' },
		{ id: 7, name: '螺杆式冷水机' },
		{ id: 8, name: '风冷式冷水机' },
		{ id: 9, name: '水冷式冷水机' },
		{ id: 10, name: '工业冷却塔' },
		{ id: 11, name: '离心风机' },
		{ id: 12, name: '轴流风机' },
		{ id: 13, name: '罗茨风机' },
	]
	return withDelay({ code: 0, data }, 300)
}

export function getMaintainers() {
	const data = [
		{ id: 1, name: '李伟' },
		{ id: 2, name: '陈曦' },
		{ id: 3, name: '王梓涵' },
		{ id: 4, name: '赵雨桐' },
		{ id: 5, name: '刘畅' },
		{ id: 6, name: '张梦琪' },
		{ id: 7, name: '陈明宇' },
		{ id: 8, name: '杨悦' },
		{ id: 9, name: '黄思睿' },
		{ id: 10, name: '周浩然' },
		{ id: 11, name: '吴桐' },
	]
	return withDelay({ code: 0, data }, 300)
}

// 巡检点检相关 API
export function getInspectionList({ page = 1, pageSize = 10 } = {}) {
	const total = 25
	const items = []
	for (let i = 0; i < pageSize; i++) {
		const id = (page - 1) * pageSize + i + 1
		if (id > total) break
		items.push({
			id,
			code: `SBXDJBH${String(id).padStart(7, '0')}`,
			deviceName: ['切割机', '焊接机', '打磨机', '喷涂机', '冲压机'][i % 5],
			operator: ['孙磊', '李伟', '陈曦', '王梓涵'][i % 4],
			inspectionTime: '2025.04.24 14:00:00',
		})
	}
	return withDelay({ code: 0, data: { items, total, page, pageSize } }, 350)
}

export function getInspectionDetail({ id } = {}) {
	const data = {
		id: id || 1,
		code: `SBXDJBH${String(id || 1).padStart(7, '0')}`,
		deviceName: '切割机',
		operator: '孙磊',
		inspectionTime: '2025.04.24 14:00:00',
		content: '设备电机巡检点检',
		images: ['/static/logo.png'],
		remark: '无',
	}
	return withDelay({ code: 0, data }, 300)
}

export function createInspection(data) {
	// 模拟创建巡检点检记录
	const result = {
		id: Date.now(),
		...data,
	}
	return withDelay({ code: 0, data: result, message: '创建成功' }, 800)
}

export function getInspectionDevices() {
	const data = [
		{ id: 1, name: '螺杆式空压机' },
		{ id: 2, name: '活塞式空压机' },
		{ id: 3, name: '离心式空压机' },
		{ id: 4, name: '空气干燥机' },
		{ id: 5, name: '精密过滤器' },
		{ id: 6, name: '储气罐' },
		{ id: 7, name: '螺杆式冷水机' },
		{ id: 8, name: '风冷式冷水机' },
		{ id: 9, name: '水冷式冷水机' },
		{ id: 10, name: '工业冷却塔' },
		{ id: 11, name: '离心风机' },
		{ id: 12, name: '轴流风机' },
		{ id: 13, name: '罗茨风机' },
	]
	return withDelay({ code: 0, data }, 300)
}

export function getInspectionOperators() {
	const data = [
		{ id: 1, name: '李伟' },
		{ id: 2, name: '陈曦' },
		{ id: 3, name: '王梓涵' },
		{ id: 4, name: '赵雨桐' },
		{ id: 5, name: '刘畅' },
		{ id: 6, name: '张梦琪' },
		{ id: 7, name: '陈明宇' },
		{ id: 8, name: '杨悦' },
		{ id: 9, name: '黄思睿' },
		{ id: 10, name: '周浩然' },
		{ id: 11, name: '吴桐' },
	]
	return withDelay({ code: 0, data }, 300)
}

// 备品备件相关 API
export function getSparePartsList({ page = 1, pageSize = 10 } = {}) {
	const total = 25
	const items = []
	for (let i = 0; i < pageSize; i++) {
		const id = (page - 1) * pageSize + i + 1
		if (id > total) break
		items.push({
			id,
			code: `BPBJBH${String(id).padStart(7, '0')}`,
			name: ['轴承', '齿轮', '皮带', '链条', '密封圈'][i % 5],
			model: ['GGXH00001', 'GGXH00002', 'GGXH00003', 'GGXH00004', 'GGXH00005'][i % 5],
			usageDays: [30, 60, 90, 120, 180][i % 5],
		})
	}
	return withDelay({ code: 0, data: { items, total, page, pageSize } }, 350)
}

export function getSparePartDetail({ id } = {}) {
	const data = {
		id: id || 1,
		code: `BPBJBH${String(id || 1).padStart(7, '0')}`,
		name: '轴承',
		model: 'GGXH00001',
		usageDays: '30',
		unit: '个',
		period: '30天',
		manufacturer: '比亚华设备生产有限公司',
		images: ['/static/logo.png'],
		usageNotes: '定期检查，保持清洁',
	}
	return withDelay({ code: 0, data }, 300)
}

export function createSparePart(data) {
	// 模拟创建备品备件记录
	const result = {
		id: Date.now(),
		...data,
	}
	return withDelay({ code: 0, data: result, message: '创建成功' }, 800)
}

export function getUnits() {
	const data = [
		{ id: 1, name: '台' },
		{ id: 2, name: '个' },
		{ id: 3, name: '只' },
		{ id: 4, name: '条' },
		{ id: 5, name: '吨' },
		{ id: 6, name: '千克' },
	]
	return withDelay({ code: 0, data }, 300)
}

export function getSparePartsManufacturers() {
	const data = [
		{ id: 1, name: '比亚华设备生产有限公司' },
		{ id: 2, name: '华某产业股份有限公司' },
		{ id: 3, name: '启航智联科技有限公司' },
		{ id: 4, name: '悦动新能源发展公司' },
		{ id: 5, name: '星瀚文化传媒工作室' },
		{ id: 6, name: '安瑞医药研发有限公司' },
		{ id: 7, name: '途顺物流运输集团' },
		{ id: 8, name: '创美家居设计公司' },
		{ id: 9, name: '恒信金融服务有限公司' },
		{ id: 10, name: '绿源生态农业发展公司' },
	]
	return withDelay({ code: 0, data }, 300)
}

// 采购入库相关 API
export function getPurchaseInboundList({ page = 1, pageSize = 10 } = {}) {
	const total = 25
	const items = []
	for (let i = 0; i < pageSize; i++) {
		const id = (page - 1) * pageSize + i + 1
		if (id > total) break
		items.push({
			id,
			code: `RKBH${String(id).padStart(6, '0')}`,
			name: `产品原料入库${String(id).padStart(3, '0')}`,
			materialName: ['内存条', 'PCB 电路板', '贴片电阻', '贴片电容', '芯片（MCU / 处理器）'][i % 5],
			inboundTime: '2025.04.24 14:00:00',
		})
	}
	return withDelay({ code: 0, data: { items, total, page, pageSize } }, 350)
}

export function getPurchaseInboundDetail({ id } = {}) {
	const data = {
		id: id || 1,
		code: `RKBH${String(id || 1).padStart(6, '0')}`,
		name: '产品原料入库001',
		materialName: '内存条',
		specification: '16G',
		unit: '个',
		quantity: '1000',
		batchNo: 'PCH00001',
		warehouse: '一仓库',
		warehouseArea: '第一库区',
		warehouseLocation: 'AAAA库位',
		inboundTime: '2025.04.24 14:00:00',
		supplierName: '名博原料有限公司',
		inboundPerson: '李红',
		remark: '无',
	}
	return withDelay({ code: 0, data }, 300)
}

export function createPurchaseInbound(data) {
	// 模拟创建采购入库记录
	const result = {
		id: Date.now(),
		...data,
	}
	return withDelay({ code: 0, data: result, message: '创建成功' }, 800)
}

export function getSuppliers() {
	const data = [
		{ id: 1, name: '深圳华强芯城科技有限公司' },
		{ id: 2, name: '东莞联创电子材料有限公司' },
		{ id: 3, name: '苏州晶方半导体科技有限公司' },
		{ id: 4, name: '上海韦尔半导体股份有限公司' },
		{ id: 5, name: '广州长盈精密技术有限公司' },
		{ id: 6, name: '惠州德赛电池有限公司' },
		{ id: 7, name: '宁波舜宇光电信息有限公司' },
		{ id: 8, name: '深圳欧菲光科技有限公司' },
		{ id: 9, name: '昆山国显光电有限公司' },
		{ id: 10, name: '京东方科技集团股份有限公司' },
		{ id: 11, name: '深圳欣旺达电子股份有限公司' },
		{ id: 12, name: '珠海冠宇电池股份有限公司' },
		{ id: 13, name: '深圳顺络电子股份有限公司' },
	]
	return withDelay({ code: 0, data }, 300)
}

export function getMaterials() {
	const data = [
		{ id: 1, code: 'CPHB00001', name: 'PCB 电路板' },
		{ id: 2, code: 'CPHB00002', name: '贴片电阻' },
		{ id: 3, code: 'CPHB00003', name: '贴片电容' },
		{ id: 4, code: 'CPHB00004', name: '贴片电感' },
		{ id: 5, code: 'CPHB00005', name: '芯片（MCU / 处理器）' },
		{ id: 6, code: 'CPHB00006', name: '晶振' },
		{ id: 7, code: 'CPHB00007', name: '二极管' },
		{ id: 8, code: 'CPHB00008', name: '三极管' },
		{ id: 9, code: 'CPHB00009', name: '场效应管（MOS 管）' },
		{ id: 10, code: 'CPHB00010', name: '连接器（USB/HDMI/ 排针）' },
		{ id: 11, code: 'CPHB00011', name: '锂电池电芯' },
		{ id: 12, code: 'CPHB00012', name: '电池保护板' },
		{ id: 13, code: 'CPHB00013', name: '充电芯片' },
	]
	return withDelay({ code: 0, data }, 300)
}

export function getInboundUnits() {
	const data = [
		{ id: 1, name: '台' },
		{ id: 2, name: '箱' },
		{ id: 3, name: '吨' },
		{ id: 4, name: '个' },
		{ id: 5, name: '升' },
	]
	return withDelay({ code: 0, data }, 300)
}

export function getWarehouseLocations() {
	const data = [
		{ id: 1, name: 'AAAA库位' },
		{ id: 2, name: 'BBBB库位' },
		{ id: 3, name: 'CCCC库位' },
		{ id: 4, name: 'DDDD库位' },
		{ id: 5, name: 'EEEE库位' },
	]
	return withDelay({ code: 0, data }, 300)
}

export function getWarehouseAreas() {
	const data = [
		{ id: 1, name: '第一库区' },
		{ id: 2, name: '第二库区' },
		{ id: 3, name: '第三库区' },
		{ id: 4, name: '第四库区' },
		{ id: 5, name: '第五库区' },
	]
	return withDelay({ code: 0, data }, 300)
}

export function getWarehouses() {
	const data = [
		{ id: 1, name: '仓库一' },
		{ id: 2, name: '仓库二' },
		{ id: 3, name: '仓库三' },
		{ id: 4, name: '仓库四' },
		{ id: 5, name: '仓库五' },
	]
	return withDelay({ code: 0, data }, 300)
}

export function getInboundPersons() {
	const data = [
		{ id: 1, name: '李伟' },
		{ id: 2, name: '陈曦' },
		{ id: 3, name: '王梓涵' },
		{ id: 4, name: '赵雨桐' },
		{ id: 5, name: '刘畅' },
		{ id: 6, name: '张梦琪' },
		{ id: 7, name: '陈明宇' },
		{ id: 8, name: '杨悦' },
		{ id: 9, name: '黄思睿' },
		{ id: 10, name: '周浩然' },
		{ id: 11, name: '吴桐' },
		{ id: 12, name: '马雨欣' },
		{ id: 13, name: '朱星辰' },
	]
	return withDelay({ code: 0, data }, 300)
}
