import { doc, getDoc } from "firebase/firestore";
import { db } from "./config/firebase";
import { isAuth } from "./services/AuthService";
import { getUser } from "./services/UserService";

export async function loader()  {
    const userData = await getUser()

    console.log(userData)
    if(userData) {
        return userData 
    } else {
        return undefined
    }
    // if(userData === null) return undefined

    // const uid = userData.uid

    // const userRef = doc(db, 'users', uid);

    // const userInfo = await getDoc(userRef)

    // if(!userInfo.exists()) return undefined


    // return ( {
    //     email: userInfo.data().email,
    //     name: userInfo.data().name,
    //     photoURL: userInfo.data().photoURL
    // })
}