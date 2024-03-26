"use client"

import { createContext, useState } from 'react'
import { nanoid } from 'nanoid'
import { MessageType } from '../lib/validators/MessageType'

// MessageContext.tsx at src/app/context

const defaultValue = [
  {
    id: nanoid(),
    text: "Hello! How can I assist you today?",
    isUser: true,
  },
  {
    id: nanoid(),
    text: "I need help with my order.",
    isUser: false,
  },
  {
    id: nanoid(),
    text: "Sure, I'd be happy to help! Can you provide me with your order number?",
    isUser: true,
  },
]
export const MessagesContext = createContext<{
  messages: MessageType[]
  isMessageUpdating: boolean
  addMessage: (message: MessageType) => void
  removeMessage: (id: string) => void
  updateMessage: (id: string, updateFn: (prevText: string) => string) => void
  setIsMessageUpdating: (isUpdating: boolean) => void
}>({
  messages: [],
  isMessageUpdating: false,
  addMessage: () => {},
  removeMessage: () => {},
  updateMessage: () => {},
  setIsMessageUpdating: () => {},
})

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState(defaultValue)
  const [isMessageUpdating, setIsMessageUpdating] = useState<boolean>(false)

  const addMessage = (message: MessageType) => {
    setMessages((prev) => [...prev, message])
  }

  const removeMessage = (id: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== id))
  }

  const updateMessage = (
    id: string,
    updateFn: (prevText: string) => string
  ) => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message.id === id) {
          return { ...message, text: updateFn(message.text) }
        }
        return message
      })
    )
  }

  return (
    <MessagesContext.Provider
      value={{
        messages,
        isMessageUpdating,
        addMessage,
        removeMessage,
        updateMessage,
        setIsMessageUpdating,
      }}>
      {children}
    </MessagesContext.Provider>
  )
}