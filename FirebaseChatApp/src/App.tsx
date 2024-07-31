import { useEffect, useState } from "react"
import { isAuth } from "./services/AuthService"
import { Outlet, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { auth } from "./config/firebase";
import { UserProfile } from "./interface/UserProfile";
import { signOut, User } from "firebase/auth";
import Topnav from "./components/Topnav";
import { Sidebar } from "./components/Sidebar";


export const loader = async () => {

  const checkAuth = await isAuth()

  if (!checkAuth) {
    return redirect("/login");
  } else {
    return redirect("/home");
  }

}
export default function App() {

  const [userProfileData, setuserProfileData ] = useState<UserProfile | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>()
  const navigate = useNavigate()
  const userData = useLoaderData() as User | undefined;

  useEffect(() => {
    const checkAuth = async() => {
      const checkAuth = await isAuth()

      if (!checkAuth) {
        return navigate('/login')
      } else {
        return navigate('/home')
      }
    }

    checkAuth()

    const isAuthReady = async () => {
      setLoading(true)
      await auth.authStateReady()
      if(userData) {
        console.log(loading)
        const data: UserProfile = {
          email: userData.email,
          name: userData.displayName,
          photoURL: userData.photoURL
        }
        setuserProfileData(data)
      }
      setLoading(false)
    }
    
    isAuthReady()
  }, [])
  
  return (
    <div className='max-h-screen h-screen bg-black  bg-dot-white/[0.2] text-white grid grid-rows-[auto_1fr]'>

    {
      loading ? <h4>Authenticating...</h4> :
      userProfileData === undefined ? <h4>Unknown user profile</h4> : 
      <>
      <Topnav /> 
      <main className="overflow-auto">
        <Outlet />
      </main>
      </>
    }
    </div>
   
  )
}
