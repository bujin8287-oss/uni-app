<template>
	<view class="detail-page">
		<!-- 详情内容卡片 -->
		<view class="detail-card">
			<view class="info-row">
				<text class="info-label">异常编号</text>
				<text class="info-value">{{ detailData.code || '-' }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">生成工单</text>
				<text class="info-value">{{ detailData.workOrder || '-' }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">异常工序</text>
				<text class="info-value">{{ detailData.process || '-' }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">异常等级</text>
				<text class="info-value">{{ detailData.level || '-' }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">异常分类</text>
				<text class="info-value">{{ detailData.category || '-' }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">处理结果</text>
				<text class="info-value status-text" :class="detailData.status === 'unhandled' ? 'status-unhandled' : ''">{{ detailData.statusText || '-' }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">责任部门</text>
				<text class="info-value">{{ detailData.department || '-' }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">责任人</text>
				<text class="info-value">{{ detailData.responsiblePerson || '-' }}</text>
			</view>
		</view>

		<!-- 异常描述 -->
		<view class="description-section">
			<text class="section-title">异常描述</text>
			<text class="description-text">{{ detailData.description || '无' }}</text>
		</view>

		<!-- 处理按钮 -->
		<view class="action-bar" v-if="detailData.status === 'unhandled'">
			<button class="handle-btn" @click="goToHandle">处理</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'

const detailData = ref({
	code: '',
	workOrder: '',
	process: '',
	level: '',
	category: '',
	status: '',
	statusText: '',
	department: '',
	responsiblePerson: '',
	description: ''
})

// 是否是从列表页直接携带整条数据进来的
const loadedFromItem = ref(false)
const abnormalCode = ref('')

onLoad((options) => {
	// 优先从路由参数中获取整条记录，直接回显列表中点击的数据
	if (options.item) {
		try {
			const item = JSON.parse(decodeURIComponent(options.item))
			detailData.value = {
				...detailData.value,
				code: item.code || '',
				process: item.process || '',
				category: item.category || '',
				status: item.status || '',
				statusText: item.statusText || '',
				// 其他字段可根据后端实际返回再补充
			}
			loadedFromItem.value = true
			abnormalCode.value = detailData.value.code
			return
		} catch (e) {
			console.warn('解析异常详情参数失败', e)
		}
	}

	// 兼容旧逻辑：从路由参数获取异常编号，再去加载详情
	const code = options.code || options.id
	if (code) {
		abnormalCode.value = decodeURIComponent(code)
		loadDetailData(abnormalCode.value)
	}
})

onShow(() => {
	// 页面显示时重新加载数据，确保从处理页面返回时数据是最新的
	// 如果是从列表直接带了整条数据进来，则不需要再次覆盖
	if (!loadedFromItem.value && abnormalCode.value) {
		loadDetailData(abnormalCode.value)
	}
})

// 监听处理完成事件
uni.$on('abnormalHandled', (data) => {
	if (data.code === abnormalCode.value) {
		// 更新状态为已处理
		detailData.value.status = 'handled'
		detailData.value.statusText = '已处理'
	}
})

function loadDetailData(code) {
	// 模拟数据，实际应该从API获取
	const mockData = {
		'YCBH00000002': {
			code: 'YCBH00000002',
			workOrder: 'SCGD00002',
			process: '第三道工序',
			level: '一般异常',
			category: '质量异常',
			status: 'unhandled',
			statusText: '未处理',
			department: '设备管理部',
			responsiblePerson: '王蒙',
			description: '设备有异响,偶尔卡顿'
		},
		'YCBH00000001': {
			code: 'YCBH00000001',
			workOrder: 'SCGD00001',
			process: '第五道工序',
			level: '一般异常',
			category: '设备异常',
			status: 'unhandled',
			statusText: '未处理',
			department: '设备管理部',
			responsiblePerson: '王蒙',
			description: '设备有异响,偶尔卡顿'
		}
	}
	
	const data = mockData[code] || {
		code: code,
		workOrder: '-',
		process: '-',
		level: '-',
		category: '-',
		status: 'unhandled',
		statusText: '未处理',
		department: '-',
		responsiblePerson: '-',
		description: '无'
	}
	
	detailData.value = data
}

function goToHandle() {
	uni.navigateTo({
		url: `/pages/abnormal/handle?code=${encodeURIComponent(detailData.value.code)}`
	})
}
</script>

<style scoped>
.detail-page {
	background: #f7f6fb;
	min-height: 100vh;
	padding: 20rpx;
	padding-bottom: 120rpx;
	box-sizing: border-box;
}

.detail-card {
	background: #fff;
	border-radius: 12rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
}

.info-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
}

.info-row:last-child {
	border-bottom: none;
}

.info-label {
	color: #9b9b9b;
	font-size: 28rpx;
	flex-shrink: 0;
}

.info-value {
	color: #333;
	font-size: 28rpx;
	text-align: right;
	flex: 1;
	margin-left: 40rpx;
}

.status-text {
	font-weight: 500;
}

.status-unhandled {
	color: #ff5a5a;
}

.description-section {
	background: #fff;
	border-radius: 12rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
}

.section-title {
	color: #333;
	font-size: 28rpx;
	font-weight: 700;
	display: block;
	margin-bottom: 20rpx;
}

.description-text {
	color: #333;
	font-size: 28rpx;
	line-height: 1.6;
	display: block;
}

.action-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx;
	background: #fff;
	box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.handle-btn {
	width: 100%;
	height: 88rpx;
	background: linear-gradient(135deg, #7c66ff, #9b7fff);
	color: #fff;
	font-size: 32rpx;
	font-weight: 700;
	border-radius: 44rpx;
	border: none;
	display: flex;
	justify-content: center;
	align-items: center;
}

.handle-btn::after {
	border: none;
}
</style>
