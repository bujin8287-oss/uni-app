<template>
	<view class="select-page">

		<view class="search-row">
			<input class="search" placeholder="搜索客户" v-model="query" @confirm="onSearch" />
			<button class="search-btn" @click="onSearch">搜索</button>
		</view>

		<scroll-view class="list" scroll-y @scrolltolower="loadMore" scroll-with-animation>
			<view class="item" v-for="(c, idx) in items" :key="c.id" @click="select(c)">
				<radio :value="c.name" :checked="selected && selected.id === c.id"></radio>
				<text class="name">{{ c.name }}</text>
			</view>
			<view v-if="loading" class="loading">加载中...</view>
			<view v-if="!loading && items.length === 0" class="empty">暂无数据</view>
		</scroll-view>

		<button class="confirm" @click="confirm">确定</button>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const items = ref([])
const selected = ref(null)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const query = ref('')
const loading = ref(false)

async function load(reset = false) {
	if (reset) {
		page.value = 1
		items.value = []
		total.value = 0
	}
	if (loading.value) return
	loading.value = true
	try {
		const res = await api.getCustomers({ page: page.value, pageSize: pageSize.value, query: query.value })
		if (res && res.code === 0) {
			total.value = res.data.total
			items.value = reset ? res.data.items : items.value.concat(res.data.items)
			page.value++
		}
	} catch (e) {
		console.error('getCustomers error', e)
	} finally {
		loading.value = false
	}
}

function loadMore() {
	if (items.value.length >= total.value) return
	load(false)
}

function onSearch() {
	load(true)
}

function select(c) {
	selected.value = c
}

function confirm() {
	if (!selected.value) {
		uni.showToast({ title: '请选择客户', icon: 'none' })
		return
	}
	uni.setStorageSync('product_plan_selected_customer', selected.value)
	uni.navigateBack()
}

onMounted(() => {
	load(true)
})
</script>

<style scoped>
.select-page {
	padding: 20rpx;
	background: #f7f6fb;
	min-height: 100vh;
	padding-bottom: 140rpx;
}
.search-row {
	display: flex;
	align-items: center;
	gap: 8rpx;
	margin-bottom: 12rpx;
}
.search {
	flex: 1;
	background: #fff;
	padding: 10rpx;
	border-radius: 8rpx;
}
.search-btn {
	padding: 10rpx 12rpx;
	background: #6a5bff;
	color: #fff;
	border-radius: 8rpx;
}
.list {
	margin-top: 10rpx;
	min-height: 200rpx;
}
.item {
	background: #fff;
	padding: 18rpx;
	border-radius: 12rpx;
	margin-bottom: 12rpx;
	display: flex;
	align-items: center;
	gap: 12rpx;
}
.name {
	font-size: 22rpx;
}
.loading,
.empty {
	text-align: center;
	color: #999;
	padding: 12rpx;
}
.confirm {
	position: fixed;
	left: 20rpx;
	right: 20rpx;
	bottom: 24rpx;
	background: linear-gradient(180deg, #6a5bff, #8b6cff);
	color: #fff;
	padding: 14rpx;
	border-radius: 28rpx;
	font-size: 22rpx;
}
</style>

