<template>
	<view class="page">
		<view class="section card">
			<view class="row"><text class="label">应检数量</text><text class="value">1000</text></view>
			<view class="row"><text class="label">检验方式</text><text class="value">全检</text></view>
			<view class="row link" @click="chooseInspector"><text class="label">检验人</text><text class="value">{{ inspector || '请选择' }}</text></view>
			<view class="row"><text class="label">检验时间</text><text class="value">{{ time || '请选择' }}</text></view>
			<view class="row"><text class="label">检验数量</text><input class="input" placeholder="请输入数量" v-model="checkedNum" /></view>
			<view class="row"><text class="label">合格数量</text><input class="input" placeholder="请输入数量" v-model="passNum" /></view>
			<view class="row"><text class="label">不合格数量</text><input class="input" placeholder="请输入数量" v-model="failNum" /></view>
		</view>
		<view class="footer">
			<button class="btn" @click="submit">提交</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const inspector = ref('')
const time = ref('')
const checkedNum = ref('')
const passNum = ref('')
const failNum = ref('')
const code = ref('')

onLoad((options) => {
	code.value = options.code || ''
	// try to read inspector selection if returned via storage
	const sel = uni.getStorageSync('selectedInspector')
	if (sel) {
		inspector.value = sel
		uni.removeStorageSync('selectedInspector')
	}
})

function chooseInspector() {
	uni.navigateTo({ url: '/pages/workbench/quality-control/process-inspection/inspector-select/index' })
}

function submit() {
	// basic navigation to detail page after submit
	uni.navigateTo({ url: '/pages/workbench/quality-control/process-inspection/detail?code=' + code.value })
}
</script>

<style>
.page { padding: 24rpx; background:#f7f6fb; min-height:100vh; }
.card { background:#fff; border-radius:12rpx; padding:18rpx; margin-bottom:20rpx; }
.row { display:flex; justify-content:space-between; align-items:center; padding:12rpx 0; border-bottom:1rpx solid #f0f0f0; }
.label { color:#666; }
.value { color:#222; }
.link { cursor:pointer; }
.input { width:220rpx; text-align:right; }
.footer { position:fixed; left:24rpx; right:24rpx; bottom:30rpx; }
.btn { width:100%; height:64rpx; background:#7b61ff; color:#fff; border-radius:36rpx; font-size:28rpx; }
</style>

