import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { isAuth as getAuth } from "../services/AuthService"
import { signOut } from "firebase/auth"
import { auth } from "../config/firebase"

export default function Home() {
  const navigate = useNavigate()

  const [isAuth, setAuth] = useState<boolean | null>(null)
  useEffect(() => {
      getAuth()
      .then(auth => {
          if(auth) {
              setAuth(true)
          } else{
              setAuth(false)
          }
      })
  }, [])

  const logOut = () => {
      signOut(auth).then(() => {
        navigate("/login")
        }).catch((error) => {
      });
  }
  return (
    <div className="h-full flex flex-col gap-[80px] justify-center items-center">
      <h2 className="text-[4rem] font-semibold">Message with ease</h2>
      <button className="border-[1px] rounded-md p-2 border-[#ff9100]">Start a room</button>
    </div>
)
}
