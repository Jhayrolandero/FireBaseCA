import React from "react";

interface RoomNotifProps {
    timestamp: string;
    displayName: string;
    messageContent: string;
}

const RoomNotif: React.FC<RoomNotifProps> = ({timestamp, displayName, messageContent}) => {
  return (
    <div className="flex justify-center items-center">
        <small title={timestamp.toString()}>{displayName} {messageContent}</small>
    </div>
)
}

export default RoomNotif;
