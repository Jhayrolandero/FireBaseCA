import { signInWithPopup, GoogleAuthProvider, signOut, getAdditionalUserInfo } from "firebase/auth";
import { provider, auth } from "../config/firebase";
import { useEffect, useState } from "react";
import { isAuth } from "../services/AuthService";
import { collection, addDoc, getDocs, setDoc, doc } from "firebase/firestore"; 
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
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

    useEffect(() => {
        getDocs(collection(db, "users"))
        .then(res => {
            res.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            });
        })
    }, [])


    const googleLogin = () => {
        signInWithPopup(auth, provider)
        .then(info => {

            const newUser = getAdditionalUserInfo(info)?.isNewUser
            // console.log(x.user.email)
            // console.log(x.user.)
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
            // const credential = GoogleAuthProvider.credentialFromResult(x);
            
            // const token = credential!.accessToken;
            
            // console.log(token)
            // const user = x.user;
            // console.log(auth.currentUser)
            // console.log(user)
            // console.log(getAdditionalUserInfo(x)?.isNewUser)
            navigate('/home')
        })
        .catch(err => console.error(err))
    }

    const logOut = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
          }).catch((error) => {
            console.error(error)
        });
    }
    
    const addData = async () => {
        try {
            const docRef = await addDoc(collection(db, "users"), {
              first: "Ada",
              last: "Lovelace",
              born: 1815
            });
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }

    return(
        <div className="min-h-[100dvh]  bg-[#030917] text-[#ff9100] flex flex-col justify-center items-center">
            <h2 className="text-[4rem] font-bold text-[#ff9100]">FireChat</h2>
            <button onClick={googleLogin} className="border-2 p-2  rounded-md  border-[#ff9100] text-[#ff9100]"><i className="text-[#ff9100] fa-brands fa-google text-[1.25rem]" ></i> Login with Google</button>
        </div>
    )
}
