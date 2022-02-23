const userInfo={
    "admin":{
        nickName:"admin",
        avatar:"./admin.png"
    },
    "Quin33":{
        nickName:"Quin33",
        avatar:"./quin33.png"
    },
    "skyBabe":{
        nickName:"skyBabe",
        avatar:"./skybabe.png"
    },
    "erduoG":{
        nickName:"erduoG",
        avatar:"./erduog.png"
    },
    "kenny":{
        nickName:"kenny",
        avatar:"./kenny.png"
    },    
}

let socket=null
let myUsername=''

// 用户登录
function doLogin(){
    const username=document.querySelector("#username").value
    const password=document.querySelector("#password").value
    socket=io({
        query:{
            name:username,
            password:password,
        },
        reconnection:false

    })
    
    socket.on('connect_error',(err)=>{
        if(err){
            switch(err.message){
                case "invalid username":
                    alert('invalid username')
                    return
                case 'wrong password':
                    alert('wrong password')
                    return
                case 'already login':
                    alert('user already login')
                    return
            }
        }
        alert('link failure，please check the Websocket server')
    })

    socket.on('connect',()=>{
        //链接成功
        alert("success")
        myUsername=username
        // 切换到聊天室界面
        const loginEl=document.querySelector('.form')
        const chatroomEl=document.querySelector('.chatroom')
        loginEl.style.top='-100%'
        chatroomEl.style.top='50%'
    })
    socket.on('disconnect',()=>{
        //断开连接
        
    })
    // 接收历史
    socket.on('receiveHistory',(history)=>{
        // 逐条加入历史中的消息
        console.log('received history: ',history);
        history.forEach((message)=>{
            doAddMessage(message)
        })
        renderServerMsg(' ------------ history above ------------ ')
        
    })
    // 接收消息
    socket.on('receiveMessage',(message)=>{
        console.log('received a broadcast message: ',message)
        // 加入消息
        doAddMessage(message)
    })
    
    // 渲染左侧在线用户框
    socket.on('online',(users)=>{
        console.log('online users: ',users);
        renderOnlineList(users)
    })
    
    socket.on('serverMessage',(name,op)=>{
        const serverMsg=`< ${name} ${op}s the chatroom >`
        renderServerMsg(serverMsg)
    })
    // fetch 链式操作
    // http response 
    // .json() 纯文本格式化解析成数据格式，得到聊天记录的数组结构
    // fetch('/history').then(res => res.json()).then((history)=>{
    //     console.log('history',history);
    // })

}
const loginEl=document.querySelector("#login")
loginEl.addEventListener('click',()=>{doLogin()})

// 用户发送消息
function doSend(){
    const inputMsgEL=document.querySelector(".input-box")
    const content=inputMsgEL.value
    // 输入不能为空！
    if (!content){
        alert("input can't be null!")
        return
    }
    // 清空输入框文本
    inputMsgEL.value=""
    socket.emit('sendMessage',content)
    renderChatMsg(myUsername,content)
}

// 客户端在聊天界面加入消息
function doAddMessage(message){
    // 将新消息渲染出来
    renderChatMsg(message["sender"],message["content"])
}

// 
function renderOnlineList(users){
    const leftTitleEL=document.querySelector(".left-title")
    const friendListEl=document.querySelector('.left-list')
    leftTitleEL.innerHTML=myUsername
    // 清空在线列表
    friendListEl.innerHTML=''
    // 插入在线列表
    users.forEach((user)=>{
        let liEL=document.createElement('li')
        friendListEl.appendChild(liEL)
        liEL.innerHTML=user
    })
}

function renderChatMsg(sender,content) {
    // 获取并修改聊天框
    const msgWrapEl=document.querySelector(".msg-wrap")
    
    const imgSrc=userInfo[sender]["avatar"]
    // 填充聊天内容
    
    // 加入一条msg元素
    let msgEL=document.createElement('div')
    msgEL.className=sender!==myUsername?"msg":"msg msg-me"
    msgWrapEl.appendChild(msgEL)
    // 加入头像
    let avatarEl=document.createElement('img')
    avatarEl.className="avatar"
    avatarEl.src=imgSrc
    msgEL.appendChild(avatarEl)
    // 加入文本
    let msgTxtEl=document.createElement('div')
    msgTxtEl.className="msg-txt"
    msgTxtEl.innerHTML=content
    msgEL.appendChild(msgTxtEl)

    msgEL.scrollIntoView()
    
}

function renderServerMsg(serverMsg){
    // 获取并修改聊天框
    const msgWrapEl=document.querySelector(".msg-wrap")
    let msgEL=document.createElement('div')
    msgEL.className="msg-server"
    msgEL.innerHTML=serverMsg
    msgWrapEl.appendChild(msgEL)
    msgEL.scrollIntoView()
}
//////////////////////////////////////////////////////////////
// chat






