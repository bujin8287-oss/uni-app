<template>
	<view class="page">
		<view class="list card">
			<view class="item" v-for="it in items" :key="it.id" @click="select(it)">
				<radio :value="it.id"></radio>
				<text class="name">{{ it.name }}</text>
			</view>
		</view>
		<view class="bottom">
			<button class="confirm" @click="confirm">确定</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
	{ id: 'plan', name: '计划异常' },
	{ id: 'material', name: '物料异常' },
	{ id: 'equipment', name: '设备异常' },
	{ id: 'quality', name: '品质异常' },
	{ id: 'product', name: '产品异常' },
])
const selected = ref(null)
function select(it){ selected.value = it }
function confirm(){
	if (!selected.value) { uni.showToast({ title: '请选择', icon: 'none' }); return }
	uni.setStorageSync('abnormalLevel2', selected.value)
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

