<template>
	<view class="my-page">
		<!-- Header / user card -->
		<view class="user-card">
			<view class="user-left">
				<text class="user-name">{{ user.name }}</text>
				<text class="user-company">{{ user.company }}</text>
				<view class="role-badge">车间负责人</view>
			</view>
			<image class="avatar" src="/static/logo.png" mode="aspectFill" />
		</view>

		<!-- Stats -->
		<view class="stats">
			<view class="stat-card">
				<text class="stat-label">我的设备</text>
				<text class="stat-num">{{ stats.devices }}</text>
			</view>
			<view class="stat-card">
				<text class="stat-label">备品备件</text>
				<text class="stat-num">{{ stats.parts }}</text>
			</view>
		</view>

		<!-- Today tasks -->
		<view class="tasks">
			<text class="section-title">今日任务</text>
			<view class="task-list">
				<view class="task-card" v-for="(t, idx) in tasks" :key="idx">
					<view class="radial">
						<view class="radial-inner">{{ t.completed }}/{{ t.total }}</view>
					</view>
					<text class="task-title">{{ t.title }}</text>
					<text class="task-sub">完成率：{{ t.rate }}</text>
					<button class="task-btn" :class="{ disabled: t.completed >= t.total }" @click="goTask(t)">{{
						t.completed >= t.total ? '已完成' : '去完成' }}</button>
				</view>
			</view>
		</view>

		<!-- Menu -->
		<view class="menu">
			<view class="menu-item" v-for="(m, i) in menu" :key="i" @click="openMenu(m)">
				<view class="menu-left">
					<text class="menu-icon">{{ m.icon }}</text>
					<text class="menu-text">{{ m.title }}</text>
				</view>
				<text class="menu-right">›</text>
			</view>
		</view>

		<!-- Logout -->
		<view class="logout-wrap">
			<button class="logout-btn" @click="logout">退出登录</button>
		</view>
		<BottomNav />
	</view>
</template>

<script setup>
import { reactive } from 'vue'
import BottomNav from '@/components/business/BottomNav.vue'

const user = reactive({
	name: '刘明湘',
	company: '华某产业股份有限公司'
})

const stats = reactive({
	devices: 158,
	parts: 5846
})

const tasks = reactive([
	{ title: '工单任务', completed: 1, total: 5, rate: '20%' },
	{ title: '待办任务', completed: 2, total: 4, rate: '50%' },
	{ title: '异常管理', completed: 3, total: 3, rate: '100%' },
])

const menu = reactive([
	{ title: '个人资料', icon: '👤', path: '/pages/feature/index?name=个人资料' },
	{ title: '密码修改', icon: '🔒', path: '/pages/feature/index?name=密码修改' },
	{ title: '关于我们', icon: '📖', path: '/pages/feature/index?name=关于我们' },
])

function goTask(t) {
	if (t.completed >= t.total) return
	uni.navigateTo({ url: `/pages/feature/index?name=${encodeURIComponent(t.title)}` })
}

function openMenu(m) {
	uni.navigateTo({ url: m.path })
}

function logout() {
	uni.showModal({
		title: '提示', content: '确定退出登录？', success(res) {
			if (res.confirm) {
				uni.reLaunch({ url: '/pages/index/index' })
			}
		}
	})
}
</script>

<style>
.my-page {
	padding: 24rpx;
	background: linear-gradient(180deg, #f3eefc, #efeefe);
	min-height: 100vh;
	padding-bottom: 160rpx;
}

.user-card {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 18rpx;
}

.user-left {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.user-name {
	font-size: 30rpx;
	font-weight: 700;
	color: #2b2b2b;
}

.user-company {
	font-size: 22rpx;
	color: #6d6d80;
}

.role-badge {
	display: inline-block;
	background: #efe6ff;
	color: #6a5bff;
	padding: 6rpx 12rpx;
	border-radius: 20rpx;
	font-size: 20rpx;
	margin-top: 8rpx;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
}

.stats {
	display: flex;
	gap: 20rpx;
	margin-top: 12rpx;
}

.stat-card {
	flex: 1;
	background: #fff;
	padding: 18rpx;
	border-radius: 12rpx;
	box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.04);
}

.stat-label {
	font-size: 22rpx;
	color: #6d6d80;
}

.stat-num {
	font-size: 34rpx;
	font-weight: 700;
	color: #1f2b7a;
	margin-top: 8rpx;
}

.tasks {
	margin-top: 18rpx;
}

.section-title {
	font-size: 26rpx;
	font-weight: 700;
	margin-bottom: 12rpx;
	color: #2b2b2b;
}

.task-list {
	display: flex;
	gap: 16rpx;
}

.task-card {
	background: #fff;
	padding: 16rpx;
	border-radius: 12rpx;
	width: calc((100% - 32rpx)/3);
	text-align: center;
	box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
}

.radial {
	width: 72rpx;
	height: 72rpx;
	border-radius: 36rpx;
	border: 6rpx solid #efeefe;
	margin: 0 auto 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 700;
	color: #5b4bff;
}

.radial-inner {
	font-size: 22rpx;
}

.task-title {
	font-size: 22rpx;
	margin-top: 6rpx;
}

.task-sub {
	font-size: 20rpx;
	color: #9b9b9b;
	margin-top: 6rpx;
}

.task-btn {
	margin-top: 10rpx;
	padding: 8rpx 12rpx;
	border-radius: 8rpx;
	background: #5b4bff;
	color: #fff;
	font-size: 20rpx;
}

.task-btn.disabled {
	background: #e9e9ef;
	color: #999;
}

.menu {
	margin-top: 18rpx;
	background: #fff;
	border-radius: 12rpx;
	overflow: hidden;
	box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.03);
}

.menu-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 18rpx;
	border-bottom: 1rpx solid #f1f1f6;
}

.menu-left {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.menu-icon {
	font-size: 26rpx;
}

.menu-text {
	font-size: 22rpx;
	color: #333;
}

.menu-right {
	color: #cfcfe6;
	font-size: 26rpx;
}

.logout-wrap {
	margin-top: 24rpx;
	display: flex;
	justify-content: center;
}

.logout-btn {
	background: transparent;
	color: #999;
	font-size: 22rpx;
	padding: 12rpx 20rpx;
}
</style>
