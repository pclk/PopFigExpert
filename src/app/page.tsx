// page.tsx
import { ModelDropdown, TabSelector, FilterForm } from "@/components/home";
import ChatInput from "@/components/ChatInput";

export default function Home() {

  return (
    <>
      <div className="sticky left-0 top-0">
        <ModelDropdown />
      </div>
      <TabSelector />
      <ChatInput
        placeholder="Type your message..."
        description="Eve can make mistakes. Please check her responses."
      />
    </>
  );
}