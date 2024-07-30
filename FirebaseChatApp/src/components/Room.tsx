import { Button, IconButton, Input } from "@material-tailwind/react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useLoaderData, useNavigate } from "react-router-dom"
import { RoomInput } from "../interface/RoomInput"
import { MessageInput } from "../interface/MessageInput"
import { addDoc, collection, doc, DocumentReference, DocumentSnapshot, getDoc, getDocs, increment, limit, onSnapshot, orderBy, query, QuerySnapshot, setDoc, updateDoc } from "firebase/firestore"
import { db } from "../config/firebase"
import { getUser } from "../services/UserService"
import { User } from "firebase/auth"
import { useEffect, useState } from "react"
import { AcerSidebar } from "./AcerSidebar"


interface RoomLoader {
  roomID: string
  userData: User | null
  roomData: DocumentSnapshot
  roomUsersData: QuerySnapshot
}

interface userData {
  displayName: string
  uid: string
  joinDate: Date
  role: string
}

export async function loader({ params } : {params: any}) {
  const userData = await getUser()
  const roomData = await getDoc(doc(db, "rooms", params.id))
  const roomUsersData = await getDocs(collection(db, "rooms", params.id, "users"))
  return {
    roomID: params.id,
    roomData,
    userData,
    roomUsersData 
  }
}

export default function Room() {
  const roomData = useLoaderData() as RoomLoader
  const roomRef = collection(db, "rooms", roomData.roomID, "messages");
  const userRoomRef = collection(db, "rooms", roomData.roomID, "users");
  const [messages, setMessages] = useState<MessageInput[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    if(roomData.userData === null) {
      return navigate('/home')
    }

    if(roomData.userData.uid) {
      const uid = roomData.userData.uid
      const displayName = roomData.userData.displayName ? roomData.userData.displayName : "User" 
      // get user room ref by UID
      const docRef = doc(userRoomRef, uid)

      getDoc(docRef)
      .then(snapShot => {
        // Add user
        if(!snapShot.exists()) {
          const userData: userData = {
            role: "member",
            uid: uid,
            joinDate: new Date(),
            displayName: displayName 
          }
          setDoc(doc(userRoomRef, uid), userData)
          .then(() => {

            const messageData: MessageInput = {
              type: "status",
              displayName: displayName,
              photoURL: null,
              messageContent: "joined the room",
              timestamp: new Date(),
              uid: uid
            }
            setDoc(doc(roomRef), messageData)
            .then(() => {
              updateDoc(doc(db, "rooms", roomData.roomID), {
                currCount: increment(1)
              })
            })
          })
          .catch(err => {
            alert(err)
          })
        }
      })
    }

    const getMessages = async () => {
      const q = query(roomRef, orderBy('timestamp', "desc"), limit(5))
      const unsub = onSnapshot(q, {includeMetadataChanges: true}, (snapshot) => {
        const source = snapshot.metadata.hasPendingWrites ? "Local" : "Server";
        console.log(snapshot.metadata)
        console.log(source)
        const data = snapshot.docs.map(doc => ({
          type: doc.data().type,
          displayName: doc.data().displayName as string,
          photoURL: doc.data().photoURL as string | null,
          messageContent: doc.data().messageContent as string,
          timestamp: doc.data().timestamp,
          uid: doc.data().uid as string
        }))
        setMessages([...data])
    });
    return () => unsub();
    }

    getMessages()
  }, [])

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MessageInput>({
    defaultValues: {
      type: "message",
      displayName: roomData.userData?.displayName!,
      photoURL: roomData.userData?.photoURL,
      messageContent: "",
      timestamp: new Date(),
      uid: roomData.userData?.uid
    },
  })

  
  const onSubmit: SubmitHandler<MessageInput> = async (data) => {
    try {
        const docRef = await addDoc(roomRef, data);
        console.log("Document written with ID: ", docRef.id);
        console.log(data)
    } catch(err) {
        console.error(err)
    }
  }

  return (
    <div className="grid grid-cols-[1fr_auto] h-full rounded-lg">
      <div className="grid grid-rows-[1fr_auto] h-full rounded-lg">
        <div className="flex flex-col-reverse gap-2 px-4 py-2 overflow-y-auto h-full border-b-[1px] border-r-[1px] border-t-[1px] border-[#24242c] rounded-xl">
          { messages.map(message =>
          message.type === "status" ?
          <div className="flex justify-center items-center">
            <p title={message.timestamp.toString()}>{message.displayName} {message.messageContent}</p>
          </div>
            :
            <div id="messageBox" className={roomData.userData?.uid === message.uid ? 'flex-row-reverse flex gap-2 aspect-auto' : 'flex gap-2 aspect-auto'}>
              <img className="w-[32px] h-[32px] rounded-full" src={message.photoURL ? message.photoURL : ''} alt={message.displayName} title={message.displayName}/>
              {/* {message.timestamp.toLocaleString()} */}
              <div className=" bg-[#18181b] px-[0.625em] border-[1px] border-[#24242c] pt-[0.125em] pb-[.0625em] rounded-2xl max-w-[60%]" title={message.timestamp.toLocaleString()}><p>{message.messageContent}</p></div>
            </div>
          )}
        </div>
        <div className="h-[80px]  py-2 flex items-center flex-1 w-full">
          <form action="" className="px-10 flex-1 flex gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="relative flex items-center flex-1">
            <Controller
                rules={{required: true}}
                name="messageContent"
                control={control}
                render={({ field }) =>
                    // <Input label="Room Name" size="lg" crossOrigin={undefined} {...field}/>
                // <Input label="Topics" size="lg" crossOrigin={undefined} {...field}/>
                <Input label="Room Name" size="lg" crossOrigin={undefined} className="absolute border-[1px] border-[#ff9100] rounded-full text-[#ff9100]" {...field}/>
                }
              />
              <IconButton type="submit" className=" bg-transparent absolute right-0 top-[2px] inline">
                <i className="fa-solid fa-paper-plane-top text-[#ff9100]"></i>
              </IconButton>
            </div>
              <IconButton className=" text-[#ff9100] bg-transparent">
              <i className="fa-solid fa-thumbs-up"></i>
              </IconButton>
          </form>
        </div>
      </div>
      <div className="w-[160px] bg-black">
        <h4>{roomData.roomData.data()!.roomName}</h4>
        <div>
        </div>
      </div>
    </div>
    // <div>{id}</div>
  )
}
