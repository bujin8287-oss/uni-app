<template>
	<view class="page">
		<view class="list card">
			<view class="item" v-for="d in depts" :key="d.id" @click="select(d)">
				<radio :value="d.id"></radio>
				<text class="name">{{ d.name }}</text>
			</view>
		</view>
		<view class="bottom">
			<button class="confirm" @click="confirm">确定</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const depts = ref([
	{ id: 'prod', name: '生产部' },
	{ id: 'r&d', name: '技术研发部' },
	{ id: 'qa', name: '质量管理部' },
	{ id: 'purch', name: '采购部' },
	{ id: 'equip', name: '设备管理部' },
	{ id: 'storage', name: '仓储物流部' },
])
const selected = ref(null)
function select(d){ selected.value = d }
function confirm(){
	if (!selected.value) { uni.showToast({ title: '请选择部门', icon: 'none' }); return }
	uni.setStorageSync('abnormalDept', selected.value)
	uni.navigateBack()
}
</script>

<style scoped>
.page { padding:20rpx; background:#f7f8fb; min-height:100vh; display:flex; flex-direction:column; justify-content:space-between; }
.card { background:#fff; padding:12rpx; border-radius:12rpx; box-shadow:0 6rpx 16rpx rgba(0,0,0,0.04); }
.item { display:flex; align-items:center; gap:12rpx; padding:16rpx 0; border-bottom:1rpx solid #f1f1f6; }
.bottom { padding:12rpx 0; }
.confirm { width:100%; background:linear-gradient(180deg,#7b66ff,#7b66ff); color:#fff; padding:16rpx; border-radius:40rpx; }
</style>

