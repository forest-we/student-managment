# hello_vue

学生管理系统（前端 Vue 3 + 后端 Express/MySQL 一体化仓库），包含管理员 / 教师 / 学生三种视角：学生信息管理、用户管理、数据可视化。

 功能特性

- **教师端登录 / 注册**：账号密码登录，支持管理员（admin）与普通教师（normal）两种角色
- **学生端登录**：学号 + 密码独立登录，学生身份与教师身份分离（独立 token）
- **学生信息管理**：学生列表分页、姓名搜索、新增、修改、删除
- **用户管理**（管理员专属）：用户列表分页、新增、修改、删除用户
- **数据可视化**（管理员专属）：基于 ECharts 的统计图表
- **头像功能**：上传 / 展示用户头像
- **权限控制**：路由守卫 + JWT 拦截器 + 角色判断，未登录自动跳转登录页

技术栈

| 端 | 技术 |
| --- | --- |
| 前端 | Vue 3 · Vite · TypeScript · Pinia · Vue Router · Element Plus · ECharts · Axios |
| 后端 | Node.js · Express · MySQL (mysql2) · JWT (express-jwt) · Multer · Winston |

项目结构

```
hello_vue/
├── src/                    # 前端
│   ├── views/              # 页面组件(登录/学生管理/用户管理/数据统计...)
│   │   └── compnents/      # 通用子组件(分页/新增弹窗等)
│   ├── stores/             # Pinia 状态管理(登录态、token)
│   ├── router/             # 路由 + 权限守卫
│   └── utils/              # Axios 封装(请求/响应拦截器)
└── server/                 # 后端
    ├── server.js           # 服务入口(端口 4300)
    ├── config/             # 数据库连接
    ├── middleware/         # JWT 鉴权、错误处理
    ├── routes/             # 接口路由(用户/学生)
    ├── utils/              # 日志
    └── public/             # 旧版静态页面
```

 快速开始

### 环境要求

- Node.js `>= 22.18.0`（或 `>= 24.12.0`）
- MySQL 数据库

### 1. 启动后端

```bash
# 安装依赖
cd server
npm install

# 创建环境变量文件(填自己的数据库配置)
# Windows: copy .env.example .env
# Mac/Linux: cp .env.example .env

# 启动服务(监听 http://localhost:4300)
npm start
```

`.env` 配置说明（该文件已被 gitignore，不会提交到仓库）：

```
PORT=4300
JWT_MI=你的JWT密钥
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=你的数据库密码
DB_NAME=shuju
DB_PORT=3306
```

### 2. 启动前端

```bash
# 回到项目根目录,安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 类型检查
npm run type-check
```



后端接口前缀 `http://localhost:4300/`（前端配置在 [src/utils/admin.ts](src/utils/admin.ts)）。

| 接口 | 说明 | 权限 |
| --- | --- | --- |
| `POST api/login` | 用户登录 | 公开 |
| `POST api/register` | 用户注册 | 公开 |
| `POST api/student/login` | 学生登录 | 公开 |
| `GET admin/paging` | 学生列表(分页) | 教师 |
| `POST admin/search` | 按姓名搜索学生 | 教师 |
| `POST admin/student` | 新增学生 | 教师 |
| `PUT admin/student/:id` | 修改学生 | 教师 |
| `DELETE admin/student/:id` | 删除学生 | 教师 |
| `GET admin/user` | 用户列表(分页) | 管理员 |
| `POST admin/user` | 新增用户 | 管理员 |
| `PUT admin/user/:id` | 修改用户 | 管理员 |
| `DELETE admin/user/:id` | 删除用户 | 管理员 |
| `GET student/statistics` | 统计数据(图表) | 教师 |
| `POST upload` | 上传头像 | 登录用户 |
| `GET upload` | 获取头像 | 登录用户 |



- **学生数据隔离**：学生记录通过 `user_id` 字段归属某个用户，该学生即属于对应的用户/管理员管理。
- **权限分层**：`/admin/*` 接口需 JWT + 管理员角色；普通教师只能操作自己 `user_id` 下的学生。

