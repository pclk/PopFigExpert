'use client'

import { AIState, Message, UIState } from "@/app/ai_sdk_action"
import { useAIState, useUIState } from "ai/rsc"
import { useEffect, useRef, useState } from "react"
import { ChatInput2 } from "./chat-input"

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, className, initialMessages }: ChatProps) {
	const [input, setInput] = useState('')

	const [messages] = useUIState() as UIState[][]
	const [aiState] = useAIState() as AIState[]

	const messagesRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight
		}
	}, [messages])
	
	return (
		<div className={className}>
			<div ref={messagesRef} className="chat">
				{messages.map(message => (
					<div key={message.id} className="message">
						{message.spinner}
						{message.display}
						{message.attachments}
					</div>
				))}
			</div>
			<ChatInput2
				id={id}
				input={input}
				setInput={setInput}
				/>
		</div>
	)
}