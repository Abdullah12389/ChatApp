import { useState,useEffect,createContext, useContext,useRef } from 'react'
import './App.css'
import axios from 'axios'
import { io } from 'socket.io-client'

axios.defaults.withCredentials = true
export const UserContext = createContext(null)
export const CommContext = createContext(null)
export function CommIdContext({children}){
  const [commId,setCommId] = useState()
  return(
    <CommContext.Provider value={{commId,setCommId}}>
      {children}
    </CommContext.Provider>
  )
}
export function AuthContext({children}){
  const [user,setUser] = useState()
  useEffect(()=>{
    (async ()=>{
      const response = await axios.get("http://localhost:3000/me")
      if(!response.data.user){
         setUser(null)
         return
      }
      setUser(response.data.user)
    })()
  },[])
  return(
    <UserContext.Provider value={{user,setUser}}>
      {children}
    </UserContext.Provider>
  )
}
export default function App(){
  const [username,setUsername] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const { setUser } = useContext(UserContext)
  const [isLogin,setLogin] =useState(false)
  const signup = async (e)=>{
    if(e) e.preventDefault()
    const userData = {
      name:username,
      email:email,
      password:password
    }
    try{
      const response = await axios.post("http://localhost:3000/signup",userData)
      setUser(response.data.user)
      
    }catch(e){
      console.log(e)
    }
  }
  const login = async (e)=>{
    if(e) e.preventDefault()
    const userData = {
      name:username,
      password:password
    }
    try{
      const response = await axios.post("http://localhost:3000/login",userData)
      setUser(response.data.user)
    }catch(e){
      console.log(e)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-700 to-purple-500 flex items-center justify-center p-4">
      {/* Glassmorphism Card */}
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
        <h2 className="text-4xl font-bold text-center mb-8">Login</h2>
        
        <form onSubmit={signup} className="space-y-6">
          {/* Username Input */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg py-4 px-5 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
            />
            <span className="absolute right-4 top-4 opacity-70 text-lg">👤</span>
          </div>
          {/* Email Input */}
          {isLogin?<div/>:<div className="relative">
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg py-4 px-5 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
            />
            <span className="absolute right-4 top-4 opacity-70 text-lg">✉️</span>
          </div>}

          {/* Password Input */}
          <div className="relative">
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg py-4 px-5 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
            />
            <span className="absolute right-4 top-4 opacity-70 text-lg">🔒</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded accent-purple-600" />
              <span>Remember me</span>
            </label>
            <a href="#" className="hover:underline">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            className="w-full bg-white text-purple-900 font-bold py-4 rounded-lg hover:bg-gray-100 transition duration-300 shadow-lg"
            onClick={(e)=>isLogin?login(e):signup(e)}
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          Have and Account <a href="#" className="font-bold hover:underline" onClick={()=>setLogin(true)}>Login</a>
        </p>
      </div>
    </div>
  )
}
export function MainScreen() {
  const [showChat, setShow] = useState(false);
  const { user } = useContext(UserContext);
  const [coms, setComs] = useState([]);
  const [commName,setName] = useState("")
  const { setCommId } = useContext(CommContext);

  useEffect(() => {
    (async () => {
      const response = await axios.get(`http://localhost:3000/communities/${user.id}`);
      setComs(response.data.coms);
    })();
  }, [user.id]);

  const createCommunity = async () => {
    const response = await axios.post(`http://localhost:3000/${user.id}/createCommunity`, { name: commName});
    setComs((prev) => [...prev, response.data.comm]);
  };
  const joinCommunity = async () => {
    const response = await axios.post(`http://localhost:3000/${user.id}/joinCommunity`, { name: commName});
    setComs((prev) => [...prev, response.data.comm]);
  };

  if (showChat) return <ChatScreen />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-gray-200 p-8 flex flex-col shrink-0">
        <div className="text-2xl font-black text-black mb-10 antialiased [color:#000000]">
          Community<br/>Hub
        </div>
        <input 
          type="text" 
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Community Name"
          className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-sm placeholder:text-gray-400"
        />
        <button 
          onClick={createCommunity}
          className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg"
        >
          + Create Community
        </button>
        <button 
          onClick={joinCommunity}
          className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg"
        >
          + Join Community
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-hidden">
        <header className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-950 antialiased">
            Hello, {user?.name || 'Bruh'}!
          </div>
          <p className="text-gray-800 text-sm mt-1 font-medium">{user?.email} | ID: {user?.id}</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(coms || []).map((com, index) => (
            <div 
              key={index} 
              onClick={() => { setCommId(com.id); setShow(true); }}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <h3 className="text-lg font-bold text-gray-950 mb-2 antialiased">{com.name}</h3>
              <p className="text-xs text-gray-700 font-medium">Created: {new Date(com.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export function ChatScreen() {
  const { user } = useContext(UserContext);
  const { commId } = useContext(CommContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = useRef(null);
  const [typInd,setInd] =useState(null)
  const typingTimeout = useRef(null)
  useEffect(() => {
    (async ()=>{
      const response = await axios.get(`http://localhost:3000/${commId}/messages`)
      setMessages(response.data)
    })()
    socket.current = io("http://localhost:3000");
    socket.current.emit("joinCommunity", { "communityId": commId });
    socket.current.on("messages", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.current.on("typing",(msg)=>{
      setInd(msg)
    })
    return () => socket.current.disconnect();
  }, [commId]);
  const typing = (e) => {
    setMessage(e.target.value);
    socket.current.emit("typing", { 
      communityId: commId, 
      senderId: user.id 
    });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.current.emit("typing", { 
        communityId: commId, 
        senderId: null
      });
    }, 2000);
  };
  const sendMessage = async () => {
    if (!message.trim()) return;
    await socket.current.emit("messages", { "communityId": commId, "content": message, "senderId": user.id });
    setMessage("");
  };
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div>{typInd}</div>
        {messages.map((mess, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm max-w-lg border border-gray-200">
            <p className="text-gray-900">{mess.sender}</p>
            <p className="text-gray-900">{mess.content}</p>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white border-t border-gray-200 flex gap-2">
        <input 
          type="text" 
          value={message}
          onChange={(e) => typing(e)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
          placeholder="Type a message..."
        />
        <button 
          onClick={sendMessage}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}


export function MainApp(){
  const { user } = useContext(UserContext)
  return(
    <div>
     {user?<MainScreen/>:<App/>}
    </div>
  )
}