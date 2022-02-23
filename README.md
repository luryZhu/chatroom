# 在线聊天室 Chatroom
用于学习实时通信聊天库[socket.io](https://socket.io/)

## 技术栈
koa + socket.io

## 功能实现
1. 登录界面
   ![](login.png)
2. 聊天室界面
   ![](charroom.png)
   支持：
   - 在线用户列表
   - 聊天信息发送
   - 聊天信息接收
   - 聊天历史记录

TODO：
- 用户信息、聊天历史记录本地化存储
- 添加CSS动画效果
- 登录密码传输加密/HTTPS

## 运行
### 服务器端
打开项目根目录，运行服务器端程序`server.js` 
``` sh
npm start
```
### 客户端
浏览器访问http://127.0.0.1:3000/，多个客户端访问查看效果

#### 登录
默认提供账号
``` js
{
    "admin":"123456",
    "Quin33":"Quin33",
    "skyBabe":"skyBabe",
    "erduoG":"erduoG",
}
```

## 知识点

koa + socket.io

### 安装依赖

在项目根目录安装websocket包，websocket依赖koa

#### 服务器端

Koa：使用淘宝镜像，或者直接`cnpm`

```sh
npm --registry https://registry.npm.taobao.org install --save koa
npm --registry https://registry.npm.taobao.org install --save koa-static
```

Socket.io

``` sh
npm --registry https://registry.npm.taobao.org install --save socket.io
```

#### 客户端

 html中引用    

 ``` html
 <script src="https://gw.alipayobjects.com/os/lib/socket.io-client/4.3.2/dist/socket.io.js"></script>
 ```

### 声明引用

在服务器端

``` js
const path=require('path')
const http=require('http') // socket的握手就是http
const Koa=require('koa')
const serve=require('koa-static')
const socketIO=require('socket.io')
```

### 消息广播和接收

| 服务器端                                            | 客户端                                           |
| --------------------------------------------------- | ------------------------------------------------ |
| server广播消息，一对多                              |                                                  |
| `io.sockets.emit('online',[...users.keys()])  `     | `socket.on('online',(users)=>{})  `              |
| server接收消息，并广播给其他client，一对多          | 发送消息的client收不到！                         |
| `socket.broadcast.emit('receiveMessage',message)  ` | `socket.on('receiveMessage',(message)=>{})  `    |
| server向一个客户算发送消息，一对一                  |                                                  |
| `socket.emit('receiveHistory',[...history])  `      | `socket.on('receiveHistory',(history)=>{})     ` |
|                                                     | client向服务器端发送消息，一对一                 |
| `  socket.on('sendMessage',(content)=>{})  `        | `socket.emit('sendMessage',content)     `        |
