import { createContext, useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom";
import { UserProfile } from "../interface/UserProfile";
import { auth, db } from "../config/firebase"
import { collection, doc, getDoc, limit, onSnapshot, query } from "firebase/firestore";
import Topnav from "./Topnav"
import { getUser } from "../services/UserService"
import { RoomForm } from "./RoomForm";
import RoomDisplay from "./RoomDisplay";
import { signOut } from "firebase/auth";
import { RoomDis } from "../interface/RoomDisplay";
import { RoomInput } from "../interface/RoomInput";
export const User = createContext<UserProfile | undefined>(undefined)

export default function Home() {

  const roomsRef = collection(db, "rooms");
  const [rooms, setRoom] = useState<RoomDis[]>([])
  
  const navigate =  useNavigate()
  useEffect(() => {

        const q = query(roomsRef, limit(15));
        const unsub = onSnapshot(q, {includeMetadataChanges: true}, (snapshot) => {
          const source = snapshot.metadata.hasPendingWrites ? "Local" : "Server";
          // console.log(source)
          const data = snapshot.docs.map(doc => ({
            roomName: doc.data().roomName,
            topics: doc.data().topics,
            capacity: doc.data().capacity,
            public: doc.data().public,
            roomID: doc.id
          }))

          // console.log(data)
          
          // console.log("prev: ", rooms)
          setRoom([...data])
          // console.log("curr: ", rooms)
      });

      return () => unsub();

      }, [])

      
  const navigateRoom = (id: string) => {
    navigate(`room/${id}`)
  }
  

  return(
    <div id="rooms" className="flex gap-4 flex-wrap max-w-[70%]">
        {rooms.map(x => 
         <div className=" border-2 border-[#ff9100] flex flex-col  px-2 py-1 rounded-lg " onClick={() => navigateRoom(x.roomID)}>
            <div className="flex justify-between items-center gap-2">
            <p>{x.roomName}</p>
            <small>
                3/{x.capacity}
                <span className=" inline-block">
                <div className="w-[12px] aspect-square rounded-full bg-red-600 ml-[4px] " title="private"></div>
                </span>
            </small>
            </div>
            <div className="flex gap-2">
            <small className="text-[0.7rem]">{x.topics}</small>
            </div>
        </div>
        )}
    </div>
  )

}


/*

<User.Provider value={userData}>
      <div className='min-h-[100dvh]  bg-[#030917] text-[#ff9100] grid grid-cols-[auto_1fr]'>
        <div className="border-r-[1px] border-[#ff9100] rounded-lg  min-w-[160px] flex flex-col p-4 items-center">
          <img src={userData.photoURL} alt="profile" className="rounded-full w-[80%] aspect-square"/>
          <hr className="text-[#ff9100]"/>
          <RoomForm />
          <button onClick={logOut}>Sign Out</button>
        </div>
        <div className="grid grid-rows-[auto_1fr_auto]">
          <Topnav />
          <main className="h-full flex flex-col gap-4 justify-center items-center">
            <form className="min-w-[400px]">
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm border-b-2 border-[#ff9100] text-gray-900   bg-gray-50 focus:ring-blue-500 focus:border-blue-500 bg-transparent border-0 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
                    <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                </div>
            </form>
            <RoomDisplay />
          </main>
        </div>
      </div>
      </User.Provider>


*/