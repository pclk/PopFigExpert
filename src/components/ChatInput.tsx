import TextareaAutosize from "react-textarea-autosize";

interface ChatInputProps {
  action: (formData: FormData) => void;
  placeholder?: string;
  description?: string;
}

export default function ChatInput({
  action,
  placeholder,
  description,
}: ChatInputProps) {
  return (
    <form action={action}>
      <div className="sticky bottom-0 left-0 flex w-full bg-white">
        <div className="flex w-full items-end gap-4">
          <div className="flex w-full flex-grow flex-col justify-end">
            <text className="text-muted-foreground mb-1 text-sm text-gray-400">
              {description}
            </text>
            <TextareaAutosize
              className="box-border w-full grow resize-none overflow-hidden rounded-sm border-primary p-2 font-inter text-sm text-darkprim caret-primary outline-0 transition-all duration-75 focus:ring-2 focus:ring-primary"
              placeholder={placeholder}
              name="userInput"
            ></TextareaAutosize>
          </div>
          <button
            type="submit"
            className="group rounded-sm border-none bg-primary px-4 py-2 text-sm transition-all hover:bg-secondary active:bg-primary"
          >
            <text className="text-white group-hover:text-darkprim">Send</text>
          </button>
        </div>
      </div>
    </form>
  );
}
