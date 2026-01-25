<template>
	<view class="page">
		<view class="form card">
			<view class="row">
				<text>检验编号</text>
				<input v-model="form.code" placeholder="请输入检验编号" />
			</view>
			<view class="row" @click="selectMaterial">
				<text>检验物料</text>
				<text class="value">{{ form.materialName || '请选择' }}</text>
			</view>
			<view class="row" @click="selectInspector">
				<text>检验人</text>
				<text class="value">{{ form.inspector || '请选择' }}</text>
			</view>
			<view class="row">
				<text>检验数量</text>
				<input v-model="form.qty" placeholder="请输入数量" type="number" />
			</view>
			<view class="row">
				<text>合格数量</text>
				<input v-model="form.pass" placeholder="请输入合格数量" type="number" />
			</view>
			<view class="row">
				<text>不合格数量</text>
				<input v-model="form.fail" placeholder="请输入不合格数量" type="number" />
			</view>
		</view>
		<button class="submit" @click="submit">提交</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				code: '',
				materialCode: '',
				materialName: '',
				inspector: '',
				qty: '',
				pass: '',
				fail: ''
			}
		}
	},
	onShow() {
		// read selections from storage (selection pages set these keys)
		const inspector = uni.getStorageSync('incoming_select_inspector')
		if (inspector) {
			this.form.inspector = inspector.name || inspector
			uni.removeStorageSync('incoming_select_inspector')
		}
		const material = uni.getStorageSync('incoming_select_material')
		if (material) {
			this.form.materialName = material.name || material
			this.form.materialCode = material.code || ''
			uni.removeStorageSync('incoming_select_material')
		}
	},
	methods: {
		selectInspector() {
			uni.navigateTo({ url: '/pages/workbench/quality-control/incoming-inspection/inspector-select/index' })
		},
		selectMaterial() {
			uni.navigateTo({ url: '/pages/workbench/quality-control/incoming-inspection/material-select/index' })
		},
		submit() {
			uni.showToast({ title: '提交成功', icon: 'success' })
			// for demo navigate back to list
			uni.navigateBack()
		}
	}
}
</script>

<style>
.page { padding:24rpx; background:#f7f6fb; min-height:100vh; }
.card { background:#fff; padding:18rpx; border-radius:12rpx; box-shadow:0 6rpx 14rpx rgba(0,0,0,0.03); margin-bottom:18rpx; }
.row { display:flex; justify-content:space-between; align-items:center; padding:12rpx 0; border-bottom:1rpx solid #f0f0f0; }
.value { color:#999; }
.submit { position:fixed; left:24rpx; right:24rpx; bottom:36rpx; background:#7b61ff; color:#fff; padding:18rpx; border-radius:28rpx; }
</style>

