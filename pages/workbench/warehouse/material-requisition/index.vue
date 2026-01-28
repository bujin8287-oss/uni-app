<template>
	<view class="requisition-page">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="header-title">生产领料</text>
			<text class="header-action" @click="goToAdd">新增</text>
		</view>

		<scroll-view 
			class="list-scroll" 
			scroll-y
			refresher-enabled
			:refresher-triggered="refreshing"
			@refresherrefresh="onRefresh"
			@scrolltolower="onLoadMore"
		>
			<view 
				class="requisition-card" 
				v-for="item in requisitionList" 
				:key="item.id"
				@click="openDetail(item)"
			>
				<view class="card-header">
					<text class="code">{{ item.code }}</text>
					<text class="arrow">›</text>
				</view>
				<view class="card-body">
					<view class="info-row">
						<text class="label">领料单名称</text>
						<text class="value">{{ item.name }}</text>
					</view>
					<view class="info-row">
						<text class="label">生产工单</text>
						<text class="value">{{ item.workOrder }}</text>
					</view>
					<view class="info-row">
						<text class="label">领料日期</text>
						<text class="value">{{ item.requisitionDate }}</text>
					</view>
				</view>
			</view>

			<!-- 加载状态 -->
			<view v-if="loading" class="loading-state">
				<text class="loading-text">加载中...</text>
			</view>

			<!-- 空状态 -->
			<view v-if="!loading && requisitionList.length === 0" class="empty-state">
				<text class="empty-text">暂无领料记录</text>
			</view>

			<!-- 没有更多 -->
			<view v-if="!loading && noMore && requisitionList.length > 0" class="no-more">
				<text class="no-more-text">没有更多了</text>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMaterialRequisitionList } from '@/api/mock.js'

const requisitionList = ref([])
const loading = ref(false)
const refreshing = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = 10

onMounted(() => {
	loadData()
})

async function loadData(isRefresh = false) {
	if (loading.value) return
	
	loading.value = true
	
	try {
		const res = await getMaterialRequisitionList({ page: page.value, pageSize })
		
		if (res.code === 0) {
			if (isRefresh) {
				requisitionList.value = res.data.items
				refreshing.value = false
			} else {
				requisitionList.value = [...requisitionList.value, ...res.data.items]
			}
			
			// 判断是否还有更多数据
			noMore.value = page.value * pageSize >= res.data.total
		}
	} catch (error) {
		uni.showToast({
			title: '加载失败',
			icon: 'none'
		})
	} finally {
		loading.value = false
	}
}

function onRefresh() {
	refreshing.value = true
	page.value = 1
	noMore.value = false
	loadData(true)
}

function onLoadMore() {
	if (loading.value || noMore.value) return
	page.value++
	loadData()
}

function goBack() {
	uni.navigateBack()
}

function goToAdd() {
	uni.navigateTo({ url: '/pages/workbench/warehouse/material-requisition/add' })
}

function openDetail(item) {
	uni.navigateTo({ 
		url: `/pages/workbench/warehouse/material-requisition/detail?id=${item.id}` 
	})
}
</script>

<style scoped>
.requisition-page {
	background: #f7f6fb;
	min-height: 100vh;
}

.header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 88rpx;
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 24rpx;
	z-index: 100;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
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
	line-height: 1;
}

.header-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	flex: 1;
	text-align: center;
}

.header-action {
	font-size: 28rpx;
	color: #7c66ff;
	width: 60rpx;
	text-align: right;
}

.list-scroll {
	height: calc(100vh - 88rpx);
	margin-top: 88rpx;
	padding: 20rpx;
	padding-bottom: 40rpx;
	box-sizing: border-box;
}

.requisition-card {
	background: #fff;
	padding: 24rpx;
	margin-bottom: 16rpx;
	border-radius: 12rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.card-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16rpx;
}

.code {
	font-size: 32rpx;
	font-weight: 700;
	color: #333;
}

.arrow {
	font-size: 32rpx;
	color: #cfcfe6;
}

.card-body {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.info-row {
	display: flex;
	align-items: center;
}

.label {
	color: #9b9b9b;
	font-size: 24rpx;
	min-width: 140rpx;
	flex-shrink: 0;
}

.value {
	color: #333;
	font-size: 24rpx;
	flex: 1;
}

.empty-state {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 120rpx 0;
}

.empty-text {
	color: #9b9b9b;
	font-size: 28rpx;
}

.loading-state {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 40rpx 0;
}

.loading-text {
	color: #9b9b9b;
	font-size: 24rpx;
}

.no-more {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 40rpx 0;
}

.no-more-text {
	color: #cfcfe6;
	font-size: 24rpx;
}
</style>
