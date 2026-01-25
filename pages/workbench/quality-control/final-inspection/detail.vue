<template>
	<view class="page">
		<view class="card">
			<view class="row"><text class="label">最终检验编号</text><text class="value">{{ data.code }}</text></view>
			<view class="row"><text class="label">检验物料编号</text><text class="value">{{ data.id }}</text></view>
			<view class="row"><text class="label">检验物料名称</text><text class="value">{{ data.material }}</text></view>
			<view class="row"><text class="label">报检工序</text><text class="value">第十二道工序</text></view>
			<view class="row"><text class="label">检验方式</text><text class="value">全检</text></view>
			<view class="row"><text class="label">检验项</text><text class="value">尺寸、外观</text></view>
			<view class="row"><text class="label">检验数量</text><text class="value">{{ data.inspectQty }}</text></view>
			<view class="row"><text class="label">应检数量</text><text class="value">{{ data.inspectQty }}</text></view>
			<view class="row"><text class="label">合格数量</text><text class="value">{{ data.passQty }}</text></view>
			<view class="row"><text class="label">不合格数量</text><text class="value">{{ data.unpassQty }}</text></view>
			<view class="row"><text class="label">检验人</text><text class="value">{{ data.inspector }}</text></view>
			<view class="row"><text class="label">检验时间</text><text class="value">{{ data.inspectTime }}</text></view>
		</view>

		<view class="note">
			<text class="note-title">备注</text>
			<view class="note-body">{{ data.remark || '—' }}</view>
		</view>
	</view>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const data = reactive({})

onLoad((options) => {
	if (options && options.data) {
		try {
			const parsed = JSON.parse(decodeURIComponent(options.data))
			Object.assign(data, parsed)
		} catch (e) {
			console.warn('failed parse data', e)
		}
	}
})
</script>

<style>
.page { padding: 20rpx; background:#f7f6fb; min-height:100vh; }
.card { background:#fff; border-radius:12rpx; padding:18rpx; box-shadow:0 6rpx 16rpx rgba(0,0,0,0.03); }
.row { display:flex; justify-content:space-between; padding:12rpx 0; border-bottom:1rpx solid #f3f3f3; color:#333; font-size:24rpx; }
.label { color:#999; }
.value { color:#333; }
.note { margin-top:18rpx; }
.note-title { color:#666; font-size:26rpx; margin-bottom:8rpx; }
.note-body { background:#fff; padding:16rpx; border-radius:12rpx; box-shadow:0 6rpx 12rpx rgba(0,0,0,0.03); color:#333; }
</style>

