<template>
    <view class="sales-page">
        <!-- 自定义导航栏 -->
        <CustomNavBar 
            title="销售订单" 
            :show-back="true"
            :show-add="true"
            add-text="新增"
            @add="onAdd"
        />

        <!-- 销售订单列表 -->
        <scroll-view class="list" scroll-y :style="listStyle">
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
import { ref, computed, onMounted } from 'vue'
import api from '@/api'
import CustomNavBar from '@/components/general/CustomNavBar.vue'

const orders = ref([])
const page = ref(1)
const pageSize = ref(10)

// 列表区域样式（避开导航栏）
const listStyle = computed(() => {
    return {
        height: `calc(100vh - ${132}px)`,
        marginTop: '80px'
    }
})

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

onMounted(() => {
    loadOrders()
})
</script>

<style>
.sales-page {
    padding: 20rpx;
    background: #f7f6fb;
    min-height: 100vh;
    padding-bottom: 160rpx;
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

