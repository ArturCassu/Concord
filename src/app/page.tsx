'use client'

import {useEffect, useState} from "react";
import {UserGroup} from "@/app/components/UserGroup";
import {Conversation} from "@/app/components/Conversation";
import {ProfileModal} from "@/app/components/ProfileModal";
import {UserGroupModal} from "@/app/components/UserGroupModal";
import fallback from "@/app/assets/fallback.jpg"
import logo from "@/app/assets/logo.jpg"
import useWebSocket from "@/app/hooks/useWebSocket";


export default function Home() {


    const [user, setUser] = useState<User>({ id: "", name: "", image: undefined})
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            const randomId = `${Math.floor(100000 + Math.random() * 900000)}`;
            const newUser = { id: randomId, name: "", image: undefined };
            setUser(newUser);
            localStorage.setItem("user", JSON.stringify(newUser));
            setIsModalOpen(true);
        }
    }, [isModalOpen]);

    useEffect(() => {
        const storedGroups = localStorage.getItem("userGroups");
        if (storedGroups) {
            setUserGroups(JSON.parse(storedGroups));
        }
    }, []);

    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

    const [userGroups, setUserGroups] = useState<UserGroupData[]>([])

    useEffect(() => {
        localStorage.setItem("userGroups", JSON.stringify(userGroups));
    }, [userGroups]);

    const [conversation, setConversation] = useState<UserGroupData>()

    const handleCreateGroup = (groupName: string, userIds: string[]) => {
        const newGroup: UserGroupData = {
            id: `${Math.floor(100000 + Math.random() * 900000)}`,
            name: groupName,
            userIds,
            messages: [],
            unread: false,
        };
        setUserGroups(prev => [...prev, newGroup]);
    };

    function handleSave(name: string, image: string | undefined) {
        const updatedUser = { ...user, name, image: image || fallback.src };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    }



    const [editingGroup, setEditingGroup] = useState<UserGroupData | null>(null);

    const handleEditGroup = (group: UserGroupData) => {
        setEditingGroup(group);
        setIsGroupModalOpen(true);
    };

    const handleDeleteGroup = (groupId: string) => {
        setUserGroups(prev => prev.filter(g => g.id !== groupId));
        if (conversation?.id === groupId) {
            setConversation(undefined);
        }
    };

    const handleSaveGroup = (groupName: string, userIds: string[]) => {
        if (editingGroup) {
            setUserGroups(prev =>
                prev.map(group =>
                    group.id === editingGroup.id
                        ? { ...group, name: groupName, userIds }
                        : group
                )
            );
            setEditingGroup(null);
        } else {
            const newGroup: UserGroupData = {
                id: `${Math.floor(100000 + Math.random() * 900000)}`,
                name: groupName,
                userIds,
                messages: [],
                unread: false,
            };
            setUserGroups(prev => [...prev, newGroup]);
        }
    };


    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            const randomId = `${Math.floor(100000 + Math.random() * 900000)}`;
            const newUser = { id: randomId, name: "", image: undefined };
            setUser(newUser);
            localStorage.setItem("user", JSON.stringify(newUser));
            setIsModalOpen(true);
        }
    }, [isModalOpen]);

    useEffect(() => {
        const storedGroups = localStorage.getItem("userGroups");
        if (storedGroups) {
            setUserGroups(JSON.parse(storedGroups));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("userGroups", JSON.stringify(userGroups));
    }, [userGroups]);

    const handleSendMessage = (messageText: string, messageType: MessageType) => {
        if (!conversation) return;

        const newMessage: MessageData = {
            message: messageText,
            type: messageType,
            timestamp: Date.now(),
            name: user.name,
            image: user.image,
        };

        // Add the message to the current conversation's messages
        const updatedConversation = { ...conversation, messages: [...conversation.messages, newMessage] };
        setConversation(updatedConversation);

        // Send the updated conversation to the WebSocket server
        sendMessage({
            id: conversation.id,
            name: conversation.name,
            userIds: conversation.userIds,
            messages: updatedConversation.messages,
            unread: { [user.id]: 1 }, // Mark the user as having unread messages
        });
    };

    const handleIncomingMessage = (data: any) => {
        // Update the conversation when a message is received
        const updatedGroups = userGroups.map(group => {
            if (group.id === data.id) {
                return { ...group, messages: data.messages, unread: true };
            }
            return group;
        });
        setUserGroups(updatedGroups);

        // Update the current conversation
        if (conversation != null){
            if (conversation.id === data.id) {
                setConversation({ ...conversation, messages: data.messages });
            }
        }
    };

    const sendMessage = useWebSocket("https://concord-hsir.onrender.com/", handleIncomingMessage); // WebSocket hook to send and handle messages


    return (
        <div className="h-screen flex">
            <ProfileModal user={user} isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} onSave={handleSave}/>
            <UserGroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} onCreate={handleCreateGroup} onSave={handleSaveGroup} editingGroup={editingGroup}/>
            <aside className="w-1/4 flex flex-col h-full">
                <header className="flex-none h-16 w-full flex justify-between bg-white pl-7">
                    <img src={fallback.src} className="h-full"/>
                    <img src={logo.src}/>
                </header>
                <main className="p-5 bg-white flex flex-col items-center flex-grow overflow-y-auto">
                    {userGroups?.map((group) =>
                        (<UserGroup
                                key={group.id}
                                {...group}
                                lastMessage={group.messages[group.messages.length]}
                                selectedConversation={conversation?.id === group.id}
                                onclick={() => setConversation(group)}
                                onEdit={() => handleEditGroup(group)}
                                onDelete={() => handleDeleteGroup(group.id)}
                            />
                        )
                    )}
                </main>
                <footer className="flex flex-row justify-around items-center bg-white p-5">
                    <div className="flex flex-row gap-3">
                        <img className="w-12 h-12 object-cover rounded-full cursor-pointer  outline-1 outline-black" src={user.image}
                        onClick={()=>{setIsModalOpen(true)}} alt=""/>
                        <div className="flex flex-col">
                            <span className="text-black">{user.name}</span>
                            <span className="text-black">ID: #{user.id}</span>
                        </div>
                    </div>
                    <button
                    className="w-12 h-12 rounded-full bg-black cursor-pointer text-4xl"
                    onClick={() => setIsGroupModalOpen(true)}>+</button>
                </footer>
            </aside>
            <div className="w-3/4 h-full flex flex-col items-center justify-center">
                <Conversation {...conversation} sendMessage={handleSendMessage} isModalOpen={isModalOpen||isGroupModalOpen}/>
            </div>
        </div>
    );
}
