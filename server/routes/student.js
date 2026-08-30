const express = require('express')
require('dotenv').config({ path: '.env' })
const router = express.Router()
const tokenAuth = require('../middleware/auth')
const db = require('../config/db')
const logger = require('../utils/logger')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_MI
const saltRounds = 10
router.get('/admin/student',tokenAuth, async (req,res) => {
    try{
       const {name, age, classroom, gender} = req.query
        if(name !== undefined &&  name === ''){
            return res.json({
                code:400,
                message:'名字参数有错'
            })
        }
        if(age !== undefined && age === ''){
            return res.json({
                code:400,
                message:'年龄参数有错'
            })
        }
         if(classroom !== undefined && classroom === ''){
        return res.json({
            code:500,
            message:'班级参数有错'
        })
     }
       let sql = 'SELECT id, name, age, gender, classroom, user_id FROM student WHERE 1=1 '
       const params = []
        if(name){
            sql += ' AND name = ?'
            params.push(name)
        }
        if(age){
            sql += ' AND age = ?'
            params.push(age)
        }
        if(classroom){
            sql += ' AND classroom = ?'
            params.push(classroom)
        }
        if(gender){
            sql += ' AND gender = ?'
            params.push(gender)
        }
        if(req.auth.role !== 'admin'){
            sql += ' AND user_id = ?'
            params.push(req.auth.id)
        }
       const [students] = await db.query(sql, params)

       res.json({
        code:200,
        message:'查询成功',
        data:students
       })
    }
    catch(err){
       logger.error(err.message)
        res.json({
            code:500,
            message:'有问题'
        })
    }
})

router.post('/admin/student',tokenAuth,  async (req,res) =>{
    try{
        const {name, age, gender, classroom, student_no, password} = req.body
         if(classroom === undefined || classroom.length === 0 || classroom === ''){
        return res.json({
            code:400,
            message:'班级参数出错'
        })
     }
       if(name === undefined || name.length === 0){
      return  res.json({
            code:400,
            message:'学生名参数有问题'
        })
       }
       if(age === undefined || age === '' || Number.isNaN(Number(age))){
            return res.json({
                code:401,
                message:'学生年龄有问题'
            })
       }
       if(!student_no){
        return res.status(400).json({
            code:400,
            message:'学号参数错误'
        })
       }
       if(!password){
        return res.status(400).json({
            code:400,
            message:'密码参数有问题'
        })
       }
       const hashpwd = await bcrypt.hash(password, saltRounds)
       const normalizedName = name.toLowerCase();
      // affectedRows 执行增删改SQL后，数据库返回本次影响了多少行数据
      // insertId 执行插入后MYSQL会返回生成的自增ID，存在返回对象里的insertId里
       const [result] = await db.query('INSERT INTO student (name, age, gender, user_id, classroom, password, student_no) values (?, ?, ?, ?, ?, ?, ?)', [normalizedName, age, gender, req.auth.id, classroom, hashpwd, student_no])
       if(result.affectedRows === 1){
     return   res.json({
            code:200,
            message:'学生添加成功',
            data:{
                id:result.insertId,
                name: normalizedName,
                age,
                gender,
                classroom,
                student_no
            }
        })
       }
    }
    catch(err){
       logger.error(err.message)

        res.json({
            code:500,
            message:'出了点问题',
        })
    }
})

router.put('/admin/student/:id',tokenAuth,  async (req,res) => {
   try{
    const id = Number(req.params.id)
     const {name, age, gender, classroom, student_no} = req.body
     if(classroom === undefined || classroom.length === 0 || classroom === ''){
        return res.status(400).json({
            code:400,
            message:'班级参数出错'
        })
     }
      if(name === undefined || name.length === 0){
      return  res.status(400).json({
            code:400,
            message:'学生名参数有问题'
        })
       }
       if(age === undefined || age === '' || Number.isNaN(Number(age))){
            return res.status(400).json({
                code:400,
                message:'学生年龄有问题'
            })
       }
       if(!student_no){
        return res.status(400).json({
            code:400,
            message:'空值'
        })
       }
       if(!gender){
        return res.status(400).json({
            code:400
        })
       }
       const normalizedName = name.toLowerCase();
       const [rows] = await db.query('SELECT * FROM student WHERE id = ?', [id])
       if(rows.length === 0){
        return res.status(404).json({
            code:404,
            message:'没找到要修改的学生'
        })
       }
       const [roo] = await db.query('SELECT * FROM student WHERE id <> ? AND student_no = ?', [id, student_no])
       if(roo.length > 0){
            return res.status(400).json({
                code:400,
                message:'学号重复'
            })
       }
       if(req.auth.role !== 'admin' && req.auth.id !== rows[0].user_id){
        return res.status(403).json({
            code:403,
            message:'你没权利进行越权'
        })
       }
       const [result] = await db.query('UPDATE student set name=?, age=?, gender=?, classroom=?, student_no=? where id=?', [normalizedName, age, gender, classroom, student_no, id])
       if(result.affectedRows === 1){
        return res.status(200).json({
            code:200,
            message:'修改成功',
            data:{
                id,
                name: normalizedName,
                age,
                gender,
                classroom,
                student_no
            }
        })
       }else{
        return res.status(400).json({
            code:400,
            message:'你要修改的学生不存在'
        })
       }
   }
   catch(err){
   logger.error(err.message)
    return res.status(500).json({
        code:500,
        message:'修改时出了点问题'
    })
   }
})

router.delete('/admin/student/:id', tokenAuth, async (req,res) => {
    try{
        const id = Number(req.params.id)
        const [rows] = await db.query('SELECT user_id FROM student WHERE id = ?', [id])
        if(!rows.length){
            return res.status(404).json({
                code:404,
                message:'没找到要删除的学生'
            })
        }
        if(req.auth.role !== 'admin' && rows[0].user_id !== req.auth.id){
            return res.status(403).json({
                code:403,
                message:'你无权删除他人学生'
            })
        }
        const [result] = await db.query('DELETE FROM student WHERE id=?', [id])
        if(result.affectedRows === 0){
            return res.status(404).json({
                code:404,
                message:'没找到要删除的学生'
            })
        }
        if(result.affectedRows === 1){
        return    res.status(200).json({
                code:200,
                message:'删除成功'
            })
        }
    }
    catch(err){
        logger.error(err.message)
            res.status(500).json({
                code:500,
                message:'出问题了'
            })
    }
})
router.post('/admin/search', tokenAuth, async (req,res) =>{
    try{
        const {name} = req.body
        let page = Number(req.query.page) || 1
        let limit = Number(req.query.limit) || 5
        let offset = (page - 1) * limit
         if(name === undefined || name.length === 0){
      return  res.status(400).json({
            code:400,
            message:'学生名参数有问题'
        })
       } 
        const normalizedName = name.toLowerCase();
        const [user] = await db.query('SELECT id, name, age, gender, classroom FROM student WHERE name = ? LIMIT ? OFFSET ?', [normalizedName, limit, offset])
        const [[countResult]] = await    db.query('SELECT COUNT(*) as total FROM student WHERE name = ?', [name])
        if(!user){
            return res.status(404).json({
                code:404,
                message:'啥都没有'
            })
        }
       res.status(200).json({
        code:200,
        message:'学生姓名查询成功',
        data:user,
        total:countResult.total,
        page,
        limit
       })
    }
    catch(err){
        res.status(500).json({
            code:500,
            message:'出问题了'
        })
        logger.error(err.message)
    }
})

//分页查询
router.get('/admin/paging', tokenAuth, async (req,res) =>{
    try{
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 5
        let offset = (page - 1) * limit
        
        if(req.auth.role === 'normal'){ 
            const [rows] = await db.query('SELECT * FROM student WHERE user_id = ? LIMIT ? OFFSET ?', [req.auth.id, limit, offset])
            const [[countResult]] = await db.query('SELECT COUNT(*) as total FROM student WHERE user_id = ?', [req.auth.id])
            return    res.status(200).json({
            code:200,
            message:'分页查询成功',
            data:rows,
            total:countResult.total,
            page,
            limit
        })
        }
       else if(req.auth.role === 'admin' ){
             const [rows] = await db.query('SELECT * FROM student LIMIT ? OFFSET ?', [limit, offset])
        const [[countResult]] = await db.query('SELECT COUNT(*) as total FROM student')
        res.status(200).json({
            code:200,
            message:'分页查询成功',
            data:rows,
            total:countResult.total,
            page,
            limit
        })
        }
       else{
         const [rows] = await db.query('SELECT * FROM student WHERE user_id = ? LIMIT ? OFFSET ?', [req.auth.user_id, limit, offset])
             const [[countResult]] = await db.query('SELECT COUNT(*) as total FROM student WHERE user_id = ?', [req.auth.user_id])
             return res.status(200).json({
                code:200,
                data:rows,
                total:countResult.total,
                page,
                limit
             })
       }
    }
    catch(err){
        console.log(err.message);
            res.status(500).json({
                code:500,
                message:'查询时出现错误'
            })
            logger.error(err.message)
    }
})

router.post('/api/student',  async (req,res) =>{
        const {student_no, name, password, user_id, age, classroom, gender} = req.body
        try{
                    if (!name || !password || !user_id || !age || !classroom ||  !gender || !student_no) {
            return res.status(400).json({ code: 400, message: '账号或密码不能为空' })
        }
         const [existingUsers] = await db.query('SELECT * FROM student WHERE student_no = ?', [student_no])
         if(existingUsers.length > 0){
            return res.status(400).json({
                code:400,
                message:'学号重复'
            })
         }
       const hashpwd = await bcrypt.hash(password, saltRounds)
         const [result] = await db.query('INSERT INTO student (name, age, gender, user_id, classroom, password, student_no) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, age, gender, user_id, classroom, hashpwd, student_no])
         if(result.affectedRows === 1){
            res.status(200).json({
                code:200,
                message:'注册成功',
                data:{
                    name:name
                }
            })
         }
        }
        
        catch(err){
            res.status(500).json({
                code:500,
                message:'发生错误',
            })
            logger.error(err.message)
        }
})
router.post('/api/student/login', async (req,res) =>{
    const {student_no, password} = req.body
    try{
             if (!password || !student_no) {
            return res.json({ code: 400, message: '账号或密码不能为空' })
        }
        const [rows] = await db.query('SELECT * FROM student WHERE student_no = ?', [student_no])
        if(!rows.length){
            return res.status(400).json({
                code:400,
                message:'账号密码错误'
            })
        }
            const user = rows[0]
         const hashpwd = await bcrypt.compare(password, user.password)
        if(!hashpwd){
            return res.status(400).json({
                code:400,
                message:'密码错误'
            })
        }
        const token = jwt.sign(
            {id:user.id, name:user.name, student_no:user.student_no, user_id:user.user_id, classroom:user.classroom},
            JWT_SECRET,
            {expiresIn: '2h'}
        )
        res.status(200).json({
            code:200,
            message:'登录成功',
            token,
            data:{
                name:user.name,
                    classroom:user.classroom,
                    student_no:user.student_no,
                    user_id:user.user_id
            }
        })
    }
    catch(err){
        logger.error(err.message)
    }
})

router.get('/student/user',tokenAuth, async (req,res) =>{
    try{
            let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 5
        let offset = (page - 1) * limit
        console.log('user_id',req.auth.user_id);
        
            const [rows] = await db.query('SELECT * FROM student WHERE user_id = ? LIMIT ? OFFSET ?', [req.auth.user_id, limit, offset])
             const [[countResult]] = await db.query('SELECT COUNT(*) as total FROM student WHERE user_id = ?', [req.auth.user_id])
             return res.status(200).json({
                code:200,
                data:rows,
             })
        
        




    }
    catch(err){
        logger.error(err.message)
        res.status(500).json({
            code:500,
        
        })
    }
})

router.get('/student/statistics', tokenAuth, async (req,res) =>{
    try{
            const [[student]] = await db.query('SELECT COUNT(*) as total FROM student')
            const [[user]] = await db.query('SELECT COUNT(*) as total FROM user')
            const [[avg]] = await db.query('SELECT AVG(age) as total FROM student')
            const [gender] = await db.query('SELECT COUNT(*) as total FROM student GROUP BY gender')
            const boy = gender[0]
            const girl = gender[1]
            res.status(200).json({
                code:200,
                student:student.total,
                user:user.total,
                avg:avg.total,
                boy:boy.total,
                girl:girl.total
            })
    }
    catch(err){
        res.status(500).json({
            code:500,
            message:'错误'
        })
        logger.error(err.message)
    }
})



module.exports = router