<template>
  <view class="custom-nav-wrap" :style="{ backgroundColor: bgColor }">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <!-- 导航栏主体 -->
    <view class="custom-nav" :class="{ 'nav-shadow': showShadow }">
      <!-- 左侧区域 -->
      <view class="nav-left" @click="handleLeftClick">
        <!-- 返回按钮（当可返回时显示） -->
        <view v-if="showBack" class="back-btn">
          <text class="back-icon">{{ backIcon }}</text>
        </view>
        <!-- 左侧自定义插槽 -->
        <slot name="left">
          <text v-if="leftText" class="left-text">{{ leftText }}</text>
        </slot>
      </view>

      <!-- 标题区域 -->
      <view class="nav-title" @click="handleTitleClick">
        <text class="title-text" :style="titleStyle">{{ title }}</text>
        <!-- 标题右侧图标 -->
        <view v-if="titleArrow" class="title-arrow">
          <text>{{ titleArrowIcon }}</text>
        </view>
      </view>

      <!-- 右侧区域 -->
      <view class="nav-right" @click="handleRightClick">
        <!-- 右侧自定义插槽 -->
        <slot name="right">
          <!-- 新增按钮 -->
          <view v-if="showAdd" class="add-btn" @click="handleAddClick">
            <text class="add-text">{{ addText }}</text>
          </view>
          <!-- 更多按钮 -->
          <view v-if="showMore" class="more-btn">
            <text class="more-icon">{{ moreIcon }}</text>
          </view>
        </slot>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

// 获取状态栏高度
const statusBarHeight = ref(44)

// Props 定义
const props = defineProps({
  // 标题
  title: {
    type: String,
    default: ''
  },
  // 标题对齐方式：left/center
  titleAlign: {
    type: String,
    default: 'center'
  },
  // 标题颜色
  titleColor: {
    type: String,
    default: '#1A1A1A'
  },
  // 标题字体大小（rpx）
  titleSize: {
    type: Number,
    default: 34
  },
  // 标题字体粗细：normal/bold
  titleWeight: {
    type: String,
    default: '500'
  },
  // 是否显示返回按钮
  showBack: {
    type: Boolean,
    default: true
  },
  // 返回按钮图标
  backIcon: {
    type: String,
    default: '<'
  },
  // 左侧自定义文本
  leftText: {
    type: String,
    default: ''
  },
  // 是否显示新增按钮
  showAdd: {
    type: Boolean,
    default: false
  },
  // 新增按钮文字
  addText: {
    type: String,
    default: '新增'
  },
  // 新增按钮文字颜色
  addColor: {
    type: String,
    default: '#8A8AFF'
  },
  // 新增按钮文字大小（rpx）
  addSize: {
    type: Number,
    default: 34
  },
  // 是否显示更多按钮
  showMore: {
    type: Boolean,
    default: false
  },
  // 更多按钮图标
  moreIcon: {
    type: String,
    default: '⋯'
  },
  // 导航栏背景色
  bgColor: {
    type: String,
    default: '#FFFFFF'
  },
  // 是否显示阴影
  showShadow: {
    type: Boolean,
    default: false
  },
  // 导航栏主体高度（px）
  navHeight: {
    type: Number,
    default: 44
  },
  // 是否固定定位
  fixed: {
    type: Boolean,
    default: true
  },
  // 返回拦截（可自定义返回逻辑）
  backIntercept: {
    type: Boolean,
    default: false
  }
})

// Emits 定义
const emit = defineEmits(['back', 'leftClick', 'rightClick', 'titleClick', 'add'])

// 导航栏整体高度
const totalHeight = computed(() => {
  return statusBarHeight.value + props.navHeight
})

// 导航栏主体样式
const navStyle = computed(() => {
  return {
    height: props.navHeight + 'px',
    position: props.fixed ? 'fixed' : 'relative',
    top: props.fixed ? statusBarHeight.value + 'px' : 'auto'
  }
})

// 标题样式
const titleStyle = computed(() => {
  return {
    color: props.titleColor,
    fontSize: props.titleSize + 'rpx',
    fontWeight: props.titleWeight
  }
})

// 初始化获取状态栏高度
onMounted(() => {
  // #ifdef APP-PLUS
  statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight || 44
  // #endif
})

// 处理返回点击
function handleLeftClick() {
  if (props.showBack && props.backIntercept) {
    // 自定义返回逻辑
    emit('leftClick')
  } else if (props.showBack) {
    // 默认返回逻辑
    const pages = getCurrentPages()
    if (pages.length > 1) {
      uni.navigateBack()
    } else {
      uni.switchTab({ url: '/pages/index/index' })
    }
    emit('back')
  } else {
    emit('leftClick')
  }
}

// 处理标题点击
function handleTitleClick() {
  emit('titleClick')
}

// 处理右侧点击
function handleRightClick() {
  emit('rightClick')
}

// 处理新增点击
function handleAddClick() {
  emit('add')
}
</script>

<style scoped>
/* 导航栏容器（包含状态栏） */
.custom-nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
}

/* 状态栏占位 */
.status-bar {
  width: 100%;
}

/* 导航栏主体 */
.custom-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  height: 44px;
  box-sizing: border-box;
}

.nav-shadow {
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.05);
}

/* 左侧区域 */
.nav-left {
  display: flex;
  align-items: center;
  height: 100%;
  min-width: 60rpx;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-left: -12px;
}

.back-icon {
  font-size: 40rpx;
  color: #333333;
  font-weight: 300;
}

.left-text {
  font-size: 28rpx;
  color: #666666;
}

/* 标题区域 */
.nav-title {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow: hidden;
}

.title-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.title-arrow {
  margin-left: 8rpx;
  color: #999999;
  font-size: 24rpx;
}

/* 右侧区域 */
.nav-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  min-width: 60rpx;
}

/* 新增按钮样式 */
.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 8rpx;
}

.add-text {
  font-size: 34rpx;
  color: #8A8AFF;
  font-weight: 500;
}

/* 更多按钮 */
.more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
}

.more-icon {
  font-size: 36rpx;
  color: #333333;
}

.right-text {
  font-size: 28rpx;
  color: #666666;
}
</style>

