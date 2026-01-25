<template>
    <view class="add-page">

        <scroll-view class="form" scroll-y>
            <view class="section card">
                <text class="section-title">订单信息</text>
                <view class="field">
                    <text class="label">销售单号</text>
                    <input class="input" placeholder="请输入销售单号" v-model="form.orderNo" />
                </view>
                <view class="field">
                    <text class="label">客户名称</text>
                    <view class="choose" @click="choose('customer')"><text>{{ form.customer || '请选择' }}</text></view>
                </view>
                <view class="field">
                    <text class="label">紧急程度</text>
                    <view class="choose" @click="choose('urgency')"><text>{{ form.urgency || '请选择' }}</text></view>
                </view>
                <view class="field">
                    <text class="label">交货日期</text>
                    <picker mode="date" @change="onDateChange">
                        <view class="choose"><text>{{ form.deliveryDate || '请选择' }}</text></view>
                    </picker>
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
                    <text class="label">订单数量</text>
                    <input class="input" placeholder="请输入数量" type="number" v-model="form.quantity" />
                </view>
                <view class="field">
                    <text class="label">单位</text>
                    <view class="choose" @click="choose('unit')"><text>{{ form.unit || '请选择' }}</text></view>
                </view>
            </view>

            <view class="section card">
                <text class="section-title">附件信息</text>
                <view class="attach">
                    <text class="desc">单个附件最大支持20M，支持格式：PDF、Word、Excel、Txt、JPG、PNG、RAR、ZIP</text>
                    <button class="add-btn" @click="chooseFile">+</button>
                </view>
            </view>

            <view class="section card">
                <text class="section-title">备注</text>
                <textarea class="textarea" placeholder="请输入备注" v-model="form.remark"></textarea>
            </view>

            <button class="submit-btn" @click="submit">提交</button>
        </scroll-view>
    </view>
</template>

<script setup>
import { reactive } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const form = reactive({
    orderNo: '',
    customer: '',
    urgency: '',
    deliveryDate: '',
    productCode: '',
    productName: '',
    quantity: '',
    unit: '',
    remark: '',
})

function goBack() {
    uni.navigateBack()
}

function choose(type) {
    // 打开选择页面，选择后通过 storage 回传并在 onShow 中读取
    const routes = {
        customer: '/pages/workbench/plan-management/sales-order/customer-select',
        urgency: '/pages/workbench/plan-management/sales-order/urgency-select',
        product: '/pages/workbench/plan-management/sales-order/product-select',
        unit: '/pages/workbench/plan-management/sales-order/unit-select',
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

function chooseFile() {
    uni.chooseMessageFile({
        count: 1,
        type: 'file',
        success(res) {
            uni.showToast({ title: '已选择文件（模拟）', icon: 'none' })
        },
        fail() {
            uni.showToast({ title: '选择失败', icon: 'none' })
        },
    })
}

function submit() {
    if (!form.orderNo || !form.productName || !form.quantity) {
        uni.showToast({ title: '请填写必填项', icon: 'none' })
        return
    }
    // 模拟提交
    uni.showLoading({ title: '提交中...' })
    setTimeout(() => {
        uni.hideLoading()
        uni.showToast({ title: '提交成功', icon: 'none' })
        uni.navigateBack()
    }, 800)
}
// 读取回传值（如果存在），读取后清除 storage
onShow(() => {
    const customer = uni.getStorageSync('sales_order_selected_customer')
    if (customer) {
        form.customer = customer.name || customer
        uni.removeStorageSync('sales_order_selected_customer')
    }
    const urgency = uni.getStorageSync('sales_order_selected_urgency')
    if (urgency) {
        form.urgency = urgency
        uni.removeStorageSync('sales_order_selected_urgency')
    }
    const product = uni.getStorageSync('sales_order_selected_product')
    if (product) {
        form.productCode = product.code || product.productCode || ''
        form.productName = product.name || product.productName || form.productName
        uni.removeStorageSync('sales_order_selected_product')
    }
    const unit = uni.getStorageSync('sales_order_selected_unit')
    if (unit) {
        form.unit = unit
        uni.removeStorageSync('sales_order_selected_unit')
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

.attach {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12rpx;
}

.desc {
    color: #9b9b9b;
    font-size: 20rpx;
    flex: 1;
}

.add-btn {
    background: #6a5bff;
    color: #fff;
    padding: 12rpx 18rpx;
    border-radius: 8rpx;
    font-size: 28rpx;
}

.textarea {
    width: 100%;
    min-height: 120rpx;
    border-radius: 8rpx;
    padding: 12rpx;
    background: #fff;
    border: none;
    font-size: 22rpx;
    box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
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
