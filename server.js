const path=require('path')
const http=require('http') // socket的握手就是http
const Koa=require('koa')
const serve=require('koa-static')
const socketIO=require('socket.io')


const hostname='127.0.0.1'
const port=3000
const publicPath=path.join(__dirname,'public')

const userInfo={
    "admin":"123456",
    "Quin33":"Quin33",
    "skyBabe":"skyBabe",
    "erduoG":"erduoG",
}

// 创建koa实例
const app=new Koa()
// 创建http server实例
const server=http.createServer(app.callback())
// 创建socket.io实例
const io=socketIO(server)

// 静态资源路由
app.use(serve(publicPath))

server.listen(port,hostname,()=>{
    console.log(`Server running at http://${hostname}:${port}`);

})

// 登录认证
io.use((socket,next)=>{
    const {name,password}=socket.handshake.query
    // 用户不存在
    if(!name || !userInfo[name]){
        return next(new Error('invalid username'))
    }
    // 密码错误
    if(userInfo[name] !== password){
        return next(new Error('wrong password'))
    }
    // 用户已登录
    if(users.has(name)){
        return next(new Error('already login'))
    }
    next()
})

// 存储在线用户
const users=new Map()
// 存储消息历史
const history=[]
loadHistory()

// 客户端登入
io.on('connection',(socket)=>{
    // 记录用户
    const name=socket.handshake.query.name
    users.set(name,socket)

    // 打印日志
    console.log(`${name} connected`);

    // 通知所有用户更新聊天列表，聊天框显示登入
    // 客户端会收到所有的users.keys
    io.sockets.emit('online',[...users.keys()])
    socket.emit('receiveHistory',[...history])
    io.sockets.emit('serverMessage',name,'enter')
    
    // 监听客户端消息
    socket.on('sendMessage',(content)=>{
        console.log(`${name} send a message: ${content}`);
        const message={
            time: Date.now(),
            sender: name,
            content: content,
        }
        // 记录消息
        history.push(message)
        // 广播消息(只有发送人收不到)
        socket.broadcast.emit('receiveMessage',message)
    })

    // 用户离线
    socket.on('disconnect',(reason)=>{
        console.log(`${name} disconnected, reason: ${reason}`)
        users.delete(name)
        // 通知所有客户端更新聊天列表
        io.sockets.emit('online',[...users.keys()])
        io.sockets.emit('serverMessage',name,'leave')
    })

})

app.use((ctx)=>{
    if(ctx.request.path==='/history'){
        ctx.body=history
    }
})

function loadHistory(){
    history.push(
        {
            time: 1638681017572,
            sender: "Quin33",
            content: "wei, zaima?",
        },
        {
            time: 1638681140087,
            sender: "skyBabe",
            content: "buzai",
        },
        {
            time: 1638681198296,
            sender: "skyBabe",
            content: "guna",
        },
    )
}
