import Koa from 'koa'
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

import mongoose from 'mongoose'
// 用于post请求
import bodyParser from 'koa-bodyparser'
import session from 'koa-generic-session'
import Redis from 'koa-redis'
// 美观，json格式化
import json from 'koa-json'
import dbConfig from './dbs/config'
import passport from './interface/utils/passport'
import users from './interface/users'
import geo from './interface/geo'
import search from './interface/search'
import categroy from './interface/categroy'
import cart from './interface/cart'


const app = new Koa()

// 和session有关，秘钥
app.keys = ['mt', 'keyskeys']
app.proxy = true
app.use(session({
    key: 'mt', //前缀，为了在cookie中好识别
    prefix: 'mt:uid',
    store: new Redis()
}))

// post处理，扩展类型的处理
app.use(bodyParser({
    extendTypes: ['json', 'form', 'text']
}))
app.use(json())

// 连接数据库
mongoose.connect(dbConfig.dbs, { useNewUrlParser: true, useUnifiedTopology: true })

// passport初始化
app.use(passport.initialize())
app.use(passport.session())


// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

async function start() {
    // Instantiate nuxt.js
    const nuxt = new Nuxt(config)

    const {
        host = process.env.HOST || '127.0.0.1',
            port = process.env.PORT || 3000
    } = nuxt.options.server

    await nuxt.ready()
        // Build in development
    if (config.dev) {
        const builder = new Builder(nuxt)
        await builder.build()
    }

    // 路由配置
    app.use(users.routes()).use(users.allowedMethods())
    app.use(geo.routes()).use(geo.allowedMethods())
    app.use(search.routes()).use(search.allowedMethods())
    app.use(categroy.routes()).use(categroy.allowedMethods())
    app.use(cart.routes()).use(cart.allowedMethods())

    app.use((ctx) => {
        ctx.status = 200
        ctx.respond = false // Bypass Koa's built-in response handling
        ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
        nuxt.render(ctx.req, ctx.res)
    })

    app.listen(port, host)
    consola.ready({
        message: `Server listening on http://${host}:${port}`,
        badge: true
    })
}

start()