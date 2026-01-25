<template>
    <view class="select-page">

        <view class="search-row">
            <input class="search" placeholder="搜索产品编码或名称" v-model="query" @confirm="onSearch" />
            <button class="search-btn" @click="onSearch">搜索</button>
        </view>

        <scroll-view class="list" scroll-y @scrolltolower="loadMore" scroll-with-animation>
            <view class="item" v-for="p in items" :key="p.code" @click="select(p)">
                <radio :value="p.code" :checked="selected && selected.code === p.code"></radio>
                <view class="meta">
                    <text class="code">{{ p.code }}</text>
                    <text class="name">{{ p.name }}</text>
                </view>
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
        const res = await api.getProducts({ page: page.value, pageSize: pageSize.value, query: query.value })
        if (res && res.code === 0) {
            total.value = res.data.total
            items.value = reset ? res.data.items : items.value.concat(res.data.items)
            page.value++
        }
    } catch (e) {
        console.error('getProducts error', e)
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

function select(p) { selected.value = p }

function confirm() {
    if (!selected.value) return uni.showToast({ title: '请选择产品', icon: 'none' })
    uni.setStorageSync('sales_order_selected_product', selected.value)
    uni.navigateBack()
}
function goBack() { uni.navigateBack() }

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

.item {
    background: #fff;
    padding: 14rpx;
    margin-bottom: 12rpx;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    gap: 12rpx;
}

.meta {
    display: flex;
    flex-direction: column;
}

.code {
    font-size: 20rpx;
    color: #333;
    font-weight: 600;
}

.name {
    font-size: 18rpx;
    color: #777;
    margin-top: 6rpx;
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

.loading,
.empty {
    text-align: center;
    color: #999;
    padding: 12rpx;
}
</style>
