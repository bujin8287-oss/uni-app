<template>
	<view class="page">
		<view class="list">
			<view class="item" v-for="(name, idx) in names" :key="idx" @click="select(name)">
				<view class="radio"></view>
				<text class="name">{{ name }}</text>
			</view>
		</view>
		<view class="footer">
			<button class="btn" @click="confirm">确定</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const names = [
	'李伟','陈曦','王梓涵','赵雨桐','刘畅','张梦琪','陈明宇','杨悦','黄思睿','周浩然','吴桐','马雨欣','朱星辰'
]
const selected = ref('')

function select(name) {
	selected.value = name
}

function confirm() {
	if (!selected.value) {
		uni.showToast({ title: '请选择检验人', icon: 'none' })
		return
	}
	uni.setStorageSync('selectedInspector', selected.value)
	uni.navigateBack()
}
</script>

<style>
.page { padding:20rpx; background:#fff; min-height:100vh; }
.list { display:flex; flex-direction:column; gap:12rpx; margin-top:12rpx; }
.item { display:flex; align-items:center; gap:12rpx; padding:16rpx; border-bottom:1rpx solid #f3f3f3; }
.radio { width:24rpx; height:24rpx; border-radius:12rpx; border:1rpx solid #ddd; }
.name { color:#333; font-size:26rpx; }
.footer { position:fixed; left:0; right:0; bottom:18rpx; padding:0 20rpx; }
.btn { width:100%; height:70rpx; background:#7b61ff; color:#fff; border-radius:40rpx; font-size:28rpx; }
</style>

