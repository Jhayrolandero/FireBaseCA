import { getUser } from "./services/UserService";

export async function loader()  {
    const userData = await getUser()

    console.log(userData)
    if(userData) {
        return userData 
    } else {
        return undefined
    }
}