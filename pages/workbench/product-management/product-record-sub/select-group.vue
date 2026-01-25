<template>
	<view class="page">
		<view class="list card">
			<view class="item" v-for="g in groups" :key="g.id" @click="select(g)">
				<radio :value="g.id"></radio>
				<text class="name">{{ g.name }}</text>
			</view>
		</view>
		<view class="bottom">
			<button class="confirm" @click="confirm">确定</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const groups = ref([
	{ id: 1, name: '第一生产班组' },
	{ id: 2, name: '第二生产班组' },
	{ id: 3, name: '第三生产班组' },
	{ id: 4, name: '第四生产班组' },
	{ id: 5, name: '第五生产班组' },
])
const selected = ref(null)

function select(g) {
	selected.value = g
}
function confirm() {
	if (!selected.value) {
		uni.showToast({ title: '请选择班组', icon: 'none' })
		return
	}
	uni.setStorageSync('selectedGroup', selected.value)
	uni.navigateBack()
}
</script>

<style scoped>
.page { padding:20rpx; background:#f7f8fb; min-height:100vh; display:flex; flex-direction:column; justify-content:space-between; }
.card { background:#fff; padding:12rpx; border-radius:12rpx; box-shadow:0 6rpx 16rpx rgba(0,0,0,0.04); }
.item { display:flex; align-items:center; gap:12rpx; padding:16rpx 0; border-bottom:1rpx solid #f1f1f6; }
.name { font-size:22rpx; color:#333; }
.bottom { padding:12rpx 0; }
.confirm { width:100%; background:linear-gradient(180deg,#7b66ff,#7b66ff); color:#fff; padding:16rpx; border-radius:40rpx; }
</style>

