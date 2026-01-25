<template>
	<view class="page">
		<view class="list">
			<view class="card" v-for="item in records" :key="item.id" @click="openRecord(item)">
				<view class="card-head">
					<view class="badge">全检</view>
					<text class="code">{{ item.code }}</text>
					<view :class="['status', item.status === 'done' ? 'done' : 'todo']">{{ item.status === 'done' ? '已检验' : '未检验' }}</view>
				</view>
				<view class="card-body">
					<view class="row"><text class="label">物料名称</text><text class="value">{{ item.material }}</text></view>
					<view class="row"><text class="label">检验数量</text><text class="value">{{ item.inspectQty || '---' }}</text></view>
					<view class="row"><text class="label">合格数量</text><text class="value">{{ item.passQty || '---' }}</text></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { reactive } from 'vue'

// mocked records for UI; in real app replace with API call
const records = reactive([
	{ id: 1, code: 'ZZJY0000001', material: '笔记本电脑', status: 'todo' },
	{ id: 2, code: 'ZZJY0000002', material: '笔记本电脑', status: 'todo' },
	{ id: 3, code: 'ZZJY0000003', material: '笔记本电脑', status: 'todo' },
	{ id: 4, code: 'ZZJY0000004', material: '笔记本电脑', status: 'done', inspectQty: 1000, passQty: 995, unpassQty: 5, inspector: '刘超', inspectTime: '2025.04.24 14:00:00', remark: '不合格数量较多' },
	{ id: 5, code: 'ZZJY0000005', material: '笔记本电脑', status: 'done', inspectQty: 1000, passQty: 995, unpassQty: 5, inspector: '刘超', inspectTime: '2025.04.24 14:00:00' },
])

function openRecord(item) {
	if (!item) return
	const payload = encodeURIComponent(JSON.stringify(item))
	if (item.status === 'done') {
		uni.navigateTo({ url: `/pages/workbench/quality-control/final-inspection/detail?data=${payload}` })
	} else {
		uni.navigateTo({ url: `/pages/workbench/quality-control/final-inspection/add?data=${payload}` })
	}
}
</script>

<style>
.page { padding: 20rpx; background: #f7f6fb; min-height: 100vh; }
.list { display: flex; flex-direction: column; gap: 20rpx; }
.card { background: #fff; border-radius: 12rpx; padding: 18rpx; box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.03); }
.card-head { display:flex; align-items:center; gap:12rpx; margin-bottom:12rpx; }
.badge { background:#e8f2ff; color:#3a71ff; padding:6rpx 10rpx; border-radius:8rpx; font-size:22rpx; }
.code { font-weight:700; font-size:28rpx; flex:1; }
.status { padding:6rpx 10rpx; border-radius:8rpx; font-size:22rpx; }
.status.done { background:#e9f9ef; color:#2fb56b; }
.status.todo { background:#fff5f0; color:#a78bff; border:1rpx solid #ececec; }
.card-body .row { display:flex; justify-content:space-between; padding:6rpx 0; color:#666; font-size:24rpx; border-top:1rpx solid #f3f3f3; }
.label { color:#999; }
.value { color:#333; }
</style>

