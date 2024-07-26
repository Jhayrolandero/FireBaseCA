import { useEffect, useState } from "react"
import { Outlet, useLoaderData } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { isAuth } from "./services/AuthService";
import Topnav from "./components/Topnav";
import { RoomForm } from "./components/RoomForm";
import { getUser } from "./services/UserService";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./config/firebase";
import { UserProfile } from "./interface/UserProfile";
import { signOut } from "firebase/auth";

export default function App() {

  const [userData, setUserData] = useState<UserProfile | undefined>(undefined)
  const navigate = useNavigate();

  useEffect(() => {
    isAuth()
    .then(res => {
      if(!res) {
        navigate('/login')
      } else {
        navigate('/home')
        getUser()
        .then(user => {
          const uid = user?.uid
            const userRef = doc(db, 'users', uid!);

            getDoc(userRef)
            .then(snap => {
              if(snap.exists()) {
                const data = {
                  email: snap.data().email,
                  name: snap.data().name,
                  photoURL: snap.data().photoURL
                }

                setUserData(data)
              } 
            })
            .catch(err => {
              console.error(err)
            })
        })
        .catch(err => {
          console.error(err)
        })
      }
  })
  }, [])
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

  const logOut = () => {
    signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        console.error(error)
    });
  }


  if(userData === undefined) {
    return (
      <h4>Authenticating...</h4>
    )
  } else {
    return (
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
          </main>
          </div>
      </div>
    )
  }

}
