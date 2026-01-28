<template>
	<view class="add-page">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="header-title">新增退料</text>
			<view class="header-right"></view>
		</view>

		<scroll-view class="form-scroll" scroll-y>
			<!-- 退料信息 -->
			<view class="section">
				<text class="section-title">退料信息</text>
				<view class="form-card">
					<view class="form-item" v-for="field in returnFields" :key="field.key">
						<text class="field-label">{{ field.label }}</text>
						
						<!-- 普通输入框 -->
						<input 
							v-if="field.type === 'input'"
							class="field-input" 
							:placeholder="field.placeholder"
							v-model="formData[field.key]"
						/>
						
						<!-- 选择器 -->
						<view 
							v-else-if="field.type === 'picker'"
							class="field-picker"
							@click="openPicker(field.key)"
						>
							<text :class="['picker-text', formData[field.key] ? '' : 'placeholder']">
								{{ formData[field.key] || field.placeholder }}
							</text>
							<text class="picker-arrow">›</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 物料信息 -->
			<view class="section">
				<text class="section-title">物料信息</text>
				<view class="form-card">
					<view class="form-item" v-for="field in materialFields" :key="field.key">
						<text class="field-label">{{ field.label }}</text>
						
						<!-- 普通输入框 -->
						<input 
							v-if="field.type === 'input'"
							class="field-input" 
							:placeholder="field.placeholder"
							v-model="formData[field.key]"
						/>
						
						<!-- 选择器 -->
						<view 
							v-else-if="field.type === 'picker'"
							class="field-picker"
							@click="openPicker(field.key)"
						>
							<text :class="['picker-text', formData[field.key] ? '' : 'placeholder']">
								{{ formData[field.key] || field.placeholder }}
							</text>
							<text class="picker-arrow">›</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 备注 -->
			<view class="section">
				<text class="section-title">备注</text>
				<view class="form-card">
					<textarea 
						class="textarea-input"
						placeholder="请输入备注信息..."
						v-model="formData.remark"
						:maxlength="200"
					/>
				</view>
			</view>

			<!-- 底部占位 -->
			<view class="bottom-placeholder"></view>
		</scroll-view>

		<!-- 提交按钮 -->
		<view class="submit-bar">
			<button class="submit-btn" @click="handleSubmit">提交</button>
		</view>
	</view>
</template>

<script setup>
import { reactive, onMounted, onUnmounted } from 'vue'
import { createMaterialReturn } from '@/api/mock.js'

const formData = reactive({
	code: '',
	name: '',
	workOrder: '',
	workshop: '',
	process: '',
	returnPerson: '',
	returnDate: '',
	materialCode: '',
	materialName: '',
	specification: '',
	unit: '',
	quantity: '',
	batchNo: '',
	warehouse: '',
	warehouseArea: '',
	warehouseLocation: '',
	remark: '',
})

onMounted(() => {
	generateCode()
	
	uni.$on('returnWorkOrderSelected', handleWorkOrderSelected)
	uni.$on('returnWorkshopSelected', handleWorkshopSelected)
	uni.$on('returnProcessSelected', handleProcessSelected)
	uni.$on('returnPersonSelected', handleReturnPersonSelected)
	uni.$on('returnMaterialSelected', handleMaterialSelected)
	uni.$on('returnUnitSelected', handleUnitSelected)
	uni.$on('returnWarehouseSelected', handleWarehouseSelected)
	uni.$on('returnWarehouseAreaSelected', handleWarehouseAreaSelected)
	uni.$on('returnWarehouseLocationSelected', handleWarehouseLocationSelected)
})

onUnmounted(() => {
	uni.$off('returnWorkOrderSelected', handleWorkOrderSelected)
	uni.$off('returnWorkshopSelected', handleWorkshopSelected)
	uni.$off('returnProcessSelected', handleProcessSelected)
	uni.$off('returnPersonSelected', handleReturnPersonSelected)
	uni.$off('returnMaterialSelected', handleMaterialSelected)
	uni.$off('returnUnitSelected', handleUnitSelected)
	uni.$off('returnWarehouseSelected', handleWarehouseSelected)
	uni.$off('returnWarehouseAreaSelected', handleWarehouseAreaSelected)
	uni.$off('returnWarehouseLocationSelected', handleWarehouseLocationSelected)
})

function generateCode() {
	const timestamp = Date.now().toString()
	formData.code = `TLBH${timestamp.slice(-6)}`
}

function handleWorkOrderSelected(workOrder) {
	formData.workOrder = workOrder
}

function handleWorkshopSelected(workshop) {
	formData.workshop = workshop
}

function handleProcessSelected(process) {
	formData.process = process
}

function handleReturnPersonSelected(person) {
	formData.returnPerson = person
}

function handleMaterialSelected(material) {
	formData.materialCode = material.code
	formData.materialName = material.name
	if (material.specification) {
		formData.specification = material.specification
	}
}

function handleUnitSelected(unit) {
	formData.unit = unit
}

function handleWarehouseSelected(warehouse) {
	formData.warehouse = warehouse
}

function handleWarehouseAreaSelected(area) {
	formData.warehouseArea = area
}

function handleWarehouseLocationSelected(location) {
	formData.warehouseLocation = location
}

const returnFields = [
	{ label: '退料编号', key: 'code', type: 'input', placeholder: '请输入' },
	{ label: '退料单名称', key: 'name', type: 'input', placeholder: '请输入' },
	{ label: '生产工单', key: 'workOrder', type: 'picker', placeholder: '请选择' },
	{ label: '生产车间', key: 'workshop', type: 'picker', placeholder: '请选择' },
	{ label: '生产工序', key: 'process', type: 'picker', placeholder: '请选择' },
	{ label: '退料人', key: 'returnPerson', type: 'picker', placeholder: '请选择' },
	{ label: '退料日期', key: 'returnDate', type: 'picker', placeholder: '请选择' },
]

const materialFields = [
	{ label: '物料编号', key: 'materialCode', type: 'input', placeholder: '请输入' },
	{ label: '物料名称', key: 'materialName', type: 'picker', placeholder: '请选择' },
	{ label: '规格型号', key: 'specification', type: 'input', placeholder: '请输入内容' },
	{ label: '单位', key: 'unit', type: 'picker', placeholder: '请选择' },
	{ label: '退料数量', key: 'quantity', type: 'input', placeholder: '请输入' },
	{ label: '批次号', key: 'batchNo', type: 'input', placeholder: '请输入' },
	{ label: '仓库', key: 'warehouse', type: 'picker', placeholder: '请选择' },
	{ label: '库区', key: 'warehouseArea', type: 'picker', placeholder: '请选择' },
	{ label: '库位', key: 'warehouseLocation', type: 'picker', placeholder: '请选择' },
]

function openPicker(key) {
	if (key === 'workOrder') {
		uni.navigateTo({ 
			url: `/pages/workbench/warehouse/material-return/work-order-select?current=${encodeURIComponent(formData.workOrder || '')}` 
		})
	} else if (key === 'workshop') {
		uni.navigateTo({ 
			url: `/pages/workbench/warehouse/material-return/workshop-select?current=${encodeURIComponent(formData.workshop || '')}` 
		})
	} else if (key === 'process') {
		uni.navigateTo({ 
			url: `/pages/workbench/warehouse/material-return/process-select?current=${encodeURIComponent(formData.process || '')}` 
		})
	} else if (key === 'returnPerson') {
		uni.navigateTo({ 
			url: `/pages/workbench/warehouse/material-return/return-person-select?current=${encodeURIComponent(formData.returnPerson || '')}` 
		})
	} else if (key === 'materialName') {
		uni.navigateTo({ 
			url: `/pages/workbench/warehouse/material-return/material-select?current=${encodeURIComponent(formData.materialName || '')}` 
		})
	} else if (key === 'unit') {
		uni.navigateTo({ 
			url: `/pages/workbench/warehouse/material-return/unit-select?current=${encodeURIComponent(formData.unit || '')}` 
		})
	} else if (key === 'warehouse') {
		uni.navigateTo({ 
			url: `/pages/workbench/warehouse/material-return/warehouse-select?current=${encodeURIComponent(formData.warehouse || '')}` 
		})
	} else if (key === 'warehouseArea') {
		uni.navigateTo({ 
			url: `/pages/workbench/warehouse/material-return/warehouse-area-select?current=${encodeURIComponent(formData.warehouseArea || '')}` 
		})
	} else if (key === 'warehouseLocation') {
		uni.navigateTo({ 
			url: `/pages/workbench/warehouse/material-return/warehouse-location-select?current=${encodeURIComponent(formData.warehouseLocation || '')}` 
		})
	} else if (key === 'returnDate') {
		const now = new Date()
		const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
		const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
		
		uni.showActionSheet({
			itemList: ['选择日期和时间'],
			success: () => {
				uni.showModal({
					title: '选择日期',
					editable: true,
					placeholderText: currentDate,
					success: (dateRes) => {
						if (dateRes.confirm) {
							const selectedDate = dateRes.content || currentDate
							uni.showModal({
								title: '选择时间',
								editable: true,
								placeholderText: currentTime,
								success: (timeRes) => {
									if (timeRes.confirm) {
										const selectedTime = timeRes.content || currentTime
										const [year, month, day] = selectedDate.split('-')
										const [hour, minute] = selectedTime.split(':')
										formData.returnDate = `${year}.${month}.${day} ${hour}:${minute}:00`
									}
								}
							})
						}
					}
				})
			}
		})
	}
}

async function handleSubmit() {
	if (!formData.code) {
		uni.showToast({ title: '请输入退料编号', icon: 'none' })
		return
	}
	if (!formData.name) {
		uni.showToast({ title: '请输入退料单名称', icon: 'none' })
		return
	}

	uni.showLoading({ title: '提交中...' })
	
	try {
		const res = await createMaterialReturn(formData)
		
		if (res.code === 0) {
			uni.hideLoading()
			uni.showToast({ 
				title: '提交成功', 
				icon: 'success',
				duration: 1500
			})
			
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)
		} else {
			uni.hideLoading()
			uni.showToast({
				title: res.message || '提交失败',
				icon: 'none'
			})
		}
	} catch (error) {
		uni.hideLoading()
		uni.showToast({
			title: '提交失败',
			icon: 'none'
		})
	}
}

function goBack() {
	uni.navigateBack()
}
</script>

<style scoped>
.add-page {
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
	width: 160rpx;
	flex-shrink: 0;
}

.field-input {
	flex: 1;
	text-align: right;
	font-size: 28rpx;
	color: #333;
	padding-right: 8rpx;
}

.field-input::placeholder {
	color: #cfcfe6;
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
