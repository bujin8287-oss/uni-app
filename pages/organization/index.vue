<template>
	<view class="organization-page">
		<view class="header">
			<text class="title">组织架构</text>
			<button class="add-btn" @click="showAddMenu">+ 新增</button>
		</view>

		<view class="tabs">
			<view 
				:class="['tab', activeTab === 'tree' ? 'active' : '']" 
				@click="switchTab('tree')"
			>
				组织树
			</view>
			<view 
				:class="['tab', activeTab === 'department' ? 'active' : '']" 
				@click="switchTab('department')"
			>
				部门管理
			</view>
			<view 
				:class="['tab', activeTab === 'position' ? 'active' : '']" 
				@click="switchTab('position')"
			>
				岗位管理
			</view>
		</view>

		<view class="content">
			<!-- 组织树视图 -->
			<view v-if="activeTab === 'tree'" class="tree-view">
				<view v-if="departments.length === 0" class="empty">
					<text class="empty-text">暂无组织架构数据</text>
					<text class="empty-desc">请先在"部门管理"和"岗位管理"中添加数据</text>
				</view>
				<view v-else class="org-tree">
					<!-- 总经理层 -->
					<view class="tree-level level-0">
						<view class="tree-node root-node">
							<text class="node-text">总经理</text>
						</view>
					</view>

					<!-- 部门层 -->
					<view class="tree-level level-1">
						<view class="tree-branches">
							<view 
								v-for="dept in departments" 
								:key="dept._id" 
								class="tree-branch"
							>
								<view class="branch-line"></view>
								<view class="tree-node dept-node">
									<text class="node-text">{{ dept.name }}</text>
								</view>
								
								<!-- 该部门下的岗位 -->
								<view class="position-list">
									<view 
										v-for="pos in getPositionsByDept(dept._id)" 
										:key="pos._id"
										class="position-item"
									>
										<view class="position-line"></view>
										<view class="position-box">
											<text class="position-name">{{ pos.name }}</text>
											<text class="position-level">L{{ pos.level }}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 部门列表 -->
			<view v-if="activeTab === 'department'" class="list">
				<view v-if="departments.length === 0" class="empty">
					<text class="empty-text">暂无部门数据</text>
					<text class="empty-desc">点击右上角"新增"按钮添加部门</text>
				</view>
				<view 
					v-for="dept in departments" 
					:key="dept._id" 
					class="list-item"
				>
					<view class="item-left">
						<text class="item-icon">🏢</text>
						<view class="item-info">
							<text class="item-name">{{ dept.name }}</text>
							<text class="item-desc">编码: {{ dept.code }}</text>
						</view>
					</view>
					<view class="item-actions">
						<button class="action-btn edit" @click="editDepartment(dept)">编辑</button>
						<button class="action-btn delete" @click="deleteDepartment(dept)">删除</button>
					</view>
				</view>
			</view>

			<!-- 岗位列表 -->
			<view v-if="activeTab === 'position'" class="list">
				<view v-if="positions.length === 0" class="empty">
					<text class="empty-text">暂无岗位数据</text>
					<text class="empty-desc">点击右上角"新增"按钮添加岗位</text>
				</view>
				<view 
					v-for="pos in positions" 
					:key="pos._id" 
					class="list-item"
				>
					<view class="item-left">
						<text class="item-icon">👤</text>
						<view class="item-info">
							<text class="item-name">{{ pos.name }}</text>
							<text class="item-desc">
								编码: {{ pos.code }} | 
								部门: {{ getDepartmentName(pos.departmentId) }} | 
								级别: {{ pos.level }}
							</text>
						</view>
					</view>
					<view class="item-actions">
						<button class="action-btn edit" @click="editPosition(pos)">编辑</button>
						<button class="action-btn delete" @click="deletePosition(pos)">删除</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 新增/编辑部门弹窗 -->
		<view v-if="showDeptModal" class="modal-overlay" @click="closeDeptModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">{{ editingDept._id ? '编辑部门' : '新增部门' }}</text>
					<button class="close-btn" @click="closeDeptModal">✕</button>
				</view>
				<view class="modal-body">
					<view class="form-item">
						<text class="label">部门名称 <text class="required">*</text></text>
						<input 
							class="input" 
							v-model="editingDept.name" 
							placeholder="请输入部门名称"
						/>
					</view>
					<view class="form-item">
						<text class="label">部门编码 <text class="required">*</text></text>
						<input 
							class="input" 
							v-model="editingDept.code" 
							placeholder="请输入部门编码"
						/>
					</view>
					<view class="form-item">
						<text class="label">描述</text>
						<textarea 
							class="textarea" 
							v-model="editingDept.description" 
							placeholder="请输入部门描述（可选）"
						/>
					</view>
				</view>
				<view class="modal-footer">
					<button class="btn cancel" @click="closeDeptModal">取消</button>
					<button class="btn confirm" @click="saveDepartment">保存</button>
				</view>
			</view>
		</view>

		<!-- 新增/编辑岗位弹窗 -->
		<view v-if="showPosModal" class="modal-overlay" @click="closePosModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">{{ editingPos._id ? '编辑岗位' : '新增岗位' }}</text>
					<button class="close-btn" @click="closePosModal">✕</button>
				</view>
				<view class="modal-body">
					<view class="form-item">
						<text class="label">岗位名称 <text class="required">*</text></text>
						<input 
							class="input" 
							v-model="editingPos.name" 
							placeholder="请输入岗位名称"
						/>
					</view>
					<view class="form-item">
						<text class="label">岗位编码 <text class="required">*</text></text>
						<input 
							class="input" 
							v-model="editingPos.code" 
							placeholder="请输入岗位编码"
						/>
					</view>
					<view class="form-item">
						<text class="label">所属部门 <text class="required">*</text></text>
						<picker 
							mode="selector" 
							:range="departments" 
							range-key="name"
							:value="getSelectedDeptIndex()"
							@change="onDeptChange"
						>
							<view class="picker">
								{{ getSelectedDeptName() || '请选择部门' }}
							</view>
						</picker>
					</view>
					<view class="form-item">
						<text class="label">岗位级别 <text class="required">*</text></text>
						<input 
							class="input" 
							type="number"
							v-model="editingPos.level" 
							placeholder="请输入岗位级别（数字）"
						/>
					</view>
					<view class="form-item">
						<text class="label">描述</text>
						<textarea 
							class="textarea" 
							v-model="editingPos.description" 
							placeholder="请输入岗位描述（可选）"
						/>
					</view>
				</view>
				<view class="modal-footer">
					<button class="btn cancel" @click="closePosModal">取消</button>
					<button class="btn confirm" @click="savePosition">保存</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api'

const activeTab = ref('tree')
const departments = ref([])
const positions = ref([])

const showDeptModal = ref(false)
const showPosModal = ref(false)

const editingDept = reactive({
	_id: '',
	name: '',
	code: '',
	description: ''
})

const editingPos = reactive({
	_id: '',
	name: '',
	code: '',
	departmentId: '',
	level: 1,
	description: ''
})

// 切换标签
function switchTab(tab) {
	activeTab.value = tab
}

// 显示新增菜单
function showAddMenu() {
	if (activeTab.value === 'department') {
		openDeptModal()
	} else if (activeTab.value === 'position') {
		openPosModal()
	} else {
		// 在组织树视图，显示选择菜单
		uni.showActionSheet({
			itemList: ['新增部门', '新增岗位'],
			success: (res) => {
				if (res.tapIndex === 0) {
					openDeptModal()
				} else if (res.tapIndex === 1) {
					openPosModal()
				}
			}
		})
	}
}

// 加载部门列表
async function loadDepartments() {
	try {
		const res = await api.getDepartments()
		if (res.success) {
			departments.value = res.data || []
		}
	} catch (e) {
		console.error('加载部门失败:', e)
		uni.showToast({ title: '加载部门失败', icon: 'none' })
	}
}

// 加载岗位列表
async function loadPositions() {
	try {
		const res = await api.getPositions()
		if (res.success) {
			positions.value = res.data || []
		}
	} catch (e) {
		console.error('加载岗位失败:', e)
		uni.showToast({ title: '加载岗位失败', icon: 'none' })
	}
}

// 获取部门下的岗位
function getPositionsByDept(deptId) {
	return positions.value.filter(p => p.departmentId === deptId).sort((a, b) => b.level - a.level)
}

// 获取部门名称
function getDepartmentName(deptId) {
	const dept = departments.value.find(d => d._id === deptId)
	return dept ? dept.name : '未知部门'
}

// 打开部门弹窗
function openDeptModal(dept = null) {
	if (dept) {
		editingDept._id = dept._id
		editingDept.name = dept.name
		editingDept.code = dept.code
		editingDept.description = dept.description || ''
	} else {
		editingDept._id = ''
		editingDept.name = ''
		editingDept.code = ''
		editingDept.description = ''
	}
	showDeptModal.value = true
}

// 关闭部门弹窗
function closeDeptModal() {
	showDeptModal.value = false
}

// 编辑部门
function editDepartment(dept) {
	openDeptModal(dept)
}

// 保存部门
async function saveDepartment() {
	if (!editingDept.name || !editingDept.code) {
		uni.showToast({ title: '请填写必填项', icon: 'none' })
		return
	}

	try {
		const data = {
			name: editingDept.name,
			code: editingDept.code,
			description: editingDept.description
		}

		let res
		if (editingDept._id) {
			// 更新
			res = await api.updateDepartment(editingDept._id, data)
		} else {
			// 新增
			res = await api.createDepartment(data)
		}

		if (res.success) {
			uni.showToast({ title: '保存成功', icon: 'success' })
			closeDeptModal()
			await loadDepartments()
		} else {
			uni.showToast({ title: res.message || '保存失败', icon: 'none' })
		}
	} catch (e) {
		console.error('保存部门失败:', e)
		uni.showToast({ title: '保存失败', icon: 'none' })
	}
}

// 删除部门
function deleteDepartment(dept) {
	uni.showModal({
		title: '确认删除',
		content: `确定要删除部门"${dept.name}"吗？`,
		success: async (res) => {
			if (res.confirm) {
				try {
					const result = await api.deleteDepartment(dept._id)
					if (result.success) {
						uni.showToast({ title: '删除成功', icon: 'success' })
						await loadDepartments()
						await loadPositions()
					} else {
						uni.showToast({ title: result.message || '删除失败', icon: 'none' })
					}
				} catch (e) {
					console.error('删除部门失败:', e)
					uni.showToast({ title: '删除失败', icon: 'none' })
				}
			}
		}
	})
}

// 打开岗位弹窗
function openPosModal(pos = null) {
	if (pos) {
		editingPos._id = pos._id
		editingPos.name = pos.name
		editingPos.code = pos.code
		editingPos.departmentId = pos.departmentId
		editingPos.level = pos.level
		editingPos.description = pos.description || ''
	} else {
		editingPos._id = ''
		editingPos.name = ''
		editingPos.code = ''
		editingPos.departmentId = ''
		editingPos.level = 1
		editingPos.description = ''
	}
	showPosModal.value = true
}

// 关闭岗位弹窗
function closePosModal() {
	showPosModal.value = false
}

// 编辑岗位
function editPosition(pos) {
	openPosModal(pos)
}

// 部门选择器相关
function getSelectedDeptIndex() {
	if (!editingPos.departmentId) return 0
	const index = departments.value.findIndex(d => d._id === editingPos.departmentId)
	return index >= 0 ? index : 0
}

function getSelectedDeptName() {
	if (!editingPos.departmentId) return ''
	const dept = departments.value.find(d => d._id === editingPos.departmentId)
	return dept ? dept.name : ''
}

function onDeptChange(e) {
	const index = e.detail.value
	if (departments.value[index]) {
		editingPos.departmentId = departments.value[index]._id
	}
}

// 保存岗位
async function savePosition() {
	if (!editingPos.name || !editingPos.code || !editingPos.departmentId) {
		uni.showToast({ title: '请填写必填项', icon: 'none' })
		return
	}

	try {
		const data = {
			name: editingPos.name,
			code: editingPos.code,
			departmentId: editingPos.departmentId,
			level: parseInt(editingPos.level) || 1,
			description: editingPos.description
		}

		let res
		if (editingPos._id) {
			// 更新
			res = await api.updatePosition(editingPos._id, data)
		} else {
			// 新增
			res = await api.createPosition(data)
		}

		if (res.success) {
			uni.showToast({ title: '保存成功', icon: 'success' })
			closePosModal()
			await loadPositions()
		} else {
			uni.showToast({ title: res.message || '保存失败', icon: 'none' })
		}
	} catch (e) {
		console.error('保存岗位失败:', e)
		uni.showToast({ title: '保存失败', icon: 'none' })
	}
}

// 删除岗位
function deletePosition(pos) {
	uni.showModal({
		title: '确认删除',
		content: `确定要删除岗位"${pos.name}"吗？`,
		success: async (res) => {
			if (res.confirm) {
				try {
					const result = await api.deletePosition(pos._id)
					if (result.success) {
						uni.showToast({ title: '删除成功', icon: 'success' })
						await loadPositions()
					} else {
						uni.showToast({ title: result.message || '删除失败', icon: 'none' })
					}
				} catch (e) {
					console.error('删除岗位失败:', e)
					uni.showToast({ title: '删除失败', icon: 'none' })
				}
			}
		}
	})
}

onMounted(async () => {
	await loadDepartments()
	await loadPositions()
})
</script>

<style scoped>
.organization-page {
	min-height: 100vh;
	background: #f7f6fb;
	padding-bottom: 40rpx;
}

.header {
	background: #fff;
	padding: 28rpx 24rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
}

.add-btn {
	background: #5b4bff;
	color: #fff;
	padding: 12rpx 24rpx;
	border-radius: 8rpx;
	font-size: 24rpx;
	border: none;
}

.tabs {
	display: flex;
	background: #fff;
	margin-top: 2rpx;
	padding: 0 24rpx;
}

.tab {
	flex: 1;
	text-align: center;
	padding: 24rpx 0;
	font-size: 26rpx;
	color: #666;
	border-bottom: 4rpx solid transparent;
}

.tab.active {
	color: #5b4bff;
	font-weight: 600;
	border-bottom-color: #5b4bff;
}

.content {
	padding: 20rpx;
}

/* 组织树样式 */
.tree-view {
	background: #fff;
	border-radius: 12rpx;
	padding: 40rpx 20rpx;
	overflow-x: auto;
}

.org-tree {
	display: flex;
	flex-direction: column;
	align-items: center;
	min-width: 100%;
}

.tree-level {
	display: flex;
	justify-content: center;
	width: 100%;
	margin-bottom: 40rpx;
}

.tree-node {
	padding: 20rpx 32rpx;
	border-radius: 12rpx;
	text-align: center;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	position: relative;
}

.root-node {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
	font-size: 28rpx;
	font-weight: 600;
}

.root-node::after {
	content: '';
	position: absolute;
	bottom: -40rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 4rpx;
	height: 40rpx;
	background: #667eea;
}

.tree-branches {
	display: flex;
	gap: 24rpx;
	position: relative;
	padding-top: 40rpx;
}

.tree-branches::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 4rpx;
	background: #667eea;
}

.tree-branch {
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
	min-width: 200rpx;
}

.branch-line {
	width: 4rpx;
	height: 40rpx;
	background: #667eea;
	margin-bottom: 0;
}

.dept-node {
	background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
	color: #fff;
	font-size: 26rpx;
	font-weight: 600;
	margin-bottom: 24rpx;
}

.position-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
	width: 100%;
}

.position-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.position-line {
	width: 4rpx;
	height: 24rpx;
	background: #4facfe;
}

.position-box {
	background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
	padding: 16rpx 24rpx;
	border-radius: 8rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6rpx;
	width: 160rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

.position-name {
	font-size: 24rpx;
	color: #333;
	font-weight: 500;
}

.position-level {
	font-size: 20rpx;
	color: #666;
	background: rgba(255, 255, 255, 0.6);
	padding: 4rpx 12rpx;
	border-radius: 12rpx;
}

/* 列表样式 */
.list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.list-item {
	background: #fff;
	padding: 24rpx;
	border-radius: 12rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.item-left {
	display: flex;
	align-items: center;
	gap: 16rpx;
	flex: 1;
}

.item-icon {
	font-size: 40rpx;
}

.item-info {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.item-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
}

.item-desc {
	font-size: 22rpx;
	color: #999;
}

.item-actions {
	display: flex;
	gap: 12rpx;
}

.action-btn {
	padding: 8rpx 16rpx;
	border-radius: 6rpx;
	font-size: 22rpx;
	border: none;
}

.action-btn.edit {
	background: #e8f4ff;
	color: #1890ff;
}

.action-btn.delete {
	background: #fff1f0;
	color: #ff4d4f;
}

.empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 200rpx 40rpx;
	text-align: center;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
	margin-bottom: 16rpx;
}

.empty-desc {
	font-size: 24rpx;
	color: #ccc;
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
	justify-content: center;
	align-items: center;
	z-index: 1000;
}

.modal-content {
	background: #fff;
	border-radius: 16rpx;
	width: 90%;
	max-width: 600rpx;
	max-height: 80vh;
	display: flex;
	flex-direction: column;
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

.form-item {
	margin-bottom: 24rpx;
}

.label {
	font-size: 26rpx;
	color: #333;
	margin-bottom: 12rpx;
	display: block;
}

.required {
	color: #ff4d4f;
}

.input,
.textarea,
.picker {
	width: 100%;
	padding: 16rpx;
	border: 1rpx solid #e0e0e0;
	border-radius: 8rpx;
	font-size: 26rpx;
	box-sizing: border-box;
}

.textarea {
	min-height: 120rpx;
}

.picker {
	background: #fafafa;
	color: #333;
}

.modal-footer {
	padding: 24rpx;
	border-top: 1rpx solid #f0f0f0;
	display: flex;
	gap: 16rpx;
}

.btn {
	flex: 1;
	padding: 20rpx;
	border-radius: 8rpx;
	font-size: 28rpx;
	border: none;
}

.btn.cancel {
	background: #f5f5f5;
	color: #666;
}

.btn.confirm {
	background: #5b4bff;
	color: #fff;
}
</style>
