<template>
	<view class="page">
		<view class="list card">
			<view class="item" v-for="p in persons" :key="p.id" @click="select(p)">
				<radio :value="p.id"></radio>
				<text class="name">{{ p.name }}</text>
			</view>
		</view>
		<view class="bottom">
			<button class="confirm" @click="confirm">确定</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const persons = ref([
	{ id: 1, name: '李伟' },
	{ id: 2, name: '陈曦' },
	{ id: 3, name: '王梓涵' },
	{ id: 4, name: '赵雨桐' },
	{ id: 5, name: '刘畅' },
])
const selected = ref(null)
function select(p){ selected.value = p }
function confirm(){
	if (!selected.value) { uni.showToast({ title: '请选择责任人', icon: 'none' }); return }
	uni.setStorageSync('abnormalPerson', selected.value)
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

