import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, getAdditionalUserInfo } from "firebase/auth";
import { provider } from "../config/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth/cordova";
import { collection, addDoc, getDocs } from "firebase/firestore"; 
import { db } from "../config/firebase";

export default function Login() {

    const auth = getAuth()
    auth.useDeviceLanguage()
    const [isLog, setLog] = useState(false)
    const [user, setUser] = useState<User>()
    
    useEffect(() => {
        isAuth()
        .then((x : boolean) => {
            setLog(x)
        })
        .catch(err => console.error(err))
    }, [])

    useEffect(() => {
        getDocs(collection(db, "users"))
        .then(res => {
            res.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            });
        })
    }, [])

    const isAuth = () : Promise<boolean> => {
        return new Promise((resolve, reject) => {
            auth.authStateReady()
            .then(() => {
                    if(auth.currentUser) {
                        console.log(auth.currentUser)
                        setUser(auth.currentUser)
                        resolve(true)
                    } else {
                        setUser(undefined)
                        resolve(false)
                    }
                }
            )
            .catch(err => {
                console.error(err)
                setUser(undefined)
                resolve(false)
            })

        })
    }



    const googleLogin = () => {
        signInWithPopup(auth, provider)
        .then(x => {
            const credential = GoogleAuthProvider.credentialFromResult(x);
            
            const token = credential!.accessToken;
            
            console.log(token)
            const user = x.user;
            console.log(auth.currentUser)
            console.log(user)
            console.log(getAdditionalUserInfo(x))
            setLog(true)
        })
        .catch(err => console.error(err))
    }

    const logOut = () => {
        signOut(auth).then(() => {
            setLog(false)
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
    return (
        <>
        {
            isLog ? 
            <div>
                <p>Welcome! {user?.displayName}</p>
                <h4>logged</h4>
                <button onClick={addData}>Push Data</button>
                <button onClick={logOut} className="border-2 p-2 border-black rounded-md">Logout</button>
            </div> :
            <div>
                <button onClick={googleLogin} className="border-2 p-2 border-black rounded-md">Login with Google</button>
                <button onClick={() => console.log(auth.currentUser)} className="border-2 p-2 border-black rounded-md">User</button>
            </div>
        }
        </>
    )

}
