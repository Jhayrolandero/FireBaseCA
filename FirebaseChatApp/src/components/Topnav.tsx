import { useEffect, useState } from "react"
import { isAuth as getAuth } from "../services/AuthService"
import { signOut } from "firebase/auth"
import { auth } from "../config/firebase"
import { useNavigate } from "react-router-dom"
export default function Topnav() {

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
    <header className="flex justify-between items-center  border-b-[1px] border-[#ff9100] min-h-[48px]">
        <div>
            <h4>FireChat</h4>
        </div>
        { isAuth === null ? (<button>Loading...</button>) 
        : isAuth ? (<button onClick={logOut}>Logout</button>) 
        : (<button>Login</button>)}
    </header>
    )
}
