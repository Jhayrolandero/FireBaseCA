import { useEffect } from "react"

type Props = {
    photoURL: string
    displayName: string
    timestamp: any
    messageContent: string
    messageUID: string
    userUID: string
    replySnippet: string
    replyTo: string
}

const RoomReply = (props: Props) => {
   
  return (
    <div id="messageBox" className={"flex gap-2 aspect-auto " + (props.userUID === props.messageUID ? 'flex-row-reverse' : '')}>
        {/* <p>{props.timestamp}</p> */}
    {/* <div id="messageBox" className={props.userUID === props.messageUID ? 'flex-row-reverse flex gap-2 aspect-auto' : 'flex gap-2 aspect-auto'}> */}
        <img className="w-[32px] h-[32px] rounded-full" src={props.photoURL ? props.photoURL : ''} alt={props.displayName} title={props.displayName}/>
        <div className="max-w-[50%] " title={props.timestamp}>
            <p className=" text-end text-[0.6rem]">you replied to {props.replyTo}</p>
            <div className="-space-y-2  flex flex-col items-end">
                <div className="bg-[#18181b]  rounded-lg pb-2 px-1 pt-1">
                    <p className="text-[#c1c1c1]">{props.replySnippet}</p>
                </div>
                <div className=" bg-[#313131] px-[0.625em] border-[1px] border-[#24242c] pt-[0.125em] pb-[.0625em] rounded-2xl max-w-max" >
                    <p>{props.messageContent}</p>
                </div>
            </div>
        </div>
    </div>
    )
}

export default RoomReply