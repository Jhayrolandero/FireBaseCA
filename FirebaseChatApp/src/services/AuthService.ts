import { auth } from "../config/firebase"

export const isAuth = () : Promise<boolean> => {
    return new Promise((resolve) => {
        auth.authStateReady()
        .then(() => {
                if(auth.currentUser) {
                    console.log(auth.currentUser)
                    resolve(true)
                } else {
                    resolve(false)
                }
            }
        )
        .catch(err => {
            console.error(err)
            resolve(false)
        })

    })
}