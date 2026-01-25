<template>
	<view class="page">
		<view class="list">
			<view class="item" v-for="(it, i) in items" :key="i" @click="select(it)">{{ it }}</view>
		</view>
	</view>
</template>

<script>
export default {
	data() { return { items: ['客户A','客户B','客户C'] } },
	methods: {
		select(item) {
			uni.setStorageSync('manufacturerSelect', item)
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

