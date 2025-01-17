type reply = {
    replySnippet: string
    isReply: boolean
    displayName: string
}

type Props = {
    photoURL: string
    displayName: string
    timestamp: string
    messageContent: string
    messageUID: string
    userUID: string
    onReply: (data: reply) => void;
}

const RoomMessage = (props: Props) => {

    const sendReply = (message: string, displayName: string) => {
        const snipCut = 40
        const snippet = message.slice(0, snipCut) + (message.length <= snipCut ? "" : '...')
        console.log(message)
        console.log(snippet)
        props.onReply({replySnippet:  snippet, isReply: true, displayName})
    }
  return (
    <div id="messageBox" className={props.userUID === props.messageUID ? 'flex-row-reverse flex gap-2 aspect-auto' : 'flex gap-2 aspect-auto'}>
    <img className="w-[32px] h-[32px] rounded-full" src={props.photoURL ? props.photoURL : ''} alt={props.displayName} title={props.displayName}/>
      <div className=" bg-[#313131] px-[0.625em] border-[1px] border-[#24242c] pt-[0.125em] pb-[.0625em] rounded-2xl max-w-[50%]" title={props.timestamp}><p>{props.messageContent}</p></div>
      <div className="flex items-center">
      <i className="fa-solid fa-reply" onClick={() => sendReply(props.messageContent, props.displayName)}></i>
      </div>
    </div>

  )
}

export default RoomMessage