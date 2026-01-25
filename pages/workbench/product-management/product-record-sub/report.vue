<template>
	<view class="page">
		<view class="card">
			<view class="row"><text class="label">报工良数</text><input class="value-input" v-model="form.goodCount" placeholder="请输入" /></view>
			<view class="row"><text class="label">不良数</text><input class="value-input" v-model="form.badCount" placeholder="请输入" /></view>
			<view class="row link" @click="chooseGroup"><text class="label">报工班组</text><text class="value">{{ selectedGroup?.name || '请选择' }}</text></view>
			<view class="row link" @click="chooseEmployee"><text class="label">报工员工</text><text class="value">{{ selectedEmployee?.name || '请选择' }}</text></view>
			<view class="row"><text class="label">报工工时</text><input class="value-input" v-model="form.hours" placeholder="请输入" /></view>
			<view class="row"><text class="label">是否检验</text><picker :range="['是','否']" @change="onCheckChange"><text class="value">{{ form.inspect || '请选择' }}</text></picker></view>
		</view>

		<view class="remarks">
			<text class="title">备注</text>
			<textarea class="note" v-model="form.remark" placeholder="请输入..." />
		</view>

		<view class="submit-wrap">
			<button class="submit" @click="submit">提交</button>
		</view>
	</view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'

const form = reactive({ goodCount:'', badCount:'', hours:'', inspect:'', remark:'' })
const selectedGroup = ref(null)
const selectedEmployee = ref(null)
const code = ref('')

onLoad((options) => {
	code.value = decodeURIComponent(options?.code || '')
})

onShow(() => {
	const g = uni.getStorageSync('selectedGroup')
	if (g) { selectedGroup.value = g; uni.removeStorageSync('selectedGroup') }
	const e = uni.getStorageSync('selectedEmployee')
	if (e) { selectedEmployee.value = e; uni.removeStorageSync('selectedEmployee') }
})

function chooseGroup() {
	uni.navigateTo({ url: '/pages/workbench/product-management/product-record-sub/select-group' })
}
function chooseEmployee() {
	uni.navigateTo({ url: '/pages/workbench/product-management/product-record-sub/select-employee' })
}
function onCheckChange(e) {
	form.inspect = e?.detail?.value === 0 ? '是' : '否'
}
function submit() {
	// demo submit
	console.log('submit', { code: code.value, ...form, group: selectedGroup.value, employee: selectedEmployee.value })
	uni.showToast({ title: '提交成功', icon: 'success' })
}
</script>

<style scoped>
.page { padding: 20rpx; background:#f7f8fb; min-height:100vh; padding-bottom:120rpx; }
.card { background:#fff; border-radius:12rpx; padding:12rpx; box-shadow:0 6rpx 16rpx rgba(0,0,0,0.04); }
.row { display:flex; justify-content:space-between; align-items:center; padding:14rpx 0; border-bottom:1rpx solid #f1f1f6; }
.label { color:#9b9b9b; font-size:22rpx; }
.value { color:#333; font-size:22rpx; }
.value-input { text-align:right; width:50%; padding:8rpx; }
.link { cursor:pointer; }
.remarks { margin-top:18rpx; padding:0 6rpx; }
.title { color:#9b9b9b; margin-bottom:8rpx; }
.note { width:100%; height:160rpx; border-radius:10rpx; padding:12rpx; background:#fff; }
.submit-wrap { position:fixed; left:20rpx; right:20rpx; bottom:20rpx; }
.submit { width:100%; background:linear-gradient(180deg,#7b66ff,#7b66ff); color:#fff; padding:18rpx; border-radius:40rpx; font-size:24rpx; }
</style>

