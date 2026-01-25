<template>
	<view class="page">
		<view class="header">
			<text class="title">来料检验</text>
			<button class="add" @click="goAdd">新增</button>
		</view>
		<view class="list">
			<block v-for="item in list" :key="item.id">
				<view class="card" @click="openDetail(item)">
					<view class="row">
						<text class="code">{{ item.code }}</text>
						<text class="name">{{ item.materialName }}</text>
					</view>
					<view class="meta">
						<text>检验数量：{{ item.qty }}</text>
						<text>合格：{{ item.pass }}</text>
						<text>不合格：{{ item.fail }}</text>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const list = ref([
	{ id: 1, code: 'LLJY0000001', materialName: '内存条', qty: 1000, pass: 995, fail: 5 },
	{ id: 2, code: 'LLJY0000002', materialName: 'PCB 电路板', qty: 500, pass: 500, fail: 0 },
])

function openDetail(item) {
	if (!item) return
	uni.navigateTo({ url: `/pages/workbench/quality-control/incoming-inspection/detail?code=${encodeURIComponent(item.code)}` })
}

function goAdd() {
	uni.navigateTo({ url: '/pages/workbench/quality-control/incoming-inspection/add' })
}
</script>

<style>
.page { padding: 24rpx; background: #f7f6fb; min-height: 100vh; }
.header { display:flex; justify-content:space-between; align-items:center; margin-bottom:18rpx; }
.title { font-size:34rpx; font-weight:700; }
.add { background:#7b61ff; color:#fff; padding:10rpx 18rpx; border-radius:18rpx; }
.list { display:flex; flex-direction:column; gap:14rpx; }
.card { background:#fff; padding:18rpx; border-radius:12rpx; box-shadow:0 6rpx 14rpx rgba(0,0,0,0.03); }
.row { display:flex; justify-content:space-between; margin-bottom:8rpx; }
.code { font-weight:700; }
.meta { color:#888; display:flex; gap:18rpx; }
</style>

