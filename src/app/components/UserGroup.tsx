import { MessageData } from "@/app/types";
import { useState } from "react";

type UserGroupProps = {
    name: string;
    unread: boolean;
    lastMessage: MessageData;
    onclick: () => void;
    selectedConversation: boolean;
    onEdit: () => void;
    onDelete: () => void;
};

export const UserGroup = ({
                              name,
                              unread,
                              lastMessage,
                              onclick,
                              selectedConversation,
                              onEdit,
                              onDelete,
                          }: UserGroupProps) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onClick={onclick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`w-full box-border mb-3 p-4 rounded-xl relative cursor-pointer transition-all duration-200 shadow-md ${
                selectedConversation ? "bg-red-500" : "bg-gray-100"
            } hover:shadow-lg`}
        >
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1 w-[85%]">
                    <h1 className="text-black font-semibold text-lg truncate">{name}</h1>
                    <p className="text-sm text-gray-600 truncate">
                        {lastMessage?.name && <span className="font-medium">{lastMessage.name}: </span>}
                        {lastMessage?.message || <i>No messages yet</i>}
                    </p>
                </div>

                {hovered && (
                    <div className="flex gap-1">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                            className="bg-yellow-400 text-black px-2 py-1 rounded hover:bg-yellow-500 text-xs cursor-pointer"
                        >
                            Edit
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {unread && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-[1px] rounded-full">
                    NEW
                </span>
            )}
        </div>
    );
};
