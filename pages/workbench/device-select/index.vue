<template>
	<view class="page">
		<view class="list">
			<view class="item" v-for="(it, i) in items" :key="i" @click="select(it)">{{ it }}</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			items: ['设备A', '设备B', '设备C']
		}
	},
	methods: {
		select(item) {
			// 简单选择后返回：真实项目可以通过 eventChannel 或者设置全局状态传值
			uni.setStorageSync('deviceSelect', item)
			uni.navigateBack()
		}
	}
}
</script>

<style>
.page { padding:24rpx; background:#fff; min-height:100vh; }
.list { display:flex; flex-direction:column; gap:12rpx; }
.item { padding:18rpx; background:#f5f5f5; border-radius:8rpx; }
</style>

