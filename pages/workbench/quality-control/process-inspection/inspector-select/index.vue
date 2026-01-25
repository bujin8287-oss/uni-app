<template>
	<view class="page">
		<view class="list">
			<view class="row" v-for="name in names" :key="name" @click="select(name)">
				<text>{{ name }}</text>
			</view>
		</view>
		<view class="confirm">
			<button class="btn" @click="confirm">确定</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const names = ref([
	'李伟','陈曦','王梓涵','赵雨桐','刘畅','张梦琪','陈明宇','杨悦','黄思睿','周浩然','吴桐','马雨欣','朱星辰'
])
const selected = ref('')

function select(name) {
	selected.value = name
	// store selection temporarily and go back
	uni.setStorageSync('selectedInspector', name)
	uni.navigateBack()
}

function confirm() {
	if (selected.value) {
		uni.setStorageSync('selectedInspector', selected.value)
	}
	uni.navigateBack()
}
</script>

<style>
.page { padding:24rpx; background:#f7f6fb; min-height:100vh; }
.row { background:#fff; padding:20rpx; margin-bottom:12rpx; border-radius:12rpx; }
.confirm { position:fixed; left:24rpx; right:24rpx; bottom:30rpx; }
.btn { width:100%; height:64rpx; background:#7b61ff; color:#fff; border-radius:36rpx; font-size:28rpx; }
</style>

