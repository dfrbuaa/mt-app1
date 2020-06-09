import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import UserModel from '../../dbs/models/users'

// 验证用户
passport.use(new LocalStrategy(async function(username, password, done) {
    let where = {
        username
    };
    let result = await UserModel.findOne(where)
    if (result != null) {
        if (result.password === password) {
            return done(null, result)
        } else {
            return done(null, false, '密码错误')
        }
    } else {
        return done(null, false, '用户不存在')
    }
}))


//用户每次进入时通过session验证
//session存储在cookie中
// 序列化：用户验证成功后将用户存储在session中
passport.serializeUser(function(user, done) {
    return done(null, user)
})

// 反序列化：每次请求时，从session中读取用户对象
passport.deserializeUser(function(user, done) {
    return done(null, user)
})

export default passport