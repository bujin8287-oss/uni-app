<template>
	<view class="page-wrap">
		<view v-if="isShortcutPage" class="select-page">
			<view class="header">
				<text class="title">选择快捷方式</text>
			</view>
			<view class="grid">
				<view class="grid-item" v-for="item in available" :key="item.name" @click="toggle(item)">
					<view class="icon-box">{{ item.icon }}</view>
					<text class="name">{{ item.name }}</text>
					<view class="check" v-if="selectedSet.has(item.name)">✔</view>
				</view>
			</view>
			<view class="actions">
				<button class="btn" @click="save">保存并返回</button>
				<button class="btn secondary" @click="restoreDefaults">恢复默认</button>
				<button class="btn secondary" @click="cancel">取消</button>
			</view>
		</view>

		<view v-else class="feature-page">
			<view class="header">
				<text class="title">{{ name }}</text>
			</view>
			<view class="body">
				<text>这是“{{ name }}”的占位页面，你可以在这里实现具体功能。</text>
				<button @click="goBack" class="btn">返回</button>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const STORAGE_KEY = 'home_shortcuts'

const name = ref('功能页面')
const isShortcutPage = ref(false)

const available = reactive([
	// 计划管理
	{ name: '销售订单', icon: '🧾' },
	{ name: '生产计划', icon: '⚙️' },
	// 生产管理
	{ name: '生产工单', icon: '📋' },
	{ name: '生产报工', icon: '📝' },
	{ name: '报工记录', icon: '📄' },
	{ name: '生产达成', icon: '🎯' },
	{ name: '生产准时', icon: '⏱️' },
	// 质量管理
	{ name: '来料检验', icon: '🔬' },
	{ name: '过程检验', icon: '📦' },
	{ name: '最终检验', icon: '✅' },
	{ name: '追溯管理', icon: '🔁' },
	// 设备管理
	{ name: '设备档案', icon: '📇' },
	{ name: '设备报废', icon: '🗑️' },
	{ name: '设备维修', icon: '🛠️' },
	// 仓库管理
	{ name: '采购入库', icon: '📥' },
	{ name: '生产领料', icon: '📦' },
	{ name: '生产退料', icon: '↩️' },
	{ name: '产品出库', icon: '📤' },
	// 其他
	{ name: '领用归还', icon: '📥' },
])

const selectedSet = ref(new Set())

onLoad((options) => {
	// options 在 uni.navigateTo 的 url query 中传递
	const raw = options?.name || options?.query?.name
	if (raw) {
		try {
			const normalized = String(raw).replace(/\+/g, ' ')
			name.value = decodeURIComponent(normalized) || normalized
		} catch (e) {
			name.value = String(raw)
		}
	} else {
		name.value = '功能页面'
	}

	if (name.value === '更多') {
		isShortcutPage.value = true
		// load current selections
		try {
			const rawStore = uni.getStorageSync(STORAGE_KEY)
			if (rawStore) {
				const arr = typeof rawStore === 'string' ? JSON.parse(rawStore) : rawStore
				selectedSet.value = new Set(Array.isArray(arr) ? arr : [])
			}
		} catch (e) {
			console.warn('load shortcuts error', e)
		}
	}
})

function toggle(item) {
	if (!item || !item.name) return
	if (selectedSet.value.has(item.name)) {
		selectedSet.value.delete(item.name)
	} else {
		selectedSet.value.add(item.name)
	}
	selectedSet.value = new Set([...selectedSet.value])
}

function save() {
	try {
		const arr = [...selectedSet.value]
		uni.setStorageSync(STORAGE_KEY, JSON.stringify(arr))
		uni.navigateBack()
	} catch (e) {
		console.error('save shortcuts error', e)
	}
}

function cancel() {
	uni.navigateBack()
}

function goBack() {
	uni.navigateBack()
}
 
function restoreDefaults() {
	try {
		// default: select all available items
		const defaults = available.map(i => i.name)
		selectedSet.value = new Set(defaults)
		uni.setStorageSync(STORAGE_KEY, JSON.stringify(defaults))
		uni.showToast({ title: '已恢复默认', icon: 'none' })
		// return to home so it refreshes
		uni.navigateBack()
	} catch (e) {
		console.error('restore defaults error', e)
	}
}
</script>

<style>
.feature-page {
	padding: 30rpx;
	background: #fff;
	min-height: 100vh;
}

.header .title {
	font-size: 34rpx;
	font-weight: 700;
	margin-bottom: 20rpx;
}

.body {
	font-size: 26rpx;
	color: #666;
}

.btn {
	margin-top: 30rpx;
	padding: 14rpx 20rpx;
	background: #5b4bff;
	color: #fff;
	border-radius: 10rpx;
}

.select-page {
	padding: 24rpx;
	background: #f7f6fb;
	min-height: 100vh;
}

.grid {
	background: #fff;
	padding: 18rpx;
	border-radius: 12rpx;
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.grid-item {
	width: calc((100% - 64rpx) / 4);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 12rpx;
	position: relative;
}

.icon-box {
	width: 82rpx;
	height: 82rpx;
	border-radius: 14rpx;
	background: linear-gradient(180deg, #f5f6ff, #fff);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	margin-bottom: 8rpx;
}

.name {
	font-size: 22rpx;
	color: #333;
	text-align: center;
}

.check {
	position: absolute;
	right: 10rpx;
	top: 8rpx;
	background: #5b4bff;
	color: #fff;
	width: 28rpx;
	height: 28rpx;
	border-radius: 6rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 18rpx;
}

.actions {
	margin-top: 20rpx;
	display: flex;
	gap: 12rpx;
}

.btn.secondary {
	background: #f1f1f6;
	color: #333;
}
</style>
