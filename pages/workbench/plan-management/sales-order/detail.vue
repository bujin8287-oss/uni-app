<template>
	<view class="detail-page">

		<view class="card">
			<view class="row"><text class="label">销售单号</text><text class="value">{{ detail.code }}</text></view>
			<view class="row"><text class="label">客户名称</text><text class="value">{{ detail.customerName }}</text></view>
			<view class="row"><text class="label">紧急程度</text><text class="value">{{ detail.urgency }}</text></view>
			<view class="row"><text class="label">交货日期</text><text class="value">{{ detail.deliveryDate }}</text></view>
			<view class="row"><text class="label">产品编号</text><text class="value">{{ detail.productCode }}</text></view>
			<view class="row"><text class="label">产品名称</text><text class="value">{{ detail.productName }}</text></view>
			<view class="row"><text class="label">订单数量</text><text class="value">{{ detail.quantity }}</text></view>
			<view class="row"><text class="label">单位</text><text class="value">{{ detail.unit }}</text></view>
		</view>

		<view class="card small">
			<text class="section-title">附件信息</text>
			<view v-if="detail.attachments && detail.attachments.length" class="attach-list">
				<view class="attach-item" v-for="(a, i) in detail.attachments" :key="i" @click="openAttachment(a)">
					<text class="attach-name">{{ a.name }}</text>
					<text class="attach-go">›</text>
				</view>
			</view>
			<view v-else class="empty">无附件</view>
		</view>

		<view class="card">
			<text class="section-title">备注</text>
			<text class="remark">{{ detail.remark }}</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onLoad } from 'vue'
import api from '@/api'
import { onLoad as uniOnLoad } from '@dcloudio/uni-app'

const detail = ref({})

function goBack() {
	uni.navigateBack()
}

uniOnLoad(async (options) => {
	const code = decodeURIComponent(options?.code || options?.query?.code || '')
	if (!code) return
	try {
		const res = await api.getSalesOrderDetail({ code })
		if (res && res.code === 0) {
			detail.value = res.data
		}
	} catch (e) {
		console.error('getSalesOrderDetail error', e)
	}
})

function openAttachments() {
	if (detail.value?.attachments?.length) {
		uni.showToast({ title: `共有 ${detail.value.attachments.length} 个附件，点击附件可预览`, icon: 'none' })
	} else {
		uni.showToast({ title: '无附件', icon: 'none' })
	}
}

function openAttachment(att) {
	const url = att && att.url ? String(att.url) : ''
	if (!url) {
		uni.showToast({ title: '无可用附件路径', icon: 'none' })
		return
	}
	const ext = (url.split('.').pop() || '').toLowerCase()
	const imgExt = ['png', 'jpg', 'jpeg', 'gif', 'webp']
	if (imgExt.includes(ext)) {
		// 预览图片
		let previewUrl = url
		if (previewUrl.startsWith('/')) {
			previewUrl = previewUrl
		}
		uni.previewImage({ urls: [previewUrl] })
		return
	}
	// 非图片：尝试下载并打开（若为相对路径则提示模拟）
	if (url.startsWith('/')) {
		uni.showToast({ title: '暂不支持预览此类型本地附件（模拟）', icon: 'none' })
		return
	}
	uni.showLoading({ title: '打开中...' })
	uni.downloadFile({
		url,
		success(res) {
			if (res.statusCode === 200 && res.tempFilePath) {
				uni.openDocument({
					filePath: res.tempFilePath,
					success() {},
					fail() {
						uni.showToast({ title: '打开失败', icon: 'none' })
					},
				})
			} else {
				uni.showToast({ title: '下载失败', icon: 'none' })
			}
		},
		fail() {
			uni.showToast({ title: '下载失败', icon: 'none' })
		},
		complete() {
			uni.hideLoading()
		},
	})
}
</script>

<style scoped>
.detail-page {
	padding: 20rpx;
	background: #f7f6fb;
	min-height: 100vh;
	padding-bottom: 120rpx;
}

.card {
	background: #fff;
	border-radius: 12rpx;
	padding: 16rpx;
	margin-bottom: 14rpx;
	box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
}

.row {
	display: flex;
	justify-content: space-between;
	padding: 12rpx 0;
	border-bottom: 1rpx solid #f1f1f6;
	align-items: center;
}

.label {
	color: #9b9b9b;
	font-size: 22rpx;
}

.value {
	color: #333;
	font-size: 22rpx;
}

.small {
	padding: 12rpx;
}

.link {
	color: #5b4bff;
}

.section-title {
	font-size: 20rpx;
	font-weight: 700;
	margin-bottom: 8rpx;
}

.remark {
	color: #333;
	font-size: 20rpx;
}
</style>
