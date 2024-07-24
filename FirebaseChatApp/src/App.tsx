import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { isAuth } from "./services/AuthService";
import Topnav from "./components/Topnav";

export default function App() {

  const navigate = useNavigate();

  useEffect(() => {
    isAuth()
    .then(res => {
      if(res) {
        navigate('/home')
      } else {
        navigate('/login')
    }
  
  })
  }, [])

  return (
    <div className='min-h-[100dvh]  bg-[#030917] text-[#ff9100] grid grid-rows-[auto_1fr_auto]'>
      <Topnav />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
