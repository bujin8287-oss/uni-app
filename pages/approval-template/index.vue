<template>
	<view class="template-page">
		<!-- 顶部操作栏 -->
		<view class="header">
			<view class="tabs">
				<view 
					class="tab-item" 
					:class="{ active: currentTab === 'tree' }" 
					@click="switchTab('tree')"
				>
					流程树
				</view>
				<view 
					class="tab-item" 
					:class="{ active: currentTab === 'list' }" 
					@click="switchTab('list')"
				>
					模板列表
				</view>
			</view>
		</view>

		<!-- 流程树视图 -->
		<scroll-view v-if="currentTab === 'tree'" class="content" scroll-y scroll-x>
			<view class="template-selector">
				<picker @change="onTemplateChange" :value="selectedIndex" :range="templates" range-key="name">
					<view class="picker-view">
						<text>{{ selectedTemplate?.name || '请选择审批模板' }}</text>
						<text class="arrow">▼</text>
					</view>
				</picker>
			</view>

			<!-- 模板操作按钮 -->
			<view v-if="selectedTemplate" class="template-actions">
				<button class="action-btn edit-template-btn" @click="editTemplateInfo">
					<text class="btn-icon">✏️</text>
					<text>编辑模板信息</text>
				</button>
				<button class="action-btn delete-template-btn" @click="deleteCurrentTemplate">
					<text class="btn-icon">🗑️</text>
					<text>删除模板</text>
				</button>
			</view>

			<view v-if="selectedTemplate" class="flow-tree-wrapper">
				<view class="flow-tree-container">
					<!-- 开始节点 -->
					<view class="tree-level">
						<view class="tree-node-wrapper">
							<view class="tree-node-box start-node">
								<text class="node-icon">🚀</text>
								<text class="node-title">发起申请</text>
							</view>
							<view class="connector-down"></view>
						</view>
					</view>

					<!-- 添加第一个节点按钮 -->
					<view v-if="selectedTemplate.nodes.length === 0" class="tree-level">
						<button class="add-node-btn-inline" @click="addNodeAtPosition(0)">
							<text class="add-icon">+</text>
							<text>添加审批节点</text>
						</button>
					</view>

					<!-- 审批节点 -->
					<view 
						v-for="(node, index) in selectedTemplate.nodes" 
						:key="node.nodeId"
						class="tree-level"
					>
						<view class="tree-node-wrapper">
							<view class="tree-node-box approval-node" :class="getNodeClass(node)">
								<view class="node-header">
									<text class="node-icon">{{ getNodeIcon(node) }}</text>
									<text class="node-title">{{ node.nodeName }}</text>
								</view>
								<text class="node-type">{{ getNodeTypeText(node.nodeType) }}</text>
								<text class="node-mode">{{ getApprovalModeText(node.approvalMode) }}</text>
								
								<!-- 节点操作按钮 -->
								<view class="node-actions">
									<button class="node-action-btn edit" @click.stop="editNode(index)">
										<text>✏️</text>
									</button>
									<button class="node-action-btn delete" @click.stop="deleteNode(index)">
										<text>🗑️</text>
									</button>
								</view>
							</view>
							
							<!-- 在节点之间添加节点的按钮 -->
							<view class="connector-down"></view>
							<button class="add-node-btn-between" @click="addNodeAtPosition(index + 1)">
								<text class="add-icon">+</text>
							</button>
							<view class="connector-down"></view>
						</view>
					</view>

					<!-- 结束节点 -->
					<view class="tree-level">
						<view class="tree-node-wrapper">
							<view class="tree-node-box end-node">
								<text class="node-icon">✅</text>
								<text class="node-title">审批完成</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view v-if="!selectedTemplate" class="empty">
				<text class="empty-text">请选择审批模板查看流程</text>
			</view>
		</scroll-view>

		<!-- 模板列表视图 -->
		<scroll-view v-if="currentTab === 'list'" class="content" scroll-y>
			<view 
				class="template-card" 
				v-for="item in templates" 
				:key="item._id"
			>
				<view class="card-header" @click="viewTemplateTree(item)">
					<text class="title">{{ item.name }}</text>
					<view class="status" :class="item.status">
						{{ item.status === 'active' ? '启用' : '停用' }}
					</view>
				</view>
				<view class="card-body" @click="viewTemplateTree(item)">
					<view class="info-row">
						<text class="label">分类：</text>
						<text class="value">{{ getCategoryText(item.category) }}</text>
					</view>
					<view class="info-row">
						<text class="label">节点数：</text>
						<text class="value">{{ item.nodes.length }} 个</text>
					</view>
					<view class="info-row">
						<text class="label">描述：</text>
						<text class="value">{{ item.description || '-' }}</text>
					</view>
				</view>
				<view class="card-actions">
					<button class="action-btn edit-btn" @click.stop="editTemplate(item)">
						<text class="btn-icon">✏️</text>
						<text>编辑</text>
					</button>
					<button class="action-btn delete-btn" @click.stop="deleteTemplate(item)">
						<text class="btn-icon">🗑️</text>
						<text>删除</text>
					</button>
				</view>
			</view>

			<view v-if="templates.length === 0 && !loading" class="empty">
				<text class="empty-text">暂无审批模板</text>
			</view>
		</scroll-view>

		<!-- 添加按钮 -->
		<view v-if="currentTab === 'list'" class="fab" @click="addTemplate">
			<text class="fab-icon">+</text>
		</view>

		<!-- 加载状态 -->
		<view v-if="loading" class="loading">
			<text>加载中...</text>
		</view>

		<!-- 编辑节点弹窗 -->
		<view v-if="showNodeEditor" class="modal-overlay" @click="closeNodeEditor">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">{{ editingNodeIndex === -1 ? '添加节点' : '编辑节点' }}</text>
					<button class="close-btn" @click="closeNodeEditor">✕</button>
				</view>
				
				<view class="modal-body">
					<view class="form-item">
						<text class="label">节点名称 <text class="required">*</text></text>
						<input 
							class="input" 
							v-model="editingNode.nodeName" 
							placeholder="如：部门经理审批"
						/>
					</view>

					<view class="form-item">
						<text class="label">节点类型 <text class="required">*</text></text>
						<picker 
							@change="onEditNodeTypeChange" 
							:value="getNodeTypeIndex(editingNode.nodeType)" 
							:range="nodeTypeOptions" 
							range-key="label"
						>
							<view class="picker-view">
								<text>{{ getNodeTypeLabel(editingNode.nodeType) }}</text>
								<text class="arrow">▼</text>
							</view>
						</picker>
					</view>

					<!-- 根据节点类型显示不同的审批人选择 -->
					<view v-if="editingNode.nodeType === 'user'" class="form-item">
						<text class="label">指定用户</text>
						<button class="select-btn" @click="selectUsers">
							<text>{{ getSelectedUsersText() }}</text>
						</button>
					</view>

					<view v-if="editingNode.nodeType === 'position'" class="form-item">
						<text class="label">指定岗位 <text class="required">*</text></text>
						<button class="select-btn" @click="selectPositions">
							<text>{{ getSelectedPositionsText() }}</text>
						</button>
					</view>

					<view v-if="editingNode.nodeType === 'department_manager'" class="form-item">
						<text class="info-text">💡 将自动使用申请人所在部门的负责人</text>
					</view>

					<view class="form-item">
						<text class="label">审批模式</text>
						<picker 
							@change="onEditApprovalModeChange" 
							:value="getApprovalModeIndex(editingNode.approvalMode)" 
							:range="approvalModeOptions" 
							range-key="label"
						>
							<view class="picker-view">
								<text>{{ getApprovalModeLabel(editingNode.approvalMode) }}</text>
								<text class="arrow">▼</text>
							</view>
						</picker>
					</view>

					<view class="form-item">
						<view class="checkbox-item">
							<checkbox :checked="editingNode.autoPass" @click="toggleEditAutoPass" />
							<text class="checkbox-label">自动通过</text>
						</view>
					</view>
				</view>

				<view class="modal-footer">
					<button class="modal-btn cancel" @click="closeNodeEditor">取消</button>
					<button class="modal-btn confirm" @click="saveNode">保存</button>
				</view>
			</view>
		</view>

		<!-- 编辑模板信息弹窗 -->
		<view v-if="showTemplateEditor" class="modal-overlay" @click="closeTemplateEditor">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">编辑模板信息</text>
					<button class="close-btn" @click="closeTemplateEditor">✕</button>
				</view>
				
				<view class="modal-body">
					<view class="form-item">
						<text class="label">模板名称 <text class="required">*</text></text>
						<input 
							class="input" 
							v-model="editingTemplate.name" 
							placeholder="请输入模板名称"
						/>
					</view>

					<view class="form-item">
						<text class="label">模板代码 <text class="required">*</text></text>
						<input 
							class="input" 
							v-model="editingTemplate.code" 
							placeholder="请输入唯一标识"
						/>
					</view>

					<view class="form-item">
						<text class="label">分类 <text class="required">*</text></text>
						<picker 
							@change="onEditCategoryChange" 
							:value="getCategoryIndex(editingTemplate.category)" 
							:range="categoryOptions" 
							range-key="label"
						>
							<view class="picker-view">
								<text>{{ getCategoryLabel(editingTemplate.category) }}</text>
								<text class="arrow">▼</text>
							</view>
						</picker>
					</view>

					<view class="form-item">
						<text class="label">状态</text>
						<picker 
							@change="onEditStatusChange" 
							:value="getStatusIndex(editingTemplate.status)" 
							:range="statusOptions" 
							range-key="label"
						>
							<view class="picker-view">
								<text>{{ getStatusLabel(editingTemplate.status) }}</text>
								<text class="arrow">▼</text>
							</view>
						</picker>
					</view>

					<view class="form-item">
						<text class="label">描述</text>
						<textarea 
							class="textarea" 
							v-model="editingTemplate.description" 
							placeholder="请输入模板描述"
							maxlength="200"
						/>
					</view>
				</view>

				<view class="modal-footer">
					<button class="modal-btn cancel" @click="closeTemplateEditor">取消</button>
					<button class="modal-btn confirm" @click="saveTemplateInfo">保存</button>
				</view>
			</view>
		</view>

		<!-- 选择岗位弹窗 -->
		<view v-if="showPositionSelector" class="modal-overlay" @click="closePositionSelector">
			<view class="modal-content selector-modal" @click.stop>
				<view class="modal-header">
					<text class="modal-title">选择岗位</text>
					<button class="close-btn" @click="closePositionSelector">✕</button>
				</view>
				
				<view class="modal-body">
					<view v-if="positions.length === 0" class="empty-selector">
						<text>暂无岗位数据</text>
					</view>
					<view v-else class="selector-list">
						<!-- 按部门分组显示岗位 -->
						<view v-for="dept in departments" :key="dept._id" class="dept-group">
							<view class="dept-header">
								<text class="dept-name">{{ dept.name }}</text>
							</view>
							<view 
								v-for="position in getPositionsByDepartment(dept._id)" 
								:key="position._id"
								class="selector-item"
								@click="togglePosition(position._id)"
							>
								<checkbox :checked="isPositionSelected(position._id)" />
								<view class="item-info">
									<text class="item-name">{{ position.name }}</text>
									<text class="item-desc">级别: L{{ position.level }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="modal-footer">
					<button class="modal-btn cancel" @click="closePositionSelector">取消</button>
					<button class="modal-btn confirm" @click="confirmPositions">确定({{ selectedPositions.length }})</button>
				</view>
			</view>
		</view>

		<!-- 选择用户弹窗 -->
		<view v-if="showUserSelector" class="modal-overlay" @click="closeUserSelector">
			<view class="modal-content selector-modal" @click.stop>
				<view class="modal-header">
					<text class="modal-title">选择用户</text>
					<button class="close-btn" @click="closeUserSelector">✕</button>
				</view>
				
				<view class="modal-body">
					<view class="selector-list">
						<view 
							v-for="user in users" 
							:key="user._id"
							class="selector-item"
							@click="toggleUser(user._id)"
						>
							<checkbox :checked="isUserSelected(user._id)" />
							<view class="item-info">
								<text class="item-name">{{ user.realName || user.username }}</text>
								<text class="item-desc">{{ user.positionId?.name || '' }}</text>
							</view>
						</view>
					</view>
					<view v-if="users.length === 0" class="empty-selector">
						<text>暂无用户数据</text>
					</view>
				</view>

				<view class="modal-footer">
					<button class="modal-btn cancel" @click="closeUserSelector">取消</button>
					<button class="modal-btn confirm" @click="confirmUsers">确定</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const currentTab = ref('tree')
const templates = ref([])
const selectedIndex = ref(0)
const loading = ref(false)
const showNodeEditor = ref(false)
const showTemplateEditor = ref(false)
const showPositionSelector = ref(false)
const showUserSelector = ref(false)
const editingNodeIndex = ref(-1)
const positions = ref([])
const users = ref([])
const selectedPositions = ref([])
const selectedUsers = ref([])
const editingNode = ref({
	nodeId: '',
	nodeName: '',
	nodeType: 'user',
	approvalMode: 'and',
	autoPass: false,
	order: 0,
	approvers: []
})
const editingTemplate = ref({
	name: '',
	code: '',
	category: 'equipment',
	status: 'active',
	description: ''
})

const nodeNameOptions = [
	{ label: '部门经理审批', value: '部门经理审批' },
	{ label: '总经理审批', value: '总经理审批' },
	{ label: '设备部门经理审批', value: '设备部门经理审批' },
	{ label: '财务审批', value: '财务审批' },
	{ label: '采购审批', value: '采购审批' },
	{ label: '人事审批', value: '人事审批' },
	{ label: '质量审批', value: '质量审批' },
	{ label: '生产审批', value: '生产审批' },
	{ label: '技术审批', value: '技术审批' },
	{ label: '自定义', value: 'custom' }
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

const selectedTemplate = computed(() => {
	return templates.value[selectedIndex.value] || null
})

onMounted(() => {
	loadTemplates()
	loadPositions()
	loadUsers()
})

function switchTab(tab) {
	currentTab.value = tab
}

function loadTemplates() {
	loading.value = true
	uni.request({
		url: 'http://localhost:3000/approval/templates',
		method: 'GET',
		success: (res) => {
			loading.value = false
			if (res.data.success) {
				templates.value = res.data.data
			}
		},
		fail: () => {
			loading.value = false
			uni.showToast({ title: '加载失败', icon: 'none' })
		}
	})
}

function loadPositions() {
	const user = uni.getStorageSync('user')
	if (!user || !user._id) return
	
	uni.request({
		url: `http://localhost:3000/approval/positions?userId=${user._id}`,
		method: 'GET',
		success: (res) => {
			if (res.data.success) {
				positions.value = res.data.data
			}
		}
	})
}

function loadUsers() {
	uni.request({
		url: 'http://localhost:3000/user/list',
		method: 'GET',
		success: (res) => {
			if (res.data.success) {
				users.value = res.data.data
			}
		}
	})
}

function onTemplateChange(e) {
	selectedIndex.value = e.detail.value
}

function viewTemplateTree(template) {
	const index = templates.value.findIndex(t => t._id === template._id)
	if (index >= 0) {
		selectedIndex.value = index
		currentTab.value = 'tree'
	}
}

// 添加节点
function addNodeAtPosition(position) {
	editingNodeIndex.value = -1
	selectedPositions.value = []
	selectedUsers.value = []
	editingNode.value = {
		nodeId: `node_${Date.now()}`,
		nodeName: '',
		nodeType: 'user',
		approvalMode: 'and',
		autoPass: false,
		order: position + 1,
		insertPosition: position,
		approvers: []
	}
	showNodeEditor.value = true
}

// 编辑节点
function editNode(index) {
	editingNodeIndex.value = index
	const node = selectedTemplate.value.nodes[index]
	editingNode.value = {
		nodeId: node.nodeId,
		nodeName: node.nodeName,
		nodeType: node.nodeType,
		approvalMode: node.approvalMode,
		autoPass: node.autoPass || false,
		order: node.order,
		approvers: node.approvers || []
	}
	
	// 初始化选中的审批人
	if (node.nodeType === 'position') {
		selectedPositions.value = node.approvers || []
	} else if (node.nodeType === 'user') {
		selectedUsers.value = node.approvers || []
	}
	
	showNodeEditor.value = true
}

// 删除节点
function deleteNode(index) {
	uni.showModal({
		title: '确认删除',
		content: `确定要删除节点"${selectedTemplate.value.nodes[index].nodeName}"吗？`,
		success: (res) => {
			if (res.confirm) {
				const updatedNodes = [...selectedTemplate.value.nodes]
				updatedNodes.splice(index, 1)
				// 重新排序
				updatedNodes.forEach((node, idx) => {
					node.order = idx + 1
				})
				updateTemplateNodes(updatedNodes)
			}
		}
	})
}

// 保存节点
function saveNode() {
	if (!editingNode.value.nodeName) {
		uni.showToast({ title: '请输入节点名称', icon: 'none' })
		return
	}
	
	// 验证审批人
	if (editingNode.value.nodeType === 'user' && selectedUsers.value.length === 0) {
		uni.showToast({ title: '请选择审批用户', icon: 'none' })
		return
	}
	if (editingNode.value.nodeType === 'position' && selectedPositions.value.length === 0) {
		uni.showToast({ title: '请选择审批岗位', icon: 'none' })
		return
	}

	const updatedNodes = [...selectedTemplate.value.nodes]
	
	// 确定审批人列表
	let approvers = []
	if (editingNode.value.nodeType === 'user') {
		approvers = selectedUsers.value
	} else if (editingNode.value.nodeType === 'position') {
		approvers = selectedPositions.value
	}
	
	if (editingNodeIndex.value === -1) {
		// 添加新节点
		const position = editingNode.value.insertPosition
		updatedNodes.splice(position, 0, {
			nodeId: editingNode.value.nodeId,
			nodeName: editingNode.value.nodeName,
			nodeType: editingNode.value.nodeType,
			approvalMode: editingNode.value.approvalMode,
			autoPass: editingNode.value.autoPass,
			order: position + 1,
			approvers: approvers
		})
	} else {
		// 更新现有节点
		updatedNodes[editingNodeIndex.value] = {
			...updatedNodes[editingNodeIndex.value],
			nodeName: editingNode.value.nodeName,
			nodeType: editingNode.value.nodeType,
			approvalMode: editingNode.value.approvalMode,
			autoPass: editingNode.value.autoPass,
			approvers: approvers
		}
	}

	// 重新排序
	updatedNodes.forEach((node, idx) => {
		node.order = idx + 1
	})

	updateTemplateNodes(updatedNodes)
	closeNodeEditor()
}

// 更新模板节点
function updateTemplateNodes(nodes) {
	const user = uni.getStorageSync('user')
	if (!user || !user._id) {
		uni.showToast({ title: '请先登录', icon: 'none' })
		return
	}

	uni.showLoading({ title: '保存中...' })
	uni.request({
		url: `http://localhost:3000/approval/templates/${selectedTemplate.value._id}?userId=${user._id}`,
		method: 'PUT',
		data: {
			...selectedTemplate.value,
			nodes: nodes
		},
		success: (res) => {
			uni.hideLoading()
			if (res.data.success) {
				uni.showToast({ title: '保存成功', icon: 'success' })
				loadTemplates()
			} else {
				uni.showToast({ title: res.data.message || '保存失败', icon: 'none' })
			}
		},
		fail: () => {
			uni.hideLoading()
			uni.showToast({ title: '保存失败', icon: 'none' })
		}
	})
}

// 编辑模板信息
function editTemplateInfo() {
	editingTemplate.value = {
		name: selectedTemplate.value.name,
		code: selectedTemplate.value.code,
		category: selectedTemplate.value.category,
		status: selectedTemplate.value.status,
		description: selectedTemplate.value.description || ''
	}
	showTemplateEditor.value = true
}

// 保存模板信息
function saveTemplateInfo() {
	if (!editingTemplate.value.name) {
		uni.showToast({ title: '请输入模板名称', icon: 'none' })
		return
	}
	if (!editingTemplate.value.code) {
		uni.showToast({ title: '请输入模板代码', icon: 'none' })
		return
	}

	const user = uni.getStorageSync('user')
	if (!user || !user._id) {
		uni.showToast({ title: '请先登录', icon: 'none' })
		return
	}

	uni.showLoading({ title: '保存中...' })
	uni.request({
		url: `http://localhost:3000/approval/templates/${selectedTemplate.value._id}?userId=${user._id}`,
		method: 'PUT',
		data: {
			...selectedTemplate.value,
			name: editingTemplate.value.name,
			code: editingTemplate.value.code,
			category: editingTemplate.value.category,
			status: editingTemplate.value.status,
			description: editingTemplate.value.description
		},
		success: (res) => {
			uni.hideLoading()
			if (res.data.success) {
				uni.showToast({ title: '保存成功', icon: 'success' })
				loadTemplates()
				closeTemplateEditor()
			} else {
				uni.showToast({ title: res.data.message || '保存失败', icon: 'none' })
			}
		},
		fail: () => {
			uni.hideLoading()
			uni.showToast({ title: '保存失败', icon: 'none' })
		}
	})
}

// 删除当前模板
function deleteCurrentTemplate() {
	uni.showModal({
		title: '确认删除',
		content: `确定要删除模板"${selectedTemplate.value.name}"吗？`,
		success: (res) => {
			if (res.confirm) {
				performDeleteTemplate(selectedTemplate.value._id)
			}
		}
	})
}

function performDeleteTemplate(templateId) {
	const user = uni.getStorageSync('user')
	if (!user || !user._id) {
		uni.showToast({ title: '请先登录', icon: 'none' })
		return
	}

	uni.showLoading({ title: '删除中...' })
	uni.request({
		url: `http://localhost:3000/approval/templates/${templateId}?userId=${user._id}`,
		method: 'DELETE',
		success: (res) => {
			uni.hideLoading()
			if (res.data.success) {
				uni.showToast({ title: '删除成功', icon: 'success' })
				selectedIndex.value = 0
				loadTemplates()
			} else {
				uni.showToast({ title: res.data.message || '删除失败', icon: 'none' })
			}
		},
		fail: () => {
			uni.hideLoading()
			uni.showToast({ title: '删除失败', icon: 'none' })
		}
	})
}

function closeNodeEditor() {
	showNodeEditor.value = false
}

// 选择岗位
function selectPositions() {
	showPositionSelector.value = true
}

function closePositionSelector() {
	showPositionSelector.value = false
}

function togglePosition(positionId) {
	const index = selectedPositions.value.indexOf(positionId)
	if (index >= 0) {
		selectedPositions.value.splice(index, 1)
	} else {
		selectedPositions.value.push(positionId)
	}
}

function isPositionSelected(positionId) {
	return selectedPositions.value.includes(positionId)
}

function confirmPositions() {
	closePositionSelector()
}

function getSelectedPositionsText() {
	if (selectedPositions.value.length === 0) {
		return '请选择岗位'
	}
	const names = selectedPositions.value.map(id => {
		const pos = positions.value.find(p => p._id === id)
		return pos ? pos.name : ''
	}).filter(n => n)
	return names.join('、') || '请选择岗位'
}

// 按部门获取岗位
function getPositionsByDepartment(deptId) {
	return positions.value.filter(p => p.departmentId === deptId)
}

// 选择用户
function selectUsers() {
	showUserSelector.value = true
}

function closeUserSelector() {
	showUserSelector.value = false
}

function toggleUser(userId) {
	const index = selectedUsers.value.indexOf(userId)
	if (index >= 0) {
		selectedUsers.value.splice(index, 1)
	} else {
		selectedUsers.value.push(userId)
	}
}

function isUserSelected(userId) {
	return selectedUsers.value.includes(userId)
}

function confirmUsers() {
	closeUserSelector()
}

function getSelectedUsersText() {
	if (selectedUsers.value.length === 0) {
		return '请选择用户'
	}
	const names = selectedUsers.value.map(id => {
		const user = users.value.find(u => u._id === id)
		return user ? (user.realName || user.username) : ''
	}).filter(n => n)
	return names.join('、') || '请选择用户'
}

function onNodeNameChange(e) {
	nodeNameIndex.value = e.detail.value
	if (nodeNameIndex.value !== nodeNameOptions.length - 1) {
		// 不是自定义，清空自定义输入
		customNodeName.value = ''
	}
}

function getNodeNameDisplay() {
	if (nodeNameIndex.value === nodeNameOptions.length - 1 && customNodeName.value) {
		return customNodeName.value
	}
	return nodeNameOptions[nodeNameIndex.value]?.label || '请选择节点名称'
}

function closeTemplateEditor() {
	showTemplateEditor.value = false
}

function onEditNodeTypeChange(e) {
	editingNode.value.nodeType = nodeTypeOptions[e.detail.value].value
}

function onEditApprovalModeChange(e) {
	editingNode.value.approvalMode = approvalModeOptions[e.detail.value].value
}

function toggleEditAutoPass() {
	editingNode.value.autoPass = !editingNode.value.autoPass
}

function onEditCategoryChange(e) {
	editingTemplate.value.category = categoryOptions[e.detail.value].value
}

function onEditStatusChange(e) {
	editingTemplate.value.status = statusOptions[e.detail.value].value
}

function getNodeClass(node) {
	if (node.autoPass) return 'auto-node'
	if (node.nodeType === 'position') return 'position-node'
	if (node.nodeType === 'department_manager') return 'manager-node'
	if (node.nodeType === 'user') return 'user-node'
	return ''
}

function getNodeIcon(node) {
	if (node.autoPass) return '⚡'
	if (node.nodeType === 'position') return '👔'
	if (node.nodeType === 'department_manager') return '👨‍💼'
	if (node.nodeType === 'user') return '👤'
	return '📋'
}

function getNodeTypeText(type) {
	const map = {
		user: '指定用户',
		position: '指定岗位',
		department_manager: '部门负责人',
		auto: '自动通过'
	}
	return map[type] || type
}

function getNodeTypeIndex(type) {
	return nodeTypeOptions.findIndex(opt => opt.value === type)
}

function getNodeTypeLabel(type) {
	const option = nodeTypeOptions.find(opt => opt.value === type)
	return option ? option.label : '请选择'
}

function getApprovalModeText(mode) {
	const map = {
		and: '会签（全部通过）',
		or: '或签（任一通过）',
		sequential: '依次审批'
	}
	return map[mode] || mode
}

function getApprovalModeIndex(mode) {
	return approvalModeOptions.findIndex(opt => opt.value === mode)
}

function getApprovalModeLabel(mode) {
	const option = approvalModeOptions.find(opt => opt.value === mode)
	return option ? option.label : '请选择'
}

function getCategoryText(category) {
	const map = {
		equipment: '设备管理',
		purchase: '采购管理',
		production: '生产管理',
		quality: '质量管理',
		leave: '请假',
		expense: '报销',
		other: '其他'
	}
	return map[category] || category
}

function getCategoryIndex(category) {
	return categoryOptions.findIndex(opt => opt.value === category)
}

function getCategoryLabel(category) {
	const option = categoryOptions.find(opt => opt.value === category)
	return option ? option.label : '请选择'
}

function getStatusIndex(status) {
	return statusOptions.findIndex(opt => opt.value === status)
}

function getStatusLabel(status) {
	const option = statusOptions.find(opt => opt.value === status)
	return option ? option.label : '请选择'
}

function addTemplate() {
	uni.navigateTo({
		url: '/pages/approval-template/edit'
	})
}

function editTemplate(template) {
	uni.navigateTo({
		url: `/pages/approval-template/edit?id=${template._id}`
	})
}

function deleteTemplate(template) {
	uni.showModal({
		title: '确认删除',
		content: `确定要删除模板"${template.name}"吗？`,
		success: (res) => {
			if (res.confirm) {
				performDelete(template._id)
			}
		}
	})
}

function performDelete(templateId) {
	const user = uni.getStorageSync('user')
	if (!user || !user._id) {
		uni.showToast({ title: '请先登录', icon: 'none' })
		return
	}

	uni.showLoading({ title: '删除中...' })
	uni.request({
		url: `http://localhost:3000/approval/templates/${templateId}?userId=${user._id}`,
		method: 'DELETE',
		success: (res) => {
			uni.hideLoading()
			if (res.data.success) {
				uni.showToast({ title: '删除成功', icon: 'success' })
				loadTemplates()
			} else {
				uni.showToast({ title: res.data.message || '删除失败', icon: 'none' })
			}
		},
		fail: () => {
			uni.hideLoading()
			uni.showToast({ title: '删除失败', icon: 'none' })
		}
	})
}
</script>

<style scoped>
.template-page {
	min-height: 100vh;
	background: #f7f6fb;
}

.header {
	background: #fff;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	position: sticky;
	top: 0;
	z-index: 100;
}

.tabs {
	display: flex;
}

.tab-item {
	flex: 1;
	text-align: center;
	padding: 28rpx 0;
	font-size: 28rpx;
	color: #666;
	position: relative;
}

.tab-item.active {
	color: #5672ff;
	font-weight: 600;
}

.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 60rpx;
	height: 4rpx;
	background: #5672ff;
	border-radius: 2rpx;
}

.content {
	padding: 20rpx;
	height: calc(100vh - 88rpx);
}

/* 模板选择器 */
.template-selector {
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.picker-view {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 28rpx;
	color: #333;
}

.arrow {
	color: #999;
	font-size: 20rpx;
}

/* 流程树样式 */
.flow-tree-wrapper {
	min-width: max-content;
	display: inline-block;
}

.flow-tree-container {
	background: #fff;
	border-radius: 16rpx;
	padding: 60rpx 40rpx;
	min-height: 600rpx;
	min-width: 100%;
}

.tree-level {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 20rpx;
}

.tree-node-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.tree-node-box {
	display: inline-block;
	padding: 24rpx 40rpx;
	border-radius: 16rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
	text-align: center;
	min-width: 280rpx;
}

.start-node {
	background: #5672ff;
	color: #fff;
}

.end-node {
	background: #4caf50;
	color: #fff;
}

.approval-node {
	background: #fff;
	color: #333;
	border: 2rpx solid #e0e0e0;
}

.approval-node.auto-node {
	background: #fff9e6;
	border-color: #ffc107;
}

.approval-node.position-node {
	background: #e3f2fd;
	border-color: #2196f3;
}

.approval-node.manager-node {
	background: #f3e5f5;
	border-color: #9c27b0;
}

.approval-node.user-node {
	background: #e8f5e9;
	border-color: #4caf50;
}

.node-header {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	margin-bottom: 12rpx;
}

.node-icon {
	font-size: 36rpx;
}

.node-title {
	font-size: 30rpx;
	font-weight: 600;
}

.node-type {
	display: block;
	font-size: 22rpx;
	opacity: 0.9;
	margin-top: 8rpx;
}

.node-mode {
	display: block;
	font-size: 20rpx;
	opacity: 0.8;
	margin-top: 6rpx;
}

/* 连接线 */
.connector-down {
	width: 2rpx;
	height: 60rpx;
	background: #cbd5e0;
	margin: 20rpx 0;
}

/* 模板列表样式 */
.template-card {
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.title {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
	flex: 1;
}

.status {
	padding: 6rpx 16rpx;
	border-radius: 8rpx;
	font-size: 22rpx;
}

.status.active {
	background: #e8f5e9;
	color: #4caf50;
}

.status.inactive {
	background: #f5f5f5;
	color: #999;
}

.card-body {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.info-row {
	display: flex;
}

.label {
	color: #999;
	font-size: 24rpx;
	min-width: 120rpx;
}

.value {
	color: #333;
	font-size: 24rpx;
	flex: 1;
}

.empty {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 120rpx 0;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}

.loading {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 60rpx 0;
	font-size: 28rpx;
	color: #999;
}

/* 操作按钮 */
.card-actions {
	display: flex;
	gap: 16rpx;
	margin-top: 16rpx;
	padding-top: 16rpx;
	border-top: 1rpx solid #f0f0f0;
}

.action-btn {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	padding: 16rpx;
	border-radius: 12rpx;
	font-size: 24rpx;
	border: none;
	background: none;
}

.action-btn::after {
	border: none;
}

.edit-btn {
	background: #e3f2fd;
	color: #2196f3;
}

.delete-btn {
	background: #ffebee;
	color: #f44336;
}

.btn-icon {
	font-size: 28rpx;
}

/* 悬浮添加按钮 */
.fab {
	position: fixed;
	right: 40rpx;
	bottom: 100rpx;
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	background: #5672ff;
	box-shadow: 0 8rpx 24rpx rgba(86, 114, 255, 0.4);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;
}

.fab-icon {
	font-size: 60rpx;
	color: #fff;
	font-weight: 300;
	line-height: 1;
}

/* 模板操作按钮 */
.template-actions {
	display: flex;
	gap: 16rpx;
	margin-bottom: 20rpx;
}

.template-actions .action-btn {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	padding: 20rpx;
	border-radius: 12rpx;
	font-size: 26rpx;
	border: none;
	background: #fff;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.template-actions .action-btn::after {
	border: none;
}

.edit-template-btn {
	color: #2196f3;
}

.delete-template-btn {
	color: #f44336;
}

/* 节点操作按钮 */
.node-actions {
	display: flex;
	gap: 12rpx;
	margin-top: 16rpx;
	justify-content: center;
}

.node-action-btn {
	padding: 8rpx 20rpx;
	border-radius: 8rpx;
	font-size: 24rpx;
	border: none;
	background: none;
}

.node-action-btn::after {
	border: none;
}

.node-action-btn.edit {
	background: #e3f2fd;
}

.node-action-btn.delete {
	background: #ffebee;
}

/* 添加节点按钮 */
.add-node-btn-inline {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	padding: 24rpx 40rpx;
	background: #f0f4ff;
	border: 2rpx dashed #5672ff;
	border-radius: 16rpx;
	color: #5672ff;
	font-size: 26rpx;
}

.add-node-btn-inline::after {
	border: none;
}

.add-node-btn-between {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	background: #5672ff;
	color: #fff;
	font-size: 32rpx;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 10rpx 0;
}

.add-node-btn-between::after {
	border: none;
}

.add-icon {
	font-size: 32rpx;
	font-weight: 300;
	line-height: 1;
}

/* 弹窗样式 */
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;
}

.modal-content {
	width: 90%;
	max-width: 600rpx;
	background: #fff;
	border-radius: 16rpx;
	overflow: visible;
	position: relative;
	z-index: 1000;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 32rpx;
	border-bottom: 1rpx solid #f0f0f0;
	background: #fff;
	border-radius: 16rpx 16rpx 0 0;
}

.modal-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
}

.close-btn {
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	background: #f5f5f5;
	color: #666;
	font-size: 28rpx;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0;
}

.close-btn::after {
	border: none;
}

.modal-body {
	padding: 32rpx;
	max-height: 60vh;
	overflow-y: auto;
	background: #fff;
}

.modal-body .form-item {
	margin-bottom: 24rpx;
	position: relative;
	z-index: auto;
}

.modal-body .label {
	display: block;
	font-size: 26rpx;
	color: #666;
	margin-bottom: 12rpx;
}

.modal-body .required {
	color: #f44336;
}

.modal-body .input {
	width: 100%;
	padding: 20rpx;
	background: #f5f5f5;
	border-radius: 8rpx;
	font-size: 28rpx;
	box-sizing: border-box;
	border: none;
}

.modal-body .textarea {
	width: 100%;
	min-height: 120rpx;
	padding: 20rpx;
	background: #f5f5f5;
	border-radius: 8rpx;
	font-size: 28rpx;
	box-sizing: border-box;
	border: none;
}

.modal-body .picker-view {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	background: #f5f5f5;
	border-radius: 8rpx;
	font-size: 28rpx;
}

.modal-body .checkbox-item {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.modal-body .checkbox-label {
	font-size: 28rpx;
	color: #333;
}

.modal-footer {
	display: flex;
	gap: 16rpx;
	padding: 24rpx 32rpx;
	border-top: 1rpx solid #f0f0f0;
	background: #fff;
	border-radius: 0 0 16rpx 16rpx;
}

.modal-btn {
	flex: 1;
	padding: 24rpx;
	border-radius: 12rpx;
	font-size: 28rpx;
	border: none;
}

.modal-btn::after {
	border: none;
}

.modal-btn.cancel {
	background: #f5f5f5;
	color: #666;
}

.modal-btn.confirm {
	background: #5672ff;
	color: #fff;
}

/* 选择器样式 */
.selector-modal {
	max-height: 80vh;
}

.selector-list {
	max-height: 50vh;
	overflow-y: auto;
}

.selector-item {
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.item-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.item-name {
	font-size: 28rpx;
	color: #333;
}

.item-desc {
	font-size: 24rpx;
	color: #999;
}

.empty-selector {
	text-align: center;
	padding: 60rpx 0;
	color: #999;
	font-size: 26rpx;
}

.select-btn {
	width: 100%;
	padding: 20rpx;
	background: #f5f5f5;
	border-radius: 8rpx;
	font-size: 28rpx;
	text-align: left;
	color: #333;
	border: none;
}

.select-btn::after {
	border: none;
}

.info-text {
	font-size: 24rpx;
	color: #666;
	padding: 16rpx;
	background: #f0f4ff;
	border-radius: 8rpx;
	line-height: 1.6;
}
</style>


<style scoped>
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999;
}

.modal-content {
	background: #fff;
	border-radius: 16rpx;
	width: 90%;
	max-width: 600rpx;
	max-height: 80vh;
	display: flex;
	flex-direction: column;
	z-index: 10000;
}

.selector-modal {
	max-height: 70vh;
}

.modal-header {
	padding: 32rpx 24rpx 24rpx;
	border-bottom: 1rpx solid #f0f0f0;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.modal-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
}

.close-btn {
	background: transparent;
	border: none;
	font-size: 32rpx;
	color: #999;
	padding: 0;
	width: 48rpx;
	height: 48rpx;
	line-height: 48rpx;
}

.modal-body {
	padding: 24rpx;
	flex: 1;
	overflow-y: auto;
}

.modal-footer {
	padding: 24rpx;
	border-top: 1rpx solid #f0f0f0;
	display: flex;
	gap: 16rpx;
}

.modal-btn {
	flex: 1;
	padding: 20rpx;
	border-radius: 8rpx;
	font-size: 28rpx;
	border: none;
}

.modal-btn.cancel {
	background: #f5f5f5;
	color: #666;
}

.modal-btn.confirm {
	background: #5b4bff;
	color: #fff;
}

.dept-group {
	margin-bottom: 24rpx;
}

.dept-header {
	background: #f5f5f5;
	padding: 16rpx 24rpx;
	border-radius: 8rpx;
	margin-bottom: 12rpx;
}

.dept-name {
	font-size: 26rpx;
	font-weight: 600;
	color: #333;
}

.selector-list {
	max-height: 500rpx;
	overflow-y: auto;
}

.selector-item {
	display: flex;
	align-items: center;
	padding: 16rpx 24rpx;
	gap: 16rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.item-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 6rpx;
}

.item-name {
	font-size: 26rpx;
	color: #333;
}

.item-desc {
	font-size: 22rpx;
	color: #999;
}

.empty-selector {
	padding: 100rpx 40rpx;
	text-align: center;
	color: #999;
	font-size: 26rpx;
}
</style>
