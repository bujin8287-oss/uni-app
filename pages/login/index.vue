<template>
    <view class="login-page">
        <view class="login-header">
            <text class="title">登录</text>
        </view>

        <view class="hero">
            <image src="/static/logo.png" class="hero-icon" mode="aspectFill" />
            <text class="app-name">生产制造执行平台</text>
            <text class="app-sub">Manufacturing Execution Platform</text>
        </view>

        <view class="form">
            <view class="input-row">
                <text class="input-icon">👤</text>
                <input class="input" type="text" placeholder="请输入用户名/手机号" v-model="phoneOrUser" />
            </view>
            <view class="input-row">
                <text class="input-icon">🔒</text>
                <input class="input" type="password" placeholder="请输入密码" v-model="password" />
            </view>

            <button class="login-btn" :disabled="loading" @click="loginPassword">{{ loading ? '登录中...' : '登录'
                }}</button>

            <view class="or-row">
                <view class="line"></view>
                <text class="or-text">或</text>
                <view class="line"></view>
            </view>

            <button class="phone-btn" :disabled="loading" @click="loginPhone">{{ loading ? '登录中...' : '手机号一键登录'
                }}</button>
        </view>

        <image src="/static/images/login-bg.jpg" class="bg" mode="widthFix" />
    </view>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api'

const phoneOrUser = ref('')
const password = ref('')
const loading = ref(false)

async function loginPassword() {
    loading.value = true
    try {
        const res = await api.loginWithPassword({ username: phoneOrUser.value, password: password.value })
        if (res && res.code === 0) {
            uni.showToast({ title: '登录成功', icon: 'none' })
            // 存储 token（示例）
            uni.setStorageSync('token', res.data.token)
            uni.reLaunch({ url: '/pages/index/index' })
        } else {
            uni.showToast({ title: res.message || '登录失败', icon: 'none' })
        }
    } catch (e) {
        uni.showToast({ title: '网络错误', icon: 'none' })
    } finally {
        loading.value = false
    }
}

async function loginPhone() {
    if (!phoneOrUser.value) {
        uni.showToast({ title: '请输入手机号', icon: 'none' })
        return
    }
    loading.value = true
    try {
        const res = await api.loginWithPhone({ phone: phoneOrUser.value })
        if (res && res.code === 0) {
            uni.showToast({ title: '登录成功', icon: 'none' })
            uni.setStorageSync('token', res.data.token)
            uni.reLaunch({ url: '/pages/index/index' })
        } else {
            uni.showToast({ title: res.message || '登录失败', icon: 'none' })
        }
    } catch (e) {
        uni.showToast({ title: '网络错误', icon: 'none' })
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.login-page {
    min-height: 100vh;
    background: linear-gradient(180deg, #f7f4ff, #f0eefb);
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.login-header {
    padding-top: 24rpx;
}

.title {
    font-size: 28rpx;
    font-weight: 700;
    color: #333;
}

.hero {
    margin-top: 20rpx;
    align-items: center;
}

.hero-icon {
    width: 120rpx;
    height: 120rpx;
    border-radius: 60rpx;
}

.app-name {
    color: #6b5bff;
    font-size: 26rpx;
    margin-top: 12rpx;
}

.app-sub {
    color: #bdbbdc;
    font-size: 18rpx;
    margin-top: 6rpx;
}

.form {
    width: 86%;
    margin-top: 22rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14rpx;
}

.input-row {
    width: 100%;
    background: #fff;
    border-radius: 12rpx;
    padding: 12rpx;
    display: flex;
    align-items: center;
    gap: 10rpx;
    box-shadow: 0 8rpx 20rpx rgba(107, 84, 255, 0.06);
}

.input-icon {
    font-size: 22rpx;
    color: #bdbbdc;
    width: 28rpx;
    text-align: center;
}

.input {
    flex: 1;
    font-size: 24rpx;
    border: none;
    outline: none;
    background: transparent;
    height: 36rpx;
}

.login-btn {
    width: 100%;
    background: linear-gradient(180deg, #6a5bff, #8b6cff);
    color: #fff;
    padding: 14rpx;
    border-radius: 28rpx;
    font-size: 22rpx;
    margin-top: 6rpx;
}

.phone-btn {
    width: 100%;
    background: #fff;
    color: #6a5bff;
    padding: 12rpx;
    border-radius: 28rpx;
    font-size: 20rpx;
    border: 1rpx solid rgba(107, 84, 255, 0.12);
}

.or-row {
    display: flex;
    align-items: center;
    gap: 10rpx;
    width: 100%;
}

.or-row .line {
    flex: 1;
    height: 1rpx;
    background: #f1f1f6;
}

.or-text {
    padding: 0 8rpx;
    color: #9b9b9b;
}

.bg {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 180rpx;
    opacity: 0.9;
}
</style>
