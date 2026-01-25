<template>
    <view class="sales-page">
        <view class="header">
            <view class="nav-left" @click="back">
                <text class="back-icon">‹</text>
            </view>
            <text class="title">销售订单</text>
            <view class="action" @click="onAdd">新增</view>
        </view>

        <scroll-view class="list" scroll-y>
            <view class="card" v-for="item in orders" :key="item.id" @click="openDetail(item)">
                <view class="card-top">
                    <view class="tag">{{ item.type }}</view>
                    <text class="code">{{ item.code }}</text>
                </view>
                <view class="card-body">
                    <view class="row"><text class="label">产品名称</text><text class="value">{{ item.productName }}</text>
                    </view>
                    <view class="row"><text class="label">产品总数</text><text class="value">{{ item.totalQuantity }}</text>
                    </view>
                    <view class="row"><text class="label">交货日期</text><text class="value">{{ item.deliveryDate }}</text>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const orders = ref([])
const page = ref(1)
const pageSize = ref(10)

async function loadOrders() {
    try {
        const res = await api.getSalesOrders({ page: page.value, pageSize: pageSize.value })
        if (res && res.code === 0 && res.data) {
            orders.value = res.data.items
        }
    } catch (e) {
        console.error('loadOrders error', e)
    }
}

function openDetail(item) {
    const url = `/pages/workbench/plan-management/sales-order/detail?code=${encodeURIComponent(item.code)}`
    uni.navigateTo({ url })
}

function onAdd() {
    uni.navigateTo({ url: '/pages/workbench/plan-management/sales-order/add' })
}

function back() {
    uni.navigateBack()
}

onMounted(() => {
    loadOrders()
})
</script>

<style scoped>
.sales-page {
    padding: 20rpx;
    background: #f7f6fb;
    min-height: 100vh;
    padding-bottom: 160rpx;
}

.header {
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10rpx;
}

.title {
    font-size: 28rpx;
    font-weight: 700;
}

.action {
    color: #5b4bff;
    font-size: 22rpx;
}

.list {
    height: calc(100vh - 120rpx);
}

.card {
    background: #fff;
    border-radius: 12rpx;
    padding: 16rpx;
    margin-bottom: 14rpx;
    box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
}

.card-top {
    display: flex;
    align-items: center;
    gap: 12rpx;
}

.tag {
    background: #f0f6ff;
    color: #5672ff;
    padding: 6rpx 10rpx;
    border-radius: 8rpx;
    font-size: 20rpx;
}

.code {
    font-weight: 700;
    font-size: 24rpx;
}

.card-body {
    margin-top: 12rpx;
}

.row {
    display: flex;
    gap: 12rpx;
    align-items: center;
    margin-top: 6rpx;
}

.label {
    color: #9b9b9b;
    width: 110rpx;
    font-size: 22rpx;
}

.value {
    color: #333;
    font-size: 22rpx;
}
</style>