import { collection, getDocs, limit, onSnapshot, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../config/firebase';
import { RoomDis } from '../interface/RoomDisplay';
import { Link, useNavigate } from 'react-router-dom';

export default function RoomDisplay() {
    const roomsRef = collection(db, "rooms");
    const [rooms, setRoom] = useState<RoomDis[]>([])
        
    useEffect(() => {

      const q = query(roomsRef, limit(1));
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

        setRoom([...data])
    });

    return () => unsub();

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
                  <div className="w-[12px] aspect-square rounded-full bg-red-600 ml-[4px] " title="private"></div>
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
