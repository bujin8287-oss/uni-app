<template>
    <view class="add-page">

        <scroll-view class="form" scroll-y>
            <view class="section card">
                <text class="section-title">生产信息</text>
                <view class="field">
                    <text class="label">计划编号</text>
                    <input class="input" placeholder="请输入计划编号" v-model="form.planNo" />
                </view>
                <view class="field">
                    <text class="label">客户名称</text>
                    <view class="choose" @click="choose('customer')"><text>{{ form.customer || '请选择' }}</text></view>
                </view>
                <view class="field">
                    <text class="label">产品编号</text>
                    <view class="choose" @click="choose('product')"><text>{{ form.productCode || '请选择' }}</text></view>
                </view>
                <view class="field">
                    <text class="label">产品名称</text>
                    <input class="input" placeholder="请输入产品名称" v-model="form.productName" />
                </view>
                <view class="field">
                    <text class="label">交货日期</text>
                    <picker mode="date" @change="onDateChange">
                        <view class="choose"><text>{{ form.deliveryDate || '请选择' }}</text></view>
                    </picker>
                </view>
                <view class="field">
                    <text class="label">生产数量</text>
                    <input class="input" placeholder="请输入数量" type="number" v-model="form.quantity" />
                </view>
                <view class="field">
                    <text class="label">单位</text>
                    <view class="choose" @click="choose('unit')"><text>{{ form.unit || '请选择' }}</text></view>
                </view>
                <view class="field">
                    <text class="label">紧急程度</text>
                    <view class="choose" @click="choose('urgency')"><text>{{ form.urgency || '请选择' }}</text></view>
                </view>
            </view>

            <button class="submit-btn" @click="submit">提交</button>
        </scroll-view>
    </view>
</template>

<script setup>
import { reactive } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const form = reactive({
    planNo: '',
    customer: '',
    productCode: '',
    productName: '',
    deliveryDate: '',
    quantity: '',
    unit: '',
    urgency: '',
})

function choose(type) {
    const routes = {
        customer: '/pages/workbench/plan-management/product-plan/customer-select',
        urgency: '/pages/workbench/plan-management/product-plan/urgency-select',
        product: '/pages/workbench/plan-management/product-plan/product-select',
        unit: '/pages/workbench/plan-management/product-plan/unit-select',
    }
    const url = routes[type]
    if (url) {
        uni.navigateTo({ url })
    } else {
        uni.showToast({ title: `未实现选择 ${type}`, icon: 'none' })
    }
}

function onDateChange(e) {
    form.deliveryDate = e.detail.value
}

function submit() {
    if (!form.planNo || !form.productName || !form.quantity) {
        uni.showToast({ title: '请填写必填项', icon: 'none' })
        return
    }
    uni.showLoading({ title: '提交中...' })
    setTimeout(() => {
        uni.hideLoading()
        uni.showToast({ title: '提交成功', icon: 'none' })
        uni.navigateBack()
    }, 800)
}

onShow(() => {
    const customer = uni.getStorageSync('product_plan_selected_customer')
    if (customer) {
        form.customer = customer.name || customer
        uni.removeStorageSync('product_plan_selected_customer')
    }
    const urgency = uni.getStorageSync('product_plan_selected_urgency')
    if (urgency) {
        form.urgency = urgency
        uni.removeStorageSync('product_plan_selected_urgency')
    }
    const product = uni.getStorageSync('product_plan_selected_product')
    if (product) {
        form.productCode = product.code || product.productCode || ''
        form.productName = product.name || product.productName || form.productName
        uni.removeStorageSync('product_plan_selected_product')
    }
    const unit = uni.getStorageSync('product_plan_selected_unit')
    if (unit) {
        form.unit = unit
        uni.removeStorageSync('product_plan_selected_unit')
    }
})
</script>

<style scoped>
.add-page {
    padding: 20rpx;
    background: #f7f6fb;
    min-height: 100vh;
    padding-bottom: 120rpx;
}
.form {
    margin-top: 10rpx;
}
.card {
    background: #fff;
    border-radius: 12rpx;
    padding: 16rpx;
    margin-bottom: 14rpx;
    box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
}
.section-title {
    font-size: 22rpx;
    font-weight: 700;
    margin-bottom: 10rpx;
}
.field {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12rpx 0;
    border-bottom: 1rpx solid #f1f1f6;
}
.label {
    color: #9b9b9b;
    width: 140rpx;
    font-size: 22rpx;
}
.input {
    flex: 1;
    text-align: right;
    font-size: 22rpx;
    border: none;
    background: transparent;
}
.choose {
    flex: 1;
    text-align: right;
    color: #cfcfe6;
}
.submit-btn {
    width: 90%;
    margin: 18rpx auto;
    background: linear-gradient(180deg, #6a5bff, #8b6cff);
    color: #fff;
    padding: 14rpx;
    border-radius: 28rpx;
    font-size: 22rpx;
    display: block;
    text-align: center;
}
</style>

