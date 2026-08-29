基于 Vue 3 的学生管理系统前端项目，包含管理员 / 教师 / 学生三种视角，提供学生信息管理、用户管理、数据可视化等功能。

## ✨ 功能特性

- **教师端登录 / 注册**：账号密码登录，支持管理员（admin）与普通教师（normal）两种角色
- **学生端登录**：学号 + 密码独立登录，学生身份与教师身份分离（独立 token）
- **学生信息管理**：学生列表的分页、姓名搜索、新增、修改、删除
- **用户管理**（管理员专属）：用户列表分页、新增用户、删除用户
- **数据可视化**（管理员专属）：基于 ECharts 的统计图表（用户 / 学生数量统计）
- **头像功能**：导航栏展示用户头像
- **权限控制**：路由守卫 + 角色判断，未登录自动跳转登录页

## 🛠️ 技术栈

| 分类 | 技术 |
| --- | --- |
| 框架 | Vue 3（Composition API + `<script setup>`） |
| 构建工具 | Vite |
| 语言 | TypeScript |
| 状态管理 | Pinia |
| 路由 | Vue Router |
| UI 组件库 | Element Plus |
| 数据可视化 | ECharts |
| HTTP 请求 | Axios |

## 📁 项目结构

```
src/
├── views/            # 页面组件
│   ├── login.vue         # 教师登录
│   ├── register.vue      # 教师注册
│   ├── studentLogin.vue  # 学生登录
│   ├── home.vue          # 首页（学生信息管理）
│   ├── userhome.vue      # 用户管理（管理员）
│   ├── shujutongji.vue   # 数据统计（管理员）
│   └── compnents/        # 通用子组件（分页、新增弹窗等）
├── stores/           # Pinia 状态管理（用户登录态、token）
├── router/           # 路由配置 + 路由守卫（权限控制）
├── utils/            # Axios 封装（请求/响应拦截器）
└── App.vue           # 根组件（导航栏 + router-view）
```

## 🚀 快速开始

### 环境要求

- Node.js `>= 22.18.0`（或 `>= 24.12.0`）

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 类型检查
npm run type-check
```

### 后端接口约定

本项目是纯前端项目，后端接口地址默认配置为 `http://localhost:4300/`，位于 [src/utils/admin.ts](src/utils/admin.ts)。

需要自行准备后端服务，主要接口包括：

| `POST api/login` | 用户登录 |
| `POST api/register` | 用户注册 |
| `POST api/student/login` | 学生登录 |
| `GET admin/paging` | 学生列表（分页） |
| `POST admin/student` | 新增学生 |
| `PUT admin/student/:id` | 修改学生 |
| `DELETE admin/student/:id` | 删除学生 |
| `GET admin/user` | 用户列表（分页） |
| `POST admin/user` | 新增用户 |
| `DELETE admin/user/:id` | 删除用户 |
put admin/user/:id 修改用户
| `GET student/statistics` | 统计数据（图表） |
| `GET upload` | 获取头像 |

注意：`admin/*` 接口需要管理员 token；接口路径基于 `baseURL: http://localhost:4300/`，请以实际后端为准。

                反正也没人看    整体的学生隔离靠用户的id   如果该学生user_id字段对应某个用户,那么该学生就属于哪个用户

待补充
