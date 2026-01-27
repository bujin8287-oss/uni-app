<template>
	<view class="approval-page">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="header-title">审批</text>
			<view class="header-right"></view>
		</view>

		<scroll-view class="form-scroll" scroll-y>
			<view class="section">
				<view class="form-card">
					<view class="form-item" @click="openActionSelect">
						<text class="field-label">审批操作</text>
						<view class="field-picker">
							<text :class="['picker-text', formData.action ? '' : 'placeholder']">
								{{ formData.action || '请选择' }}
							</text>
							<text class="picker-arrow">›</text>
						</view>
					</view>
					<view class="form-item" @click="openPersonSelect" v-if="formData.actionValue === 'approved' && needNextApprover">
						<text class="field-label">下一步审批人</text>
						<view class="field-picker">
							<text :class="['picker-text', formData.nextPerson ? '' : 'placeholder']">
								{{ formData.nextPerson || '请选择' }}
							</text>
							<text class="picker-arrow">›</text>
						</view>
					</view>
				</view>
			</view>

			<view class="section">
				<text class="section-title">备注</text>
				<view class="form-card">
					<textarea 
						class="textarea-input"
						placeholder="请输入备注..."
						v-model="formData.remark"
						:maxlength="200"
					/>
				</view>
			</view>

			<view class="bottom-placeholder"></view>
		</scroll-view>

		<view class="submit-bar">
			<button class="submit-btn" @click="handleSubmit">提交</button>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getApprovalDetail, submitApproval } from '@/api/mock.js'

const taskId = ref('')
const needNextApprover = ref(false)

const formData = reactive({
	action: '',
	actionValue: '', // 'approved' or 'rejected'
	nextPerson: '',
	nextPersonId: '',
	remark: '',
})

onLoad((options) => {
	if (options.id) {
		taskId.value = options.id
		checkWorkflow(options.id)
	}
})

onMounted(() => {
	uni.$on('approvalActionSelected', handleActionSelected)
	uni.$on('approvalPersonSelected', handlePersonSelected)
})

onUnmounted(() => {
	uni.$off('approvalActionSelected', handleActionSelected)
	uni.$off('approvalPersonSelected', handlePersonSelected)
})

async function checkWorkflow(id) {
	try {
		const res = await getApprovalDetail({ id })
		if (res.code === 0) {
			const { currentNode, nodes } = res.data
			// 检查下一节点是否需要指定审批人
			if (currentNode < nodes.length) {
				const nextNode = nodes.find(n => n.nodeId === currentNode + 1)
				needNextApprover.value = nextNode && !nextNode.approverId
			}
		}
	} catch (error) {
		console.error('检查流程失败:', error)
	}
}

function handleActionSelected(data) {
	formData.action = data.label
	formData.actionValue = data.value
}

function handlePersonSelected(data) {
	formData.nextPerson = data.name
	formData.nextPersonId = data.id
}

function openActionSelect() {
	uni.navigateTo({ 
		url: `/pages/todo/action-select?current=${encodeURIComponent(formData.action || '')}` 
	})
}

function openPersonSelect() {
	uni.navigateTo({ 
		url: `/pages/todo/person-select?current=${encodeURIComponent(formData.nextPerson || '')}` 
	})
}

async function handleSubmit() {
	if (!formData.action) {
		uni.showToast({ title: '请选择审批操作', icon: 'none' })
		return
	}
	
	// 如果是通过且需要指定下一步审批人
	if (formData.actionValue === 'approved' && needNextApprover.value && !formData.nextPerson) {
		uni.showToast({ title: '请选择下一步审批人', icon: 'none' })
		return
	}

	uni.showLoading({ title: '提交中...' })
	
	try {
		const res = await submitApproval({
			id: taskId.value,
			action: formData.actionValue,
			nextApprover: formData.nextPerson,
			nextApproverId: formData.nextPersonId,
			comment: formData.remark || '无'
		})
		
		uni.hideLoading()
		
		if (res.code === 0) {
			uni.showToast({ 
				title: '审批成功', 
				icon: 'success',
				duration: 1500
			})
			
			setTimeout(() => {
				uni.navigateBack({ delta: 2 })
			}, 1500)
		} else {
			uni.showToast({ title: res.message || '审批失败', icon: 'none' })
		}
	} catch (error) {
		uni.hideLoading()
		console.error('提交审批失败:', error)
		uni.showToast({ title: '提交失败', icon: 'none' })
	}
}

function goBack() {
	uni.navigateBack()
}
</script>

<style scoped>
.approval-page {
	background: #f7f6fb;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

.header {
	background: #fff;
	padding: 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1rpx solid #f0f0f0;
}

.back-btn {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-icon {
	font-size: 48rpx;
	color: #333;
	font-weight: 300;
}

.header-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
}

.header-right {
	width: 60rpx;
}

.form-scroll {
	flex: 1;
	padding: 20rpx;
	box-sizing: border-box;
}

.section {
	margin-bottom: 24rpx;
}

.section-title {
	color: #333;
	font-size: 28rpx;
	font-weight: 700;
	display: block;
	margin-bottom: 16rpx;
}

.form-card {
	background: #fff;
	border-radius: 12rpx;
	padding: 0 24rpx;
	box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
}

.form-item {
	display: flex;
	align-items: center;
	padding: 28rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
}

.form-item:last-child {
	border-bottom: none;
}

.field-label {
	color: #333;
	font-size: 28rpx;
	width: 200rpx;
	flex-shrink: 0;
}

.field-picker {
	flex: 1;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 8rpx;
	padding-right: 8rpx;
}

.picker-text {
	font-size: 28rpx;
	color: #333;
}

.picker-text.placeholder {
	color: #cfcfe6;
}

.picker-arrow {
	color: #cfcfe6;
	font-size: 32rpx;
}

.textarea-input {
	width: 100%;
	min-height: 200rpx;
	padding: 24rpx;
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
	box-sizing: border-box;
}

.textarea-input::placeholder {
	color: #cfcfe6;
}

.bottom-placeholder {
	height: 40rpx;
}

.submit-bar {
	padding: 20rpx;
	background: #fff;
	box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.submit-btn {
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

.submit-btn::after {
	border: none;
}
</style>
