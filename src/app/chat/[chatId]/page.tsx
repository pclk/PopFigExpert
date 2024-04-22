import { nanoid } from "ai";
import { Chat } from "./chat";
import { AI } from "@/app/ai_sdk_action";

export const metadata = {
    title: "Eve is talking to you!"
}

export interface ChatPageProps {
	params: {
		chatId: string
	}
}

export default async function IndexPage({params}: ChatPageProps) {
	const id = params.chatId as string;

	return (
		<AI initialAIState={{chatID: id, interactions: [], messages: []}}>
			<Chat id={id} />
		</AI>
	)
}