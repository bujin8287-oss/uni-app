<template>
	<view class="start-page">
		<view class="form-container">
			<!-- 选择审批模板 -->
			<view class="form-section">
				<view class="section-title">选择审批模板</view>
				
				<picker 
					@change="onTemplateChange" 
					:value="templateIndex" 
					:range="templates" 
					range-key="name"
				>
					<view class="picker-view">
						<text>{{ selectedTemplate?.name || '请选择审批模板' }}</text>
						<text class="arrow">▼</text>
					</view>
				</picker>

				<!-- 显示模板流程预览 -->
				<view v-if="selectedTemplate" class="template-preview">
					<view class="preview-title">审批流程预览</view>
					<view class="flow-steps">
						<view class="step-item start">
							<text class="step-icon">🚀</text>
							<text class="step-name">发起申请</text>
						</view>
						<view class="step-arrow">→</view>
						<view 
							v-for="(node, index) in selectedTemplate.nodes" 
							:key="node.nodeId"
							class="step-group"
						>
							<view class="step-item">
								<text class="step-icon">{{ getNodeIcon(node) }}</text>
								<text class="step-name">{{ node.nodeName }}</text>
							</view>
							<view v-if="index < selectedTemplate.nodes.length - 1" class="step-arrow">→</view>
						</view>
						<view class="step-arrow">→</view>
						<view class="step-item end">
							<text class="step-icon">✅</text>
							<text class="step-name">审批完成</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 审批信息 -->
			<view v-if="selectedTemplate" class="form-section">
				<view class="section-title">审批信息</view>
				
				<view class="form-item">
					<text class="label">审批标题 <text class="required">*</text></text>
					<input 
						class="input" 
						v-model="formData.title" 
						placeholder="请输入审批标题"
					/>
				</view>

				<view class="form-item">
					<text class="label">业务类型 <text class="required">*</text></text>
					<picker 
						@change="onBusinessTypeChange" 
						:value="businessTypeIndex" 
						:range="businessTypeOptions" 
						range-key="label"
					>
						<view class="picker-view">
							<text>{{ businessTypeOptions[businessTypeIndex]?.label || '请选择' }}</text>
							<text class="arrow">▼</text>
						</view>
					</picker>
				</view>

				<view class="form-item">
					<text class="label">业务ID</text>
					<input 
						class="input" 
						v-model="formData.businessId" 
						placeholder="关联的业务ID（可选）"
					/>
				</view>

				<view class="form-item">
					<text class="label">申请说明</text>
					<textarea 
						class="textarea" 
						v-model="formData.description" 
						placeholder="请输入申请说明"
						maxlength="500"
					/>
				</view>

				<!-- 自定义表单数据 -->
				<view class="form-item">
					<text class="label">附加信息（JSON格式，可选）</text>
					<textarea 
						class="textarea" 
						v-model="formDataJson" 
						placeholder='例如：{"amount": 1000, "reason": "设备维修"}'
						maxlength="1000"
					/>
				</view>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view v-if="selectedTemplate" class="footer">
			<button class="cancel-btn" @click="cancel">取消</button>
			<button class="submit-btn" @click="submit">提交审批</button>
		</view>

		<!-- 加载状态 -->
		<view v-if="loading" class="loading-overlay">
			<view class="loading-content">
				<text>加载中...</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const templates = ref([])
const templateIndex = ref(-1)
const loading = ref(false)
const businessTypeIndex = ref(0)
const formDataJson = ref('')

const formData = ref({
	title: '',
	businessType: 'general',
	businessId: '',
	description: ''
})

const businessTypeOptions = [
	{ label: '通用审批', value: 'general' },
	{ label: '设备报废', value: 'device_scrap' },
	{ label: '设备维修', value: 'device_repair' },
	{ label: '设备保养', value: 'device_maintenance' },
	{ label: '采购申请', value: 'purchase' },
	{ label: '请假申请', value: 'leave' },
	{ label: '报销申请', value: 'expense' },
	{ label: '其他', value: 'other' }
]

const selectedTemplate = computed(() => {
	return templateIndex.value >= 0 ? templates.value[templateIndex.value] : null
})

onMounted(() => {
	loadTemplates()
})

function loadTemplates() {
	loading.value = true
	uni.request({
		url: 'http://localhost:3000/approval/templates?status=active',
		method: 'GET',
		success: (res) => {
			loading.value = false
			if (res.data.success) {
				templates.value = res.data.data
			}
		},
		fail: () => {
			loading.value = false
			uni.showToast({ title: '加载模板失败', icon: 'none' })
		}
	})
}

function onTemplateChange(e) {
	templateIndex.value = e.detail.value
}

function onBusinessTypeChange(e) {
	businessTypeIndex.value = e.detail.value
	formData.value.businessType = businessTypeOptions[e.detail.value].value
}

function getNodeIcon(node) {
	if (node.autoPass) return '⚡'
	if (node.nodeType === 'position') return '👔'
	if (node.nodeType === 'department_manager') return '👨‍💼'
	if (node.nodeType === 'user') return '👤'
	return '📋'
}

function cancel() {
	uni.navigateBack()
}

function submit() {
	// 验证
	if (!selectedTemplate.value) {
		uni.showToast({ title: '请选择审批模板', icon: 'none' })
		return
	}
	if (!formData.value.title) {
		uni.showToast({ title: '请输入审批标题', icon: 'none' })
		return
	}

	const user = uni.getStorageSync('user')
	if (!user || !user._id) {
		uni.showToast({ title: '请先登录', icon: 'none' })
		return
	}

	// 解析自定义表单数据
	let customFormData = {}
	if (formDataJson.value) {
		try {
			customFormData = JSON.parse(formDataJson.value)
		} catch (e) {
			uni.showToast({ title: 'JSON格式错误', icon: 'none' })
			return
		}
	}

	// 合并表单数据
	const finalFormData = {
		...customFormData,
		description: formData.value.description
	}

	const data = {
		templateId: selectedTemplate.value._id,
		businessType: formData.value.businessType,
		businessId: formData.value.businessId || selectedTemplate.value._id,
		title: formData.value.title,
		applicantId: user._id,
		applicantName: user.realName || user.username,
		formData: finalFormData
	}

	uni.showLoading({ title: '提交中...' })
	uni.request({
		url: 'http://localhost:3000/approval/instances',
		method: 'POST',
		data,
		success: (res) => {
			uni.hideLoading()
			if (res.data.success) {
				uni.showToast({ 
					title: '提交成功', 
					icon: 'success' 
				})
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
			} else {
				uni.showToast({ title: res.data.message || '提交失败', icon: 'none' })
			}
		},
		fail: () => {
			uni.hideLoading()
			uni.showToast({ title: '提交失败', icon: 'none' })
		}
	})
}
</script>

<style scoped>
.start-page {
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

/* 模板预览 */
.template-preview {
	margin-top: 24rpx;
	padding: 20rpx;
	background: #f9f9f9;
	border-radius: 12rpx;
}

.preview-title {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 16rpx;
}

.flow-steps {
	display: flex;
	align-items: center;
	overflow-x: auto;
	padding: 10rpx 0;
}

.step-group {
	display: flex;
	align-items: center;
}

.step-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
	min-width: 120rpx;
	padding: 16rpx;
	background: #fff;
	border-radius: 12rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.step-item.start {
	background: #e3f2fd;
}

.step-item.end {
	background: #e8f5e9;
}

.step-icon {
	font-size: 32rpx;
}

.step-name {
	font-size: 22rpx;
	color: #333;
	text-align: center;
}

.step-arrow {
	margin: 0 12rpx;
	color: #999;
	font-size: 24rpx;
}

/* 表单 */
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

/* 加载状态 */
.loading-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
}

.loading-content {
	background: #fff;
	padding: 40rpx 60rpx;
	border-radius: 12rpx;
	font-size: 28rpx;
	color: #333;
}
</style>
