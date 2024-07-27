import { Button, IconButton, Input } from "@material-tailwind/react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useLoaderData, useNavigate } from "react-router-dom"
import { RoomInput } from "../interface/RoomInput"
import { MessageInput } from "../interface/MessageInput"
import { addDoc, collection, doc, getDocs, limit, onSnapshot, orderBy, query } from "firebase/firestore"
import { db } from "../config/firebase"
import { getUser } from "../services/UserService"
import { User } from "firebase/auth"
import { useEffect, useState } from "react"


interface RoomLoader {
  roomID: string
  userData: User | null
}
export async function loader({ params } : {params: any}) {
  const userData = await getUser()

  return {
    roomID: params.id,
    userData 
  }
}

export default function Room() {
  const roomData = useLoaderData() as RoomLoader
  const roomRef = collection(db, "rooms", roomData.roomID, "messages");
  const [messages, setMessages] = useState<MessageInput[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    if(roomData.userData === null) {
      navigate('/home')
    }

    const getMessages = async () => {
      // const msgSnapshot = await getDocs(roomRef)

      // const messageData : MessageInput[] = msgSnapshot.docs.map(doc => {
      //   return {
      //     displayName: doc.data().displayName as string,
      //     photoURL: doc.data().photoURL as string | null,
      //     messageContent: doc.data().messageContent as string,
      //     timestamp: doc.data().timestamp as Date
      //   }
      // })

      const q = query(roomRef, orderBy('timestamp', "desc"), limit(5))
      const unsub = onSnapshot(q, {includeMetadataChanges: true}, (snapshot) => {
        const source = snapshot.metadata.hasPendingWrites ? "Local" : "Server";
        console.log(snapshot.metadata)
        console.log(source)
        const data = snapshot.docs.map(doc => ({
          displayName: doc.data().displayName as string,
          photoURL: doc.data().photoURL as string | null,
          messageContent: doc.data().messageContent as string,
          timestamp: doc.data().timestamp,
          uid: doc.data().uid as string
        }))

        // setRoom([...data])
        //  Make it pushing data
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
    <div className="grid grid-rows-[1fr_auto] h-full">
      <div className="flex flex-col-reverse gap-2 px-4 py-2 overflow-y-auto h-full">
        { messages.map(message => 
          <div id="messageBox" className={roomData.userData?.uid === message.uid ? 'flex-row-reverse flex gap-2 aspect-auto' : 'flex gap-2 aspect-auto'}>
            <img className="w-[32px] h-[32px] rounded-full" src={message.photoURL ? message.photoURL : ''} alt={message.displayName} title={message.displayName}/>
            {/* {message.timestamp.toLocaleString()} */}
            <div className=" bg-gray-600 px-[0.625em] pt-[0.125em] pb-[.0625em] rounded-2xl max-w-[60%]" title={message.timestamp.toLocaleString()}><p>{message.messageContent}</p></div>
          </div>
        )}
      </div>
      <div className="h-[80px] border-t-[1px] border-[#ff9100] py-2 flex items-center flex-1 w-full">
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
    // <div>{id}</div>
  )
}
