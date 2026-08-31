require('dotenv').config({ path: '.env' })
const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const bcrypt = require('bcrypt')
const db = require('../config/db')
const error = require('../middleware/error')
const logger = require('../utils/logger')
const JWT_SECRET = process.env.JWT_MI
const saltRounds = 10
const multer = require('multer')
const tokenAuth = require('../middleware/auth')

router.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ code: 400, message: '账号或密码不能为空' })
    }
    const [existingUsers] = await db.query('SELECT id FROM user WHERE username = ?', [username])
    if (existingUsers.length > 0) {
      return res.json({ code: 401, message: '账号已存在' })
    }
    const hashpwd = await bcrypt.hash(password, saltRounds)
    const [result] = await db.query(
      'INSERT INTO user (username, password, role) VALUES (?, ?, ?)',
      [username, hashpwd, 'normal'],
    )
    if (result.affectedRows === 1) {
      return res.json({
        code: 200,
        message: '注册成功',
        data: username,
      })
    }
  } catch (err) {
    logger.error(err.message)
    return res.json({ code: 500, message: '注册时出了点问题' })
  }
})

router.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.json({ code: 400, message: '账号或密码不能为空' })
    }
    const [rows] = await db.query(
      'SELECT id, username, password, role FROM user WHERE username = ?',
      [username],
    )
    if (rows.length === 0) {
      return res.status(401).json({ code: 401, message: '账号或密码错误' })
    }

    const user = rows[0]

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ code: 401, message: '账号或密码错误' })
    }
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, {
      expiresIn: '2h',
    })
    res.json({
      code: 200,
      message: '登录成功',
      token,
      data: { username: user.username, role: user.role, id: user.id },
    })
  } catch (err) {
    logger.error(err.message)
    return res.json({ code: 500, message: '登录时出了点问题' })
  }
})

const upload = multer({
  dest: 'uploads/',
})
router.post('/upload', tokenAuth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        code: 400,
        message: '没有收到图片文件',
      })
    }
    const avatarPath = req.file.filename
    // 有 role 的(user/admin)存 user 表,没 role 的(学生)存 student 表
    if (req.auth.role) {
      const [result] = await db.query('UPDATE user SET avatar=? WHERE id=?', [
        avatarPath,
        req.auth.id,
      ])
      if (result.affectedRows === 0) {
        return res.status(404).json({
          code: 404,
          message: '没找到这个用户',
        })
      }
    } else {
      const [result] = await db.query('UPDATE student SET avatar=? WHERE id=?', [
        avatarPath,
        req.auth.id,
      ])
      if (result.affectedRows === 0) {
        return res.status(404).json({
          code: 404,
          message: '没找到这个学生',
        })
      }
    }
    res.status(200).json({
      code: 200,
      message: '头像上传成功',
      url: `http://localhost:4300/uploads/${avatarPath}`,
    })
  } catch (err) {
    logger.error(err.message)
    res.status(500).json({
      code: 500,
      message: '上传失败',
    })
  }
})
router.get('/upload', tokenAuth, async (req, res) => {
  try {
    const table = req.auth.role ? 'user' : 'student'
    const [rows] = await db.query(`SELECT avatar FROM ${table} WHERE id = ?`, [req.auth.id])
    if (!rows.length || !rows[0].avatar) {
      return res.status(404).json({
        code: 404,
        message: '还没有设置头像',
      })
    }
    res.status(200).json({
      code: 200,
      message: '查询成功',
      url: `http://localhost:4300/uploads/${rows[0].avatar}`,
      data: rows,
    })
  } catch (err) {
    logger.error(err.message)
    res.status(500).json({
      code: 500,
      message: '查询失败',
    })
  }
})

router.post('/admin/modify', tokenAuth, async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: '账号密码参数错误',
      })
    }
    const [rows] = await db.query('SELECT * FROM user WHERE id = ? AND username = ?', [
      req.auth.id,
      username,
    ])
    if (rows.length === 0) {
      return res.status(401).json({
        code: 401,
        message: '没找到该用户',
      })
    }
    const hashpwd = await bcrypt.hash(password, saltRounds)
    const [roo] = await db.query('UPDATE user SET password=? WHERE id=?', [hashpwd, req.auth.id])
    if (roo.affectedRows === 1) {
      return res.status(200).json({
        code: 200,
        message: '修改成功',
      })
    }
  } catch (err) {
    logger.error(err.message)
    res.status(500).json({
      code: 500,
    })
  }
})
// ==================== 管理员：用户管理（增删改查） ====================
// 只有 admin 角色才能操作 user 表
function requireAdmin(req, res, next) {
  if (req.auth.role !== 'admin') {
    return res.status(403).json({
      code: 403,
      message: '只有管理员才能操作',
    })
  }
  next()
}

// 查询用户列表（分页）
router.get('/admin/user', tokenAuth, requireAdmin, async (req, res) => {
  try {
    let page = Number(req.query.page) || 1
    let limit = Number(req.query.limit) || 10
    let offset = (page - 1) * limit
    const [rows] = await db.query('SELECT id, username, role, avatar FROM user LIMIT ? OFFSET ?', [
      limit,
      offset,
    ])
    const [[countResult]] = await db.query('SELECT COUNT(*) as total FROM user')
    res.status(200).json({
      code: 200,
      message: '用户列表查询成功',
      data: rows,
      total: countResult.total,
      page,
      limit,
    })
  } catch (err) {
    logger.error(err.message)
    res.status(500).json({
      code: 500,
      message: '查询用户列表失败',
    })
  }
})

// 新增用户
router.post('/admin/user', tokenAuth, requireAdmin, async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: '用户名或密码不能为空',
      })
    }
    const [existing] = await db.query('SELECT id FROM user WHERE username = ?', [username])
    if (existing.length > 0) {
      return res.status(400).json({
        code: 400,
        message: '用户名已存在',
      })
    } //条件?条件成立的值:不成立的值
    const userRole = 'normal'
    const hashpwd = await bcrypt.hash(password, saltRounds)
    const [result] = await db.query(
      'INSERT INTO user (username, password, role) VALUES (?, ?, ?)',
      [username, hashpwd, userRole],
    )
    if (result.affectedRows === 1) {
      return res.status(200).json({
        code: 200,
        message: '用户添加成功',
        data: {
          id: result.insertId,
          username,
          role: userRole,
        },
      })
    }
  } catch (err) {
    logger.error(err.message)
    res.status(500).json({
      code: 500,
      message: '添加用户失败',
    })
  }
})

// 修改用户（用户名/角色必填，密码不传则不改）
router.put('/admin/user/:id', tokenAuth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { username, password, role } = req.body
    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: '用户名或角色不能为空',
      })
    }
    if (role !== 'normal') {
      return res.status(400).json({
        code: 400,
        message: '管理员只能有一个,并且你只能赋予normal权限',
      })
    }

    const [rows] = await db.query('SELECT id, role FROM user WHERE id = ?', [id])
    if (rows.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '没找到要修改的用户',
      })
    }
    // 防止管理员把自己的角色降级，导致失去管理权限
    if (id === req.auth.id && role !== 'admin') {
      return res.status(400).json({
        code: 400,
        message: '不能把自己的角色降级',
      })
    }
    const [dup] = await db.query('SELECT id FROM user WHERE id <> ? AND username = ?', [
      id,
      username,
    ])
    if (dup.length > 0) {
      return res.status(400).json({
        code: 400,
        message: '用户名已存在',
      })
    }
    let sql = 'UPDATE user SET username = ?, role = ?'
    const params = [username, role]
    if (password) {
      const hashpwd = await bcrypt.hash(password, saltRounds)
      sql += ', password = ?'
      params.push(hashpwd)
    }
    sql += ' WHERE id = ?'
    params.push(id)
    const [result] = await db.query(sql, params)
    if (result.affectedRows === 1) {
      return res.status(200).json({
        code: 200,
        message: '修改成功',
        data: { id, username, role },
      })
    }
    return res.status(400).json({
      code: 400,
      message: '你要修改的用户不存在',
    })
  } catch (err) {
    logger.error(err.message)
    res.status(500).json({
      code: 500,
      message: '修改用户时出了点问题',
    })
  }
})

// 删除用户（不能删除自己）
router.delete('/admin/user/:id', tokenAuth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (id === req.auth.id) {
      return res.status(400).json({
        code: 400,
        message: '不能删除自己',
      })
    }
    const [rows] = await db.query('SELECT id FROM user WHERE id = ?', [id])
    if (rows.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '没找到要删除的用户',
      })
    }
    const [result] = await db.query('DELETE FROM user WHERE id = ?', [id])
    if (result.affectedRows === 1) {
      return res.status(200).json({
        code: 200,
        message: '删除成功',
      })
    }
  } catch (err) {
    logger.error(err.message)
    res.status(500).json({
      code: 500,
      message: '删除用户时出了点问题',
    })
  }
})

module.exports = router
