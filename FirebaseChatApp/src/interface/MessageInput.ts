export interface MessageInput {
    uid: string
    displayName: string
    photoURL: string | null
    messageContent: string
    timestamp: any
    type: string
    replySnippet: string
    replyTo: string
}