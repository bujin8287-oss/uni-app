<template>
	<view class="page">
		<view class="card">
			<view class="row"><text class="label">应检数量</text><text class="value">{{ form.inspectQty }}</text></view>
			<view class="row"><text class="label">检验物料</text><text class="value">{{ form.material }}</text></view>
			<view class="row"><text class="label">检验方式</text><text class="value">全检</text></view>
			<view class="row clickable" @click="chooseInspector"><text class="label">检验人</text><text class="value">{{ form.inspector || '请选择' }}</text></view>
			<view class="row clickable" @click="chooseTime"><text class="label">检验时间</text><text class="value">{{ form.inspectTime || '请选择' }}</text></view>
			<view class="row"><text class="label">检验数量</text><input v-model="form.inspectQtyInput" placeholder="请输入数量" /></view>
			<view class="row"><text class="label">合格数量</text><input v-model="form.passQty" placeholder="请输入数量" /></view>
			<view class="row"><text class="label">不合格数量</text><input v-model="form.unpassQty" placeholder="请输入数量" /></view>
		</view>

		<view class="bad-list">
			<view class="bad-header">不合格品 <button @click="addBad">+</button></view>
			<!-- placeholder for bad items -->
		</view>

		<view class="submit">
			<button class="btn-submit" @click="submit">提交</button>
		</view>
	</view>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const form = reactive({
	inspectQty: 0,
	material: '',
	inspector: '',
	inspectTime: '',
	inspectQtyInput: '',
	passQty: '',
	unpassQty: '',
})

onLoad((options) => {
	if (options && options.data) {
		try {
			const parsed = JSON.parse(decodeURIComponent(options.data))
			form.inspectQty = parsed.inspectQty || 0
			form.material = parsed.material || ''
		} catch (e) {
			console.warn('parse data fail', e)
		}
	}
})

function chooseInspector() {
	uni.navigateTo({ url: '/pages/workbench/quality-control/final-inspection/inspector-select/index' })
}

function chooseTime() {
	const now = new Date()
	form.inspectTime = now.toISOString().slice(0,19).replace('T',' ')
}

function addBad() {
	uni.showToast({ title: '添加不合格示例（UI占位）', icon: 'none' })
}

function submit() {
	// here you'd send form to API; for UI demo show toast and navigateBack
	uni.showToast({ title: '提交成功', icon: 'success' })
	setTimeout(() => {
		uni.navigateBack()
	}, 700)
}
</script>

<style>
.page { padding:20rpx; background:#f7f6fb; min-height:100vh; }
.card { background:#fff; border-radius:12rpx; padding:18rpx; box-shadow:0 6rpx 16rpx rgba(0,0,0,0.03); }
.row { display:flex; justify-content:space-between; align-items:center; padding:12rpx 0; border-bottom:1rpx solid #f3f3f3; }
.label { color:#999; }
.value { color:#333; }
.clickable { cursor:pointer; }
.bad-list { margin-top:18rpx; }
.bad-header { display:flex; justify-content:space-between; align-items:center; color:#666; margin-bottom:8rpx; }
.submit { margin-top:24rpx; display:flex; justify-content:center; }
.btn-submit { width:90%; height:70rpx; background:#7b61ff; color:#fff; border-radius:40rpx; font-size:28rpx; }
input { text-align:right; border:none; color:#333; }
</style>

