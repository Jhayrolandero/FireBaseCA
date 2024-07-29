import { signInWithPopup, GoogleAuthProvider, signOut, getAdditionalUserInfo } from "firebase/auth";
import { provider, auth } from "../config/firebase";
import { useEffect, useState } from "react";
import { isAuth } from "../services/AuthService";
import { collection, addDoc, getDocs, setDoc, doc } from "firebase/firestore"; 
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { FlipWordsComponent } from "./FlipWord";
import { DesktopSidebar } from "../../@/components/ui/sidebar";

export default function Login() {

    const navigate = useNavigate()
    
    useEffect(() => {
        isAuth()
        .then(auth => {
            if(auth) {
                navigate('/home')
            } 
        })
    }, [])

    const googleLogin = () => {
        signInWithPopup(auth, provider)
        .then(info => {

            const newUser = getAdditionalUserInfo(info)?.isNewUser
            if(newUser) {
                // Add a new document in collection "cities"
                setDoc(doc(db, "users", info.user.uid), {
                    name: info.user.displayName,
                    id: info.user.uid,
                    photoURL: info.user.photoURL,
                    email: info.user.email,
                    emailVerified: info.user.emailVerified
                });
            }
            navigate('/home')
        })
        .catch(err => console.error(err))
    }

    return(
        <div className="min-h-[100dvh] bg-black bg-dot-white/[0.2] text-[#ff9100] flex flex-col justify-center items-center">
            {/* <h2 className="text-[4rem] font-bold text-[#ff9100]">FireChat</h2> */}
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black  [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <FlipWordsComponent />
            <button onClick={googleLogin} className="border-2 p-2  rounded-md  border-[#ff9100] text-[#ff9100]"><i className="text-[#ff9100] fa-brands fa-google text-[1.25rem]" ></i> Login with Google</button>
        </div>
    )
}
