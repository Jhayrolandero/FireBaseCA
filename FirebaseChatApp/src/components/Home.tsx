import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserProfile } from "../interface/UserProfile";
import { db } from "../config/firebase"
import { doc, getDoc } from "firebase/firestore";
import Topnav from "./Topnav"
import { getUser } from "../services/UserService"

export const User = createContext<UserProfile | undefined>(undefined)

export default function Home() {

  const navigate = useNavigate()

  const [userData, setUserData] = useState<UserProfile | undefined>(undefined)

  useEffect(() => {
    getUser()
    .then(user => {
      const uid = user?.uid
        const userRef = doc(db, 'users', uid!);

        getDoc(userRef)
        .then(snap => {
          if(snap.exists()) {
            const data = {
              email: snap.data().email,
              name: snap.data().name,
              photoURL: snap.data().photoURL
            }

            setUserData(data)
          } 
        })
        .catch(err => {
          console.error(err)
        })
    })
    .catch(err => {
      console.error(err)
    })

  },[])


  if(userData === undefined) {
    return (
      <div className='min-h-[100dvh]  bg-[#030917] text-[#ff9100] flex justify-center items-center'>
        <h4>Authenticating....</h4>
      </div>
    )
  } else {
    return (
      <User.Provider value={userData}>
      <div className='min-h-[100dvh]  bg-[#030917] text-[#ff9100] grid grid-rows-[auto_1fr_auto]'>
          <Topnav />
          <main className="h-full flex flex-col gap-[80px] justify-center items-center">
            <button className="border-[1px] rounded-md p-2 border-[#ff9100]">Start a room</button>
          </main>
      </div>
      </User.Provider>
  )
  }
}
