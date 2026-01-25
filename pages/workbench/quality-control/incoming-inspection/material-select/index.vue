<template>
	<view class="page">
		<view class="list card">
			<block v-for="m in materials" :key="m.code">
				<view class="row" @click="select(m)"><text>{{ m.code }}</text><text>{{ m.name }}</text></view>
			</block>
		</view>
		<button class="confirm" @click="confirm">确定</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			materials: [
				{ code: 'CPHB00001', name: 'PCB 电路板' },
				{ code: 'CPHB00002', name: '贴片电阻' },
				{ code: 'WLBH00001', name: '内存条' }
			],
			selected: null
		}
	},
	methods: {
		select(m) {
			this.selected = m
		},
		confirm() {
			if (this.selected) {
				uni.setStorageSync('incoming_select_material', this.selected)
				uni.navigateBack()
			} else {
				uni.showToast({ title: '请选择物料', icon: 'none' })
			}
		}
	}
}
</script>

<style>
.page { padding:24rpx; background:#f7f6fb; min-height:100vh; }
.card { background:#fff; padding:8rpx; border-radius:12rpx; box-shadow:0 6rpx 14rpx rgba(0,0,0,0.03); }
.row { display:flex; justify-content:space-between; padding:18rpx; border-bottom:1rpx solid #f0f0f0; }
.confirm { position:fixed; left:24rpx; right:24rpx; bottom:36rpx; background:#7b61ff; color:#fff; padding:18rpx; border-radius:28rpx; }
</style>

