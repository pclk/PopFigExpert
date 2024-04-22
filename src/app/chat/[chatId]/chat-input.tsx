import { Button } from "@/components/ui/button";
import { useAIState, useActions, useUIState} from "ai/rsc";
import type { AI } from "@/app/ai_sdk_action";
import { nanoid } from "ai";
import TextareaAutosize from 'react-textarea-autosize';

export interface ChatInputProps {
    id?: string
    title?: string
    input: string
    setInput: (value: string) => void
}

export function ChatInput2({
    id,
    title,
    input,
    setInput
}: ChatInputProps) {
    const [aiState] = useAIState();
    const [messages, setMessages] = useUIState<typeof AI>();
    const { submitUserMessage } = useActions();

    const exampleMessages = [
        'I want to generate report summary of Singapore AI',
        'I want a personality summary of Elon Musk',
    ]

    return(
        <div>
            <div className="mb-4 grid sm:grid-cols-2 gap-2 sm:pag-4 px-4 sm:px-0">
                {messages.length === 0 && exampleMessages.map((example, index) => (
                    <div 
                        key={example} 
                        className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
                        onClick={async () => {
                            setMessages(currentMessages => [
                                ...currentMessages,
                                {
                                    id: nanoid(),
                                    display: example,
                                },
                            ])
                            try {
                                const response = await submitUserMessage(example, 'mixtral')
                                setMessages(currentMessages => [
                                    ...currentMessages,
                                    response
                                ])
                            } catch (error) {
                                console.error(error)
                            }
                        }}
                    >
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{example}</div>
                    </div>
                ))}
            </div>
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-800">
                <TextareaAutosize
                    className="box-border w-full grow resize-none overflow-hidden rounded-sm border-primary p-2 font-inter text-sm text-darkprim caret-primary outline-0 transition-all duration-75 focus:ring-2 focus:ring-primary"
                    placeholder="Send a message"
                    value={input}
                    autoFocus
                    rows={1}
                    onKeyDown={async (e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            const value = input.trim()
                            setInput('')
                            if (!value) return

                            setMessages(currentMessages => [
                                ...currentMessages,
                                {
                                    id: nanoid(),
                                    display: <div>{value}</div>,
                                },
                            ])

                            try {
                                const response = await submitUserMessage(value, 'mixtral')
                                setMessages(currentMessages => [
                                    ...currentMessages,
                                    response,
                                ])
                            
                            } catch (e) {
                                console.error(e)
                            }
                        }
                    }}
                    onChange={(e) => {
                        setInput(e.target.value)
                    }}
                />
        </div>
        </div>
    )
}
