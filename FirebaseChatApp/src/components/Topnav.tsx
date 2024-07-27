import { useContext, useEffect, useState } from "react"
import { isAuth as getAuth } from "../services/AuthService"
import { signOut } from "firebase/auth"
import { auth } from "../config/firebase"
import { Link, useNavigate } from "react-router-dom"
import { User } from "./Home"
import { Sidebar } from "./Sidebar"
export default function Topnav() {

    const navigate = useNavigate()
    const user = useContext(User)
    // const [isAuth, setAuth] = useState<boolean | null>(null)
    // useEffect(() => {
    //     getAuth()
    //     .then(auth => {
    //         if(auth) {
    //             setAuth(true)
    //         } else{
    //             setAuth(false)
    //         }
    //     })
    // }, [])

    const logOut = () => {
        signOut(auth).then(() => {
            navigate("/login")
          }).catch((error) => {
        });
    }


    
  return (
    <header className="grid  grid-cols-[1fr_1fr_1fr] items-center border-b-[1px] border-[#ff9100] min-h-[48px]">
        
        <Sidebar />

        <Link to={'/home'}>
            <h4 className="text-[1.25rem] font-bold text-center">FireChat</h4>
        </Link>
        {/* { isAuth === null ? (<button>Loading...</button>) 
        : isAuth ? (<button onClick={logOut}>Logout</button>) 
        : (<button>Login</button>)}

        <p>{user?.name}</p>
        <img src={user?.photoURL} alt="profile" className="rounded-full max-w-[48px] aspect-square"/> */}
    </header>
    )
}
