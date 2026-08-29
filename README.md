# hello_vue

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

           整体的学生隔离靠用户的id   如果该学生user_id字段对应某个用户,那么该学生就属于哪个用户


```
