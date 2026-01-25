<template>
	<view class="page">
		<view class="list card">
			<block v-for="(p, idx) in persons" :key="p.id">
				<view class="row" @click="select(p)"><text>{{ p.name }}</text></view>
			</block>
		</view>
		<button class="confirm" @click="confirm">确定</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			persons: [
				{ id: 1, name: '李伟' }, { id: 2, name: '陈曦' }, { id: 3, name: '王梓涵' },
				{ id: 4, name: '赵雨桐' }, { id: 5, name: '刘畅' }, { id: 6, name: '张梦琪' }
			],
			selected: null
		}
	},
	methods: {
		select(p) {
			this.selected = p
		},
		confirm() {
			if (this.selected) {
				uni.setStorageSync('incoming_select_inspector', this.selected)
				uni.navigateBack()
			} else {
				uni.showToast({ title: '请选择检验人', icon: 'none' })
			}
		}
	}
}
</script>

<style>
.page { padding:24rpx; background:#f7f6fb; min-height:100vh; }
.card { background:#fff; padding:8rpx; border-radius:12rpx; box-shadow:0 6rpx 14rpx rgba(0,0,0,0.03); }
.row { padding:18rpx; border-bottom:1rpx solid #f0f0f0; }
.confirm { position:fixed; left:24rpx; right:24rpx; bottom:36rpx; background:#7b61ff; color:#fff; padding:18rpx; border-radius:28rpx; }
</style>

