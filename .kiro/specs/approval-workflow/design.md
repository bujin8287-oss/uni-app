# 审批流功能设计文档

## 概述

审批流系统是一个完整的工作流管理解决方案，允许管理员创建可复用的审批模板，用户基于模板发起审批流程，审批人处理审批任务。系统采用前后端分离架构，前端使用 uni-app 框架开发，后端通过 RESTful API 提供服务。

## 架构设计

### 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                        前端层 (uni-app)                       │
├─────────────────────────────────────────────────────────────┤
│  审批列表页    │  发起审批页  │  审批详情页  │  模板管理页   │
├─────────────────────────────────────────────────────────────┤
│                      API 请求层 (HTTP)                        │
├─────────────────────────────────────────────────────────────┤
│                      后端服务 (REST API)                      │
├─────────────────────────────────────────────────────────────┤
│  模板管理服务  │  实例管理服务  │  审批处理服务  │  用户服务  │
├─────────────────────────────────────────────────────────────┤
│                      数据持久层 (Database)                    │
└─────────────────────────────────────────────────────────────┘
```

### 页面结构

```
pages/
├── approval/                    # 审批流程管理
│   ├── index.vue               # 审批列表（待我审批 + 我发起的）
│   ├── start.vue               # 发起审批
│   └── detail.vue              # 审批详情
├── approval-template/          # 审批模板管理
│   ├── index.vue               # 模板列表和流程树
│   └── edit.vue                # 创建/编辑模板
└── organization/               # 组织架构（支持审批人选择）
    └── index.vue               # 组织架构树
```

## 组件和接口

### 页面组件

#### 1. 审批列表页 (pages/approval/index.vue)

**功能:**
- 显示待我审批和我发起的审批列表
- 支持标签页切换
- 提供快速审批操作（通过/拒绝）
- 悬浮按钮发起新审批

**数据结构:**
```javascript
{
  currentTab: 'pending' | 'my',
  pendingList: Array<ApprovalInstance>,
  myList: Array<ApprovalInstance>,
  loading: boolean,
  userId: string
}
```

**API 调用:**
- `GET /approval/instances/pending?approverId={userId}` - 获取待审批列表
- `GET /approval/instances/my?applicantId={userId}` - 获取我发起的列表
- `POST /approval/instances/{id}/approve` - 执行审批操作

#### 2. 发起审批页 (pages/approval/start.vue)

**功能:**
- 选择审批模板
- 显示流程预览
- 填写审批信息
- 提交审批申请

**数据结构:**
```javascript
{
  templates: Array<ApprovalTemplate>,
  templateIndex: number,
  formData: {
    title: string,
    businessType: string,
    businessId: string,
    description: string
  },
  formDataJson: string,
  loading: boolean
}
```

**API 调用:**
- `GET /approval/templates?status=active` - 获取可用模板列表
- `POST /approval/instances` - 创建审批实例

#### 3. 审批详情页 (pages/approval/detail.vue)

**功能:**
- 显示审批基本信息
- 展示审批流程时间线
- 显示表单数据

**数据结构:**
```javascript
{
  instance: ApprovalInstance,
  loading: boolean
}
```

**API 调用:**
- `GET /approval/instances/{id}` - 获取审批详情

#### 4. 模板管理页 (pages/approval-template/index.vue)

**功能:**
- 流程树视图和列表视图切换
- 可视化流程树展示
- 节点增删改操作
- 模板信息编辑

**数据结构:**
```javascript
{
  currentTab: 'tree' | 'list',
  templates: Array<ApprovalTemplate>,
  selectedIndex: number,
  showNodeEditor: boolean,
  showTemplateEditor: boolean,
  editingNode: ApprovalNode,
  editingTemplate: ApprovalTemplate,
  positions: Array<Position>,
  users: Array<User>
}
```

**API 调用:**
- `GET /approval/templates` - 获取模板列表
- `GET /approval/positions?userId={userId}` - 获取岗位列表
- `GET /user/list` - 获取用户列表
- `PUT /approval/templates/{id}?userId={userId}` - 更新模板
- `DELETE /approval/templates/{id}?userId={userId}` - 删除模板

#### 5. 模板编辑页 (pages/approval-template/edit.vue)

**功能:**
- 创建新模板
- 编辑现有模板
- 配置审批节点

**数据结构:**
```javascript
{
  formData: {
    name: string,
    code: string,
    category: string,
    status: string,
    description: string,
    nodes: Array<ApprovalNode>
  },
  templateId: string
}
```

**API 调用:**
- `GET /approval/templates/{id}` - 获取模板详情
- `POST /approval/templates?userId={userId}` - 创建模板
- `PUT /approval/templates/{id}?userId={userId}` - 更新模板

## 数据模型

### ApprovalTemplate (审批模板)

```javascript
{
  _id: string,                    // 模板ID
  name: string,                   // 模板名称
  code: string,                   // 模板代码（唯一标识）
  category: string,               // 分类：equipment, purchase, leave, expense, other
  status: string,                 // 状态：active, inactive
  description: string,            // 描述
  nodes: Array<ApprovalNode>,     // 审批节点列表
  createdBy: string,              // 创建人ID
  createdAt: Date,                // 创建时间
  updatedAt: Date                 // 更新时间
}
```

### ApprovalNode (审批节点)

```javascript
{
  nodeId: string,                 // 节点ID
  nodeName: string,               // 节点名称
  nodeType: string,               // 节点类型：user, position, department_manager, auto
  approvalMode: string,           // 审批模式：and, or, sequential
  autoPass: boolean,              // 是否自动通过
  order: number,                  // 节点顺序
  approvers: Array<string>        // 审批人ID列表（用户ID或岗位ID）
}
```

### ApprovalInstance (审批实例)

```javascript
{
  _id: string,                    // 实例ID
  templateId: string,             // 模板ID
  businessType: string,           // 业务类型
  businessId: string,             // 业务ID
  title: string,                  // 审批标题
  applicantId: string,            // 申请人ID
  applicantName: string,          // 申请人姓名
  status: string,                 // 状态：pending, approved, rejected, cancelled
  currentNodeId: string,          // 当前节点ID
  formData: Object,               // 表单数据
  records: Array<ApprovalRecord>, // 审批记录
  startTime: Date,                // 开始时间
  endTime: Date                   // 结束时间
}
```

### ApprovalRecord (审批记录)

```javascript
{
  nodeId: string,                 // 节点ID
  nodeName: string,               // 节点名称
  approverId: string,             // 审批人ID
  approverName: string,           // 审批人姓名
  action: string,                 // 操作：pending, approved, rejected, auto_approved
  comment: string,                // 备注
  approvedAt: Date                // 审批时间
}
```

## 正确性属性

*属性是一个特征或行为，应该在系统的所有有效执行中保持为真——本质上是关于系统应该做什么的正式陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*

### 属性 1: 模板节点顺序一致性

*对于任何* 审批模板，当添加、删除或移动节点后，所有节点的 order 字段应该是连续的正整数序列（1, 2, 3, ...）

**验证: 需求 1.3, 1.7, 1.9**

### 属性 2: 审批实例状态转换有效性

*对于任何* 审批实例，状态转换必须遵循以下规则：
- pending → approved（所有节点通过）
- pending → rejected（任一节点拒绝）
- pending → cancelled（申请人取消）
- 不允许从 approved/rejected/cancelled 状态转换到其他状态

**验证: 需求 3.6, 3.7, 3.8**

### 属性 3: 审批人权限验证

*对于任何* 审批操作，执行审批的用户必须是当前节点的审批人之一

**验证: 需求 9.3**

### 属性 4: 模板必填字段完整性

*对于任何* 审批模板创建或更新操作，必须包含 name、code、category 字段且 nodes 数组不为空

**验证: 需求 1.2, 1.7**

### 属性 5: 审批实例必填字段完整性

*对于任何* 审批实例创建操作，必须包含 title 和 businessType 字段

**验证: 需求 2.3, 2.4**

### 属性 6: 审批节点配置完整性

*对于任何* 节点类型为 "user" 的审批节点，approvers 数组必须至少包含一个用户ID；对于节点类型为 "position" 的审批节点，approvers 数组必须至少包含一个岗位ID

**验证: 需求 7.1, 7.2**

### 属性 7: 审批流程记录完整性

*对于任何* 审批实例，records 数组的长度应该等于模板中 nodes 数组的长度，且每个节点都有对应的审批记录

**验证: 需求 4.3**

### 属性 8: 用户认证状态验证

*对于任何* 审批功能访问，如果用户未登录（userId 为空），系统应该跳转到登录页面

**验证: 需求 9.1, 9.2**

### 属性 9: 数据过滤正确性

*对于任何* 用户查看待审批列表时，列表中的所有审批实例的当前节点审批人必须包含该用户；查看我发起的列表时，列表中的所有审批实例的申请人必须是该用户

**验证: 需求 3.2, 5.1**

### 属性 10: JSON 格式验证

*对于任何* 用户输入的附加信息，如果不是空字符串，则必须是有效的 JSON 格式

**验证: 需求 2.6**

### 属性 11: 节点删除后顺序重排

*对于任何* 审批模板，删除节点后，剩余节点的 order 字段应该重新排序为连续的正整数序列

**验证: 需求 1.9, 6.6**

### 属性 12: 审批流转逻辑

*对于任何* 审批实例，当当前节点审批通过后，currentNodeId 应该更新为下一个节点的 nodeId；当最后一个节点通过后，currentNodeId 应该为空且 status 应该为 approved

**验证: 需求 3.6, 3.8**

## 错误处理

### 网络错误
- 所有 API 请求失败时显示 Toast 提示
- 提供重试机制或返回上一页面

### 数据验证错误
- 表单提交前进行客户端验证
- 显示具体的验证错误信息

### 权限错误
- 未登录用户跳转到登录页
- 无权限操作显示错误提示

### 业务逻辑错误
- 后端返回的错误信息通过 Toast 显示
- 关键操作失败后保持当前页面状态

## 测试策略

### 单元测试
- 测试数据格式化函数（formatTime）
- 测试状态映射函数（getStatusText, getStatusClass）
- 测试节点类型和审批模式的映射函数

### 集成测试
- 测试完整的审批流程（发起 → 审批 → 完成）
- 测试模板的创建、编辑、删除流程
- 测试不同节点类型的审批流转

### 属性测试
- 使用随机生成的模板数据测试节点顺序一致性
- 使用随机生成的审批操作测试状态转换有效性
- 测试审批人权限验证的各种场景

### 用户界面测试
- 测试页面导航和路由跳转
- 测试表单输入和验证
- 测试加载状态和错误提示的显示

## 实现注意事项

1. **API 基础 URL**: 当前代码中硬编码为 `http://localhost:3000`，实际部署时需要配置为实际的后端服务地址

2. **用户信息存储**: 使用 `uni.getStorageSync` 获取用户信息，需要确保登录时正确存储 `userId`、`realName`、`user` 等信息

3. **样式单位**: 使用 rpx 作为响应式单位，确保在不同设备上的显示效果

4. **图标使用**: 当前使用 emoji 作为图标，可以考虑替换为图标字体或 SVG

5. **流程树渲染**: 流程树使用 flex 布局实现，需要注意横向滚动的处理

6. **弹窗管理**: 使用多个 boolean 变量控制弹窗显示，注意状态管理和内存释放

7. **数据刷新**: 审批操作成功后需要刷新列表数据，确保数据的实时性

8. **错误处理**: 所有 API 调用都需要处理 success 和 fail 回调，提供友好的错误提示
