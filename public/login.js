

const loginEl=document.querySelector("#login")

function doLogin(){
    const usernameEl=document.querySelector("#username")
    const passwordEl=document.querySelector("#password")
    const socket=io({
        query:{
            name:usernameEl.value,
            password:passwordEl.value
        },
        reconnection:false

    })
    
    socket.on('connect_error',(err)=>{
        if(err && err.message==="invalid username" || err.message==='wrong password'){
            alert('认证失败')
            return
        }
        alert('连接失败，请检查 Websocket 服务端')
    })
    socket.on('connect',()=>{
        //链接成功
        alert("success")
        socket.emit('sendMessage','hello')
        // window.location.href = "./flex.html"
    })
    socket.on('disconnect',()=>{
        //断开连接
        
    })
    
    socket.on('receiveMessage',(message)=>{
        console.log('received a broadcast message: ',message);
    })
    
    socket.on('online',(users)=>{
        console.log('online users: ',users);
    })
    

}

loginEl.addEventListener('click',()=>{doLogin()})

