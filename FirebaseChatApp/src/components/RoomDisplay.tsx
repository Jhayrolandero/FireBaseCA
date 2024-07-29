import { collection, DocumentData, getDocs, limit, onSnapshot, Query, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../config/firebase';
import { RoomDis } from '../interface/RoomDisplay';
import { Link, useNavigate } from 'react-router-dom';

export default function RoomDisplay() {
    const roomsRef = collection(db, "rooms");
    const [rooms, setRoom] = useState<RoomDis[]>([])
        
    useEffect(() => {

      const q = query(roomsRef, limit(5));


      const fetchDocs = async (query: Query<DocumentData, DocumentData>) => {
        const querySnapshot = await getDocs(query);

        const data = querySnapshot.docs.map(doc => ({
          roomName: doc.data().roomName,
          topics: doc.data().topics,
          capacity: doc.data().capacity,
          public: doc.data().public,
          roomID: doc.id
        }))

        setRoom([...data])
      }

      fetchDocs(q)
    }, [])
    
  return (
    <div id="rooms" className="flex gap-4 flex-wrap max-w-[70%] items-center justify-center">

        {rooms.length <= 0 ? <h4>No rooms yet :(</h4> : rooms.map(x =>
          <Link to={`/room/${x.roomID}`}>
            <div className=" border-2 border-[#ff9100] flex flex-col  px-2 py-1 rounded-lg ">
              <div className="flex justify-between items-center gap-2">
              <p>{x.roomName}</p>
              <small>
                  3/{x.capacity}
                  <span className=" inline-block">
                  <div className={"w-[12px] aspect-square rounded-full ml-[4px]" + (x.public ? " bg-green-600" :"bg-red-600") } title={x.public ? 'Public' : 'Private'}></div>
                  </span>
              </small>
              </div>
              <div className="flex gap-2">
              <small className="text-[0.7rem]">{x.topics}</small>
              </div>
            </div>
          </Link>
        )}
    </div>
  )
}
