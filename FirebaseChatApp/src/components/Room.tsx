import { IconButton, Input } from "@material-tailwind/react"
import { User } from "firebase/auth"
import { addDoc, collection, doc, DocumentSnapshot, getDoc, getDocs, increment, limit, onSnapshot, orderBy, query, QuerySnapshot, setDoc, updateDoc } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useLoaderData, useNavigate } from "react-router-dom"
import { Meteors } from "../../@/components/ui/meteors"
import { db } from "../config/firebase"
import { MessageInput } from "../interface/MessageInput"
import { getUser } from "../services/UserService"
import RoomMessage from "./Room/RoomMessage"
import RoomNotif from "./Room/RoomNotif"
import RoomSidebar from "./Room/RoomSidebar"


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
  photoURL: string
}

type reply = {
  replySnippet: string
  isReply: boolean
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
  const [users, setUsers] = useState<userData[]>([])
  const [isReply, setReply] = useState(false)
  const [replySnip, setReplySnippet] = useState("")
  const inputRef = useRef<HTMLInputElement | null>(null);
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
            displayName: displayName,
            photoURL: roomData.userData!.photoURL ? roomData.userData!.photoURL : ''
          }
          setDoc(doc(userRoomRef, uid), userData)
          .then(() => {

            const messageData: MessageInput = {
              type: "status",
              displayName: displayName,
              photoURL: null,
              messageContent: "joined the room",
              timestamp: new Date(),
              uid: uid,
              replySnippet: ""
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

    const getRoomUsers = async () => {
      const roomUsersData = await getDocs(collection(db, "rooms", roomData.roomID, "users"))
      roomUsersData.forEach(doc => {
        const data: userData = {
          displayName: doc.data().displayName,
          uid: doc.data().uid,
          joinDate: doc.data().joinDate,
          role: doc.data().role,
          photoURL: doc.data().photoURL
        }
        setUsers(prev => [...prev, data])
        // console.log(doc.data())
      })
    }

    getRoomUsers()

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
          uid: doc.data().uid as string,
          reply: doc.data().reply,
          replySnippet: doc.data().replySnippet
        }))
        setMessages([...data])
    });
    return () => unsub();
    }

    getMessages()

    focusInput()
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
      uid: roomData.userData?.uid,
      replySnippet: ""
    },
  })

  const sendReply = (data: reply) => {
    setReply(data.isReply)
    setReplySnippet(data.replySnippet)
    console.log(isReply)
  }

  const focusInput = () => {

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }
  
  
  const onSubmit: SubmitHandler<MessageInput> = async (data) => {
    try {
        data.type = isReply ? "reply" : data.type
        data.replySnippet = replySnip
        const docRef = await addDoc(roomRef, data);
        console.log("Document written with ID: ", docRef.id);
        console.log(data)
    } catch(err) {
        console.error(err)
    }
  }

  return (
    <div className="grid max-h-svh grid-cols-[1fr_auto] rounded-lg w-full">
      <div className="grid grid-rows-[1fr_auto] ">
        <div className="flex flex-col-reverse gap-2 px-4 py-2 overflow-y-auto h-full border-b-[1px] border-r-[1px] border-t-[1px] border-[#24242c] rounded-xl">
          { messages.map(message =>
          message.type === "status" ?
          <RoomNotif 
          timestamp={message.timestamp.toString()} 
          displayName={message.displayName} 
          messageContent={message.messageContent} 
          />
          :
          message.type === "reply" ?
          <div>
              <p>{message.replySnippet}</p>
              <p>{message.messageContent}</p>
          </div>
          :
          <RoomMessage 
          photoURL={message.photoURL ? message.photoURL : ''}
          displayName={message.displayName}
          timestamp={message.timestamp.toLocaleString()}
          messageContent={message.messageContent}
          messageUID={message.uid}
          onReply={sendReply}
          userUID={roomData.userData!.uid}
          />
          )}
          <Meteors number={20} />
        </div>
        <div className="h-[80px]  py-2 flex flex-col  flex-1 w-full">
          <div>
            <p className="text-[1rem]">Replying to ....</p>
            <p className="text-[0.8rem]">Hello World</p>
            <i className="fa-solid fa-x" onClick={() => sendReply({isReply: false, replySnippet: ""})}></i>
          </div>
          <div className="w-full">
            <form action="" className="px-10 flex-1 flex gap-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="relative flex items-center flex-1">
              <Controller
                  rules={{required: true}}
                  name="messageContent"
                  control={control}
                  render={({ field }) =>
                  <Input
                  inputRef={(e) => {
                    field.ref(e);
                    inputRef.current = e;
                  }}
                  label="Room Name" 
                  size="lg" 
                  crossOrigin={undefined} 
                  className="absolute border-[1px] border-[#ff9100] rounded-full text-[#ff9100]" {...field}/>
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
      </div>
      <RoomSidebar 
        users={users}
      />
    </div>
    // <div>{id}</div>
  )
}
