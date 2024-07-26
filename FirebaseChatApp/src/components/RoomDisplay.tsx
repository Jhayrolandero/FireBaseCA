import { collection, getDocs, limit, onSnapshot, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../config/firebase';
import { RoomDis } from '../interface/RoomDisplay';
import { useNavigate } from 'react-router-dom';

export default function RoomDisplay() {
    const roomsRef = collection(db, "rooms");
    const [rooms, setRoom] = useState<RoomDis[]>([])
    
    const navigate =  useNavigate()
    // onSnapshot(roomsRef, (docs) => {
    //     const source = docs.metadata.hasPendingWrites ? "Local" : "Server";
    //     console.log(source)
    //     docs.forEach((doc) => {
    //         const data: RoomInput = {
      //             roomName: doc.data().roomName,
    //             topics: doc.data().topics,
    //             capacity: doc.data().capacity,
    //             public: doc.data().public
    //         }
    //         roomsArr.push(data)
    //     });
    //     setRoom(roomsArr)
    // });

    const navigateRoom = (id: string) => {
      navigate(`room/${id}`)
    }
    
    // useEffect(() => {

    //   const q = query(roomsRef, limit(15));
    //   const unsub = onSnapshot(q, {includeMetadataChanges: true}, (snapshot) => {
    //     const source = snapshot.metadata.hasPendingWrites ? "Local" : "Server";
    //     // console.log(source)
    //     const data = snapshot.docs.map(doc => ({
    //       roomName: doc.data().roomName,
    //       topics: doc.data().topics,
    //       capacity: doc.data().capacity,
    //       public: doc.data().public,
    //       roomID: doc.id
    //     }))

    //     // console.log(data)
        
    //     // console.log("prev: ", rooms)
    //     setRoom([...data])
    //     // console.log("curr: ", rooms)
    // });

    // return () => unsub();

    // }, [])
    
  return (
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
