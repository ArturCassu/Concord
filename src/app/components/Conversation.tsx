import {MessageData, MessageType} from "@/app/page";
import {Message} from "@/app/components/Message";
import {useEffect, useRef, useState} from "react";

type ConversationProps = {
    name?: string;
    messages?: MessageData[];
    sendMessage?: (message: string, messageType: MessageType) => void;
    isModalOpen: boolean;
};

export const Conversation = ({ name, messages, sendMessage, isModalOpen }: ConversationProps) => {
    const [messageText, setMessageText] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    function handleSend(messageText: string) {
        if (messageText.trim() !== "" && sendMessage) {
            console.log(messageText)
            sendMessage(messageText, MessageType.USER);
            setMessageText("");
        }
    }

    useEffect(() => {
        const handleGlobalTyping = (e: KeyboardEvent) => {
            if (isModalOpen) return;
            if (!messages) return; // Ignore if no conversation is selected
            if (document.activeElement === inputRef.current) return; // Ignore if already focused

            const isTypingKey = e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
            const isBackspace = e.key === "Backspace";
            const isEnter = e.key === "Enter";

            if (isTypingKey || isBackspace || isEnter) {
                inputRef.current?.focus(); // Focus the input automatically
            }

            if (isTypingKey) {
                setMessageText((prev) => prev + e.key);
                return;
            }
            if (isBackspace) {
                setMessageText((prev) => prev.slice(0, -1));
                return;
            }
            if (isEnter && !e.shiftKey) {
                e.preventDefault();
                handleSend(messageText)
                return;
            }
        };

        window.addEventListener("keydown", handleGlobalTyping);
        return () => window.removeEventListener("keydown", handleGlobalTyping);
    }, [messageText, sendMessage, messages, isModalOpen]);

    const handleInputSize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.target.style.height = "auto"; // Reset height

        const lineHeight = parseInt(window.getComputedStyle(e.target).lineHeight, 10) || 20; // Default to 20px if not found
        const maxHeight = lineHeight * 4; // Maximum height for 3 lines

        if (e.target.scrollHeight < maxHeight) {
            e.target.style.height = `${e.target.scrollHeight}px`; // Expand dynamically
            e.target.style.overflowY = "hidden";
        } else {
            e.target.style.height = `${maxHeight}px`; // Lock at 3 lines
            e.target.style.overflowY = "auto"; // Enable scrolling
            e.target.scrollTop = e.target.scrollHeight;
        }

        setMessageText(e.target.value);
    }

    return (
        <>
            <header className="flex-none h-16 w-full flex items-center pl-10 bg-red-500">
                {name || "No Conversation Selected"}
            </header>

            <main className="flex-grow w-full flex flex-col-reverse overflow-y-auto">
                {messages ? (
                    messages.slice().reverse().map((message, index) => (
                        <Message key={index} {...message} />
                    ))
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                        No conversation selected
                    </div>
                )}
                <div ref={bottomRef} />
            </main>

            <footer className="w-full flex p-5 box-border bg-red-500">
                <textarea
                    ref={inputRef}
                    className="w-full mr-5 min-h-[1/10] max-h-[3/10] p-2 bg-white text-black border rounded resize-none outline-none focus:ring-0"
                    rows={1}
                    value={messageText}
                    disabled={!messages}
                    placeholder={messages ? "Type a message..." : "No conversation selected"}
                    onInput={handleInputSize}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend(messageText);
                        }
                    }}
                />
                <button
                    className="w-10 h-10 rounded-full bg-black cursor-pointer disabled:opacity-50"
                    onClick={() => handleSend(messageText)}
                    disabled={!messages} // Disable button if no conversation
                >
                    &gt;
                </button>
            </footer>
        </>
    );
};
