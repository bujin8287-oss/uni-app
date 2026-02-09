<template>
	<view class="edit-page">
		<view class="form-container">
			<!-- 基本信息 -->
			<view class="form-section">
				<view class="section-title">基本信息</view>
				
				<view class="form-item">
					<text class="label">模板名称 <text class="required">*</text></text>
					<input 
						class="input" 
						v-model="formData.name" 
						placeholder="请输入模板名称"
					/>
				</view>

				<view class="form-item">
					<text class="label">模板代码 <text class="required">*</text></text>
					<input 
						class="input" 
						v-model="formData.code" 
						placeholder="请输入唯一标识，如：EQUIPMENT_REPAIR"
					/>
				</view>

				<view class="form-item">
					<text class="label">分类 <text class="required">*</text></text>
					<picker 
						@change="onCategoryChange" 
						:value="categoryIndex" 
						:range="categoryOptions" 
						range-key="label"
					>
						<view class="picker-view">
							<text>{{ categoryOptions[categoryIndex]?.label || '请选择' }}</text>
							<text class="arrow">▼</text>
						</view>
					</picker>
				</view>

				<view class="form-item">
					<text class="label">状态</text>
					<picker 
						@change="onStatusChange" 
						:value="statusIndex" 
						:range="statusOptions" 
						range-key="label"
					>
						<view class="picker-view">
							<text>{{ statusOptions[statusIndex]?.label || '请选择' }}</text>
							<text class="arrow">▼</text>
						</view>
					</picker>
				</view>

				<view class="form-item">
					<text class="label">描述</text>
					<textarea 
						class="textarea" 
						v-model="formData.description" 
						placeholder="请输入模板描述"
						maxlength="200"
					/>
				</view>
			</view>

			<!-- 审批节点 -->
			<view class="form-section">
				<view class="section-header">
					<text class="section-title">审批节点</text>
					<button class="add-node-btn" @click="addNode">
						<text>+ 添加节点</text>
					</button>
				</view>

				<view 
					class="node-item" 
					v-for="(node, index) in formData.nodes" 
					:key="index"
				>
					<view class="node-header">
						<text class="node-number">节点 {{ index + 1 }}</text>
						<button class="delete-node-btn" @click="deleteNode(index)">
							<text>删除</text>
						</button>
					</view>

					<view class="node-form">
						<view class="form-item">
							<text class="label">节点名称 <text class="required">*</text></text>
							<input 
								class="input" 
								v-model="node.nodeName" 
								placeholder="如：部门经理审批"
							/>
						</view>

						<view class="form-item">
							<text class="label">节点类型 <text class="required">*</text></text>
							<picker 
								@change="(e) => onNodeTypeChange(e, index)" 
								:value="getNodeTypeIndex(node.nodeType)" 
								:range="nodeTypeOptions" 
								range-key="label"
							>
								<view class="picker-view">
									<text>{{ getNodeTypeLabel(node.nodeType) }}</text>
									<text class="arrow">▼</text>
								</view>
							</picker>
						</view>

						<view class="form-item">
							<text class="label">审批模式</text>
							<picker 
								@change="(e) => onApprovalModeChange(e, index)" 
								:value="getApprovalModeIndex(node.approvalMode)" 
								:range="approvalModeOptions" 
								range-key="label"
							>
								<view class="picker-view">
									<text>{{ getApprovalModeLabel(node.approvalMode) }}</text>
									<text class="arrow">▼</text>
								</view>
							</picker>
						</view>

						<view class="form-item">
							<view class="checkbox-item">
								<checkbox 
									:checked="node.autoPass" 
									@click="toggleAutoPass(index)"
								/>
								<text class="checkbox-label">自动通过</text>
							</view>
						</view>
					</view>
				</view>

				<view v-if="formData.nodes.length === 0" class="empty-nodes">
					<text>暂无审批节点，请添加</text>
				</view>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="footer">
			<button class="cancel-btn" @click="cancel">取消</button>
			<button class="submit-btn" @click="submit">保存</button>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const formData = ref({
	name: '',
	code: '',
	category: 'equipment',
	status: 'active',
	description: '',
	nodes: []
})

const categoryIndex = ref(0)
const statusIndex = ref(0)
const templateId = ref('')

const categoryOptions = [
	{ label: '设备管理', value: 'equipment' },
	{ label: '采购管理', value: 'purchase' },
	{ label: '请假', value: 'leave' },
	{ label: '报销', value: 'expense' },
	{ label: '其他', value: 'other' }
]

const statusOptions = [
	{ label: '启用', value: 'active' },
	{ label: '停用', value: 'inactive' }
]

const nodeTypeOptions = [
	{ label: '指定用户', value: 'user' },
	{ label: '指定岗位', value: 'position' },
	{ label: '部门负责人', value: 'department_manager' },
	{ label: '自动通过', value: 'auto' }
]

const approvalModeOptions = [
	{ label: '会签（全部通过）', value: 'and' },
	{ label: '或签（任一通过）', value: 'or' },
	{ label: '依次审批', value: 'sequential' }
]

onMounted(() => {
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	const options = currentPage.options
	
	if (options.id) {
		templateId.value = options.id
		loadTemplate(options.id)
	}
})

function loadTemplate(id) {
	uni.showLoading({ title: '加载中...' })
	uni.request({
		url: `http://localhost:3000/approval/templates/${id}`,
		method: 'GET',
		success: (res) => {
			uni.hideLoading()
			if (res.data.success) {
				const template = res.data.data
				formData.value = {
					name: template.name,
					code: template.code,
					category: template.category,
					status: template.status,
					description: template.description || '',
					nodes: template.nodes.map(node => ({
						nodeId: node.nodeId,
						nodeName: node.nodeName,
						nodeType: node.nodeType,
						approvalMode: node.approvalMode,
						autoPass: node.autoPass || false,
						order: node.order
					}))
				}
				
				// 更新选择器索引
				categoryIndex.value = categoryOptions.findIndex(opt => opt.value === template.category)
				statusIndex.value = statusOptions.findIndex(opt => opt.value === template.status)
			}
		},
		fail: () => {
			uni.hideLoading()
			uni.showToast({ title: '加载失败', icon: 'none' })
		}
	})
}

function onCategoryChange(e) {
	categoryIndex.value = e.detail.value
	formData.value.category = categoryOptions[e.detail.value].value
}

function onStatusChange(e) {
	statusIndex.value = e.detail.value
	formData.value.status = statusOptions[e.detail.value].value
}

function addNode() {
	const newNode = {
		nodeId: `node_${Date.now()}`,
		nodeName: '',
		nodeType: 'user',
		approvalMode: 'and',
		autoPass: false,
		order: formData.value.nodes.length + 1
	}
	formData.value.nodes.push(newNode)
}

function deleteNode(index) {
	uni.showModal({
		title: '确认删除',
		content: '确定要删除这个节点吗？',
		success: (res) => {
			if (res.confirm) {
				formData.value.nodes.splice(index, 1)
				// 重新排序
				formData.value.nodes.forEach((node, idx) => {
					node.order = idx + 1
				})
			}
		}
	})
}

function onNodeTypeChange(e, index) {
	formData.value.nodes[index].nodeType = nodeTypeOptions[e.detail.value].value
}

function onApprovalModeChange(e, index) {
	formData.value.nodes[index].approvalMode = approvalModeOptions[e.detail.value].value
}

function toggleAutoPass(index) {
	formData.value.nodes[index].autoPass = !formData.value.nodes[index].autoPass
}

function getNodeTypeIndex(type) {
	return nodeTypeOptions.findIndex(opt => opt.value === type)
}

function getNodeTypeLabel(type) {
	const option = nodeTypeOptions.find(opt => opt.value === type)
	return option ? option.label : '请选择'
}

function getApprovalModeIndex(mode) {
	return approvalModeOptions.findIndex(opt => opt.value === mode)
}

function getApprovalModeLabel(mode) {
	const option = approvalModeOptions.find(opt => opt.value === mode)
	return option ? option.label : '请选择'
}

function cancel() {
	uni.navigateBack()
}

function submit() {
	// 验证
	if (!formData.value.name) {
		uni.showToast({ title: '请输入模板名称', icon: 'none' })
		return
	}
	if (!formData.value.code) {
		uni.showToast({ title: '请输入模板代码', icon: 'none' })
		return
	}
	if (formData.value.nodes.length === 0) {
		uni.showToast({ title: '请至少添加一个审批节点', icon: 'none' })
		return
	}
	
	// 验证节点
	for (let i = 0; i < formData.value.nodes.length; i++) {
		const node = formData.value.nodes[i]
		if (!node.nodeName) {
			uni.showToast({ title: `请输入节点${i + 1}的名称`, icon: 'none' })
			return
		}
	}

	const userInfo = uni.getStorageSync('userInfo')
	if (!userInfo || !userInfo._id) {
		uni.showToast({ title: '请先登录', icon: 'none' })
		return
	}

	const data = {
		...formData.value,
		createdBy: userInfo._id
	}

	uni.showLoading({ title: templateId.value ? '更新中...' : '创建中...' })

	const url = templateId.value 
		? `http://localhost:3000/approval/templates/${templateId.value}?userId=${userInfo._id}`
		: 'http://localhost:3000/approval/templates?userId=' + userInfo._id
	
	const method = templateId.value ? 'PUT' : 'POST'

	uni.request({
		url,
		method,
		data,
		success: (res) => {
			uni.hideLoading()
			if (res.data.success) {
				uni.showToast({ 
					title: templateId.value ? '更新成功' : '创建成功', 
					icon: 'success' 
				})
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
			} else {
				uni.showToast({ title: res.data.message || '操作失败', icon: 'none' })
			}
		},
		fail: () => {
			uni.hideLoading()
			uni.showToast({ title: '操作失败', icon: 'none' })
		}
	})
}
</script>

<style scoped>
.edit-page {
	min-height: 100vh;
	background: #f7f6fb;
	padding-bottom: 120rpx;
}

.form-container {
	padding: 20rpx;
}

.form-section {
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 24rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}

.add-node-btn {
	padding: 12rpx 24rpx;
	background: #5672ff;
	color: #fff;
	border-radius: 8rpx;
	font-size: 24rpx;
	border: none;
}

.add-node-btn::after {
	border: none;
}

.form-item {
	margin-bottom: 24rpx;
}

.label {
	display: block;
	font-size: 26rpx;
	color: #666;
	margin-bottom: 12rpx;
}

.required {
	color: #f44336;
}

.input {
	width: 100%;
	padding: 20rpx;
	background: #f5f5f5;
	border-radius: 8rpx;
	font-size: 28rpx;
	box-sizing: border-box;
}

.textarea {
	width: 100%;
	min-height: 120rpx;
	padding: 20rpx;
	background: #f5f5f5;
	border-radius: 8rpx;
	font-size: 28rpx;
	box-sizing: border-box;
}

.picker-view {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	background: #f5f5f5;
	border-radius: 8rpx;
	font-size: 28rpx;
}

.arrow {
	color: #999;
	font-size: 20rpx;
}

.checkbox-item {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.checkbox-label {
	font-size: 28rpx;
	color: #333;
}

/* 节点样式 */
.node-item {
	background: #f9f9f9;
	border-radius: 12rpx;
	padding: 20rpx;
	margin-bottom: 16rpx;
	border: 2rpx solid #e0e0e0;
}

.node-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.node-number {
	font-size: 28rpx;
	font-weight: 600;
	color: #5672ff;
}

.delete-node-btn {
	padding: 8rpx 20rpx;
	background: #ffebee;
	color: #f44336;
	border-radius: 6rpx;
	font-size: 22rpx;
	border: none;
}

.delete-node-btn::after {
	border: none;
}

.node-form .form-item {
	margin-bottom: 16rpx;
}

.node-form .form-item:last-child {
	margin-bottom: 0;
}

.empty-nodes {
	text-align: center;
	padding: 60rpx 0;
	color: #999;
	font-size: 26rpx;
}

/* 底部操作栏 */
.footer {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	gap: 20rpx;
	padding: 20rpx;
	background: #fff;
	box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.cancel-btn,
.submit-btn {
	flex: 1;
	padding: 24rpx;
	border-radius: 12rpx;
	font-size: 28rpx;
	border: none;
}

.cancel-btn {
	background: #f5f5f5;
	color: #666;
}

.submit-btn {
	background: #5672ff;
	color: #fff;
}

.cancel-btn::after,
.submit-btn::after {
	border: none;
}
</style>
