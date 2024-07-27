import { useEffect, useState } from "react"
import { isAuth } from "./services/AuthService"
import { Outlet, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { auth } from "./config/firebase";
import { UserProfile } from "./interface/UserProfile";
import { signOut, User } from "firebase/auth";
import Topnav from "./components/Topnav";


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
        navigate('/login')
      } else {
        navigate('/home')
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

  const logOut = () => {
    signOut(auth).then(() => {
      navigate('/login')
        // Sign-out successful.
      }).catch((error) => {
        console.error(error)
    });
  }
  
  return (
    <div className='min-h-[100dvh]  bg-[#030917] text-[#ff9100] grid grid-cols-[auto_1fr]'>
    {
      loading ? <h4>Authenticating...</h4> :
      userProfileData === undefined ? <h4>Unknown user profile</h4> : 
      <>
      <aside className="border-r-[1px] border-[#ff9100] rounded-lg  min-w-[160px] flex flex-col p-4 items-center">
        <p>{userProfileData.name}</p>
        <img src={userProfileData.photoURL ? userProfileData.photoURL : ''} alt="profile" className="rounded-full w-[80%] aspect-square"/>
        <hr className="text-[#ff9100]"/>
        {/* <RoomForm /> */}
        <button onClick={logOut}>Sign Out</button>
      </aside>
      <div className="grid grid-rows-[auto_1fr_auto]">
        <Topnav /> 
      <main>
        <Outlet />
      </main>
      </div>
      </>
    }
    </div>
   
  )
}
