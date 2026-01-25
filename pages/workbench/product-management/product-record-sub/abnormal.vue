<template>
	<view class="page">
		<view class="card">
			<view class="row link" @click="chooseLevel1"><text class="label">一级异常</text><text class="value">{{ level1?.name || '请选择' }}</text></view>
			<view class="row link" @click="chooseLevel2"><text class="label">二级异常</text><text class="value">{{ level2?.name || '请选择' }}</text></view>
			<view class="row link" @click="chooseDept"><text class="label">责任部门</text><text class="value">{{ dept?.name || '请选择' }}</text></view>
			<view class="row link" @click="choosePerson"><text class="label">责任人</text><text class="value">{{ person?.name || '请选择' }}</text></view>
		</view>

		<view class="desc">
			<textarea class="note" v-model="desc" placeholder="请输入异常描述..." />
		</view>

		<view class="submit-wrap">
			<button class="submit" @click="submit">提交</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const level1 = ref(null)
const level2 = ref(null)
const dept = ref(null)
const person = ref(null)
const desc = ref('')

onShow(() => {
	const l1 = uni.getStorageSync('abnormalLevel1'); if (l1) { level1.value = l1; uni.removeStorageSync('abnormalLevel1') }
	const l2 = uni.getStorageSync('abnormalLevel2'); if (l2) { level2.value = l2; uni.removeStorageSync('abnormalLevel2') }
	const d = uni.getStorageSync('abnormalDept'); if (d) { dept.value = d; uni.removeStorageSync('abnormalDept') }
	const p = uni.getStorageSync('abnormalPerson'); if (p) { person.value = p; uni.removeStorageSync('abnormalPerson') }
})

function chooseLevel1(){ uni.navigateTo({ url: '/pages/workbench/product-management/product-record-sub/abnormal-level1' }) }
function chooseLevel2(){ uni.navigateTo({ url: '/pages/workbench/product-management/product-record-sub/abnormal-level2' }) }
function chooseDept(){ uni.navigateTo({ url: '/pages/workbench/product-management/product-record-sub/responsibility-dept' }) }
function choosePerson(){ uni.navigateTo({ url: '/pages/workbench/product-management/product-record-sub/responsibility-person' }) }

function submit(){
	console.log('abnormal submit', { level1: level1.value, level2: level2.value, dept: dept.value, person: person.value, desc: desc.value })
	uni.showToast({ title: '提交成功', icon: 'success' })
}
</script>

<style scoped>
.page { padding:20rpx; background:#f7f8fb; min-height:100vh; padding-bottom:120rpx; }
.card { background:#fff; border-radius:12rpx; padding:12rpx; box-shadow:0 6rpx 16rpx rgba(0,0,0,0.04); }
.row { display:flex; justify-content:space-between; align-items:center; padding:14rpx 0; border-bottom:1rpx solid #f1f1f6; }
.label { color:#9b9b9b; font-size:22rpx; }
.value { color:#333; font-size:22rpx; }
.link { cursor:pointer; }
.desc { margin-top:18rpx; }
.note { width:100%; height:160rpx; border-radius:10rpx; padding:12rpx; background:#fff; }
.submit-wrap { position:fixed; left:20rpx; right:20rpx; bottom:20rpx; }
.submit { width:100%; background:linear-gradient(180deg,#7b66ff,#7b66ff); color:#fff; padding:18rpx; border-radius:40rpx; font-size:24rpx; }
</style>

