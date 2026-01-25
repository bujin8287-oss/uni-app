<template>
	<view class="page">
		<view class="list">
			<view class="item" v-for="record in records" :key="record.id" @click="openRecord(record)">
				<text class="title">{{ record.code }}</text>
				<text class="meta">{{ record.material }} · {{ record.quantity }}</text>
				<text class="status">{{ record.status === 'done' ? '已检验' : '未检验' }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const records = ref([
	{ id: 1, code: 'GCJY0000001', material: '内存条', quantity: 1000, status: 'pending' },
	{ id: 2, code: 'GCJY0000002', material: '内存条', quantity: 1000, status: 'done' },
	{ id: 3, code: 'GCJY0000003', material: '内存条', quantity: 1000, status: 'pending' },
])

function openRecord(record) {
	if (!record) return
	if (record.status === 'pending') {
		uni.navigateTo({ url: '/pages/workbench/quality-control/process-inspection/add?code=' + record.code })
	} else {
		uni.navigateTo({ url: '/pages/workbench/quality-control/process-inspection/detail?code=' + record.code })
	}
}
</script>

<style>
.page { padding: 24rpx; background: #f7f6fb; min-height: 100vh; }
.item { background: #fff; padding: 20rpx; border-radius: 12rpx; margin-bottom: 14rpx; display:flex; justify-content:space-between; align-items:center; }
.title { font-weight:700; font-size:30rpx; }
.meta { color:#888; font-size:24rpx; margin-left:12rpx; flex:1; text-align:left; padding-left:12rpx; }
.status { color:#3cb371; font-size:24rpx; }
</style>

