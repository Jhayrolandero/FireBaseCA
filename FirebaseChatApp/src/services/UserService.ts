import { auth } from "../config/firebase";

export const getUser = async () => {
    await auth.authStateReady()
    return auth.currentUser
}