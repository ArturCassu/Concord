import React, { useState, useRef, useEffect } from "react";
import {UserGroupData} from "@/app/page";

type UserGroupModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (groupName: string, userIds: string[]) => void;
    onSave: (groupName: string, userIds: string[]) => void;
    editingGroup: UserGroupData|null;
};

export const UserGroupModal = ({ isOpen, onClose, onCreate, onSave, editingGroup}: UserGroupModalProps) => {
    const [groupName, setGroupName] = useState("");
    const [inputId, setInputId] = useState("");
    const [userIds, setUserIds] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (editingGroup) {
                setGroupName(editingGroup.name);
                setUserIds(editingGroup.userIds);
            } else {
                setGroupName("");
                setUserIds([]);
            }
            setInputId("");
        }
    }, [isOpen, editingGroup]);


    useEffect(() => {
        inputRef.current?.focus();
    }, [userIds]);

    if (!isOpen) return null;

    const handleAddId = () => {
        const trimmed = inputId.trim();
        if (trimmed && !userIds.includes(trimmed)) {
            setUserIds([...userIds, trimmed]);
        }
        setInputId("");
    };

    const handleRemoveId = (id: string) => {
        setUserIds(userIds.filter(uid => uid !== id));
    };

    const handleSubmit = () => {
        if (userIds.length > 0) {
            const finalName = groupName.trim() || `Group: ${userIds.map(id => `#${id}`).join(", ")}`;
            if (editingGroup) {
                onSave(finalName, userIds);
                onClose();
                return;
            }
            onCreate(finalName, userIds);
            onClose();
        }
    };



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4 text-black">Create New Group</h2>

                <label className="block mb-2 font-semibold text-sm text-gray-700">Group Name</label>
                <input
                    type="text"
                    className="w-full mb-4 p-2 border placeholder-gray-400 text-gray-700 border-gray-300 rounded"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Group name"
                />

                <label className="block mb-2 font-semibold text-sm text-gray-700">User IDs</label>
                <div className="flex gap-2 mb-4 flex-wrap">
                    {userIds.map((id) => (
                        <div key={id} className="flex items-center bg-gray-200 px-2 py-1 rounded-full">
                            <span className="mr-2 text-sm text-gray-800">#{id}</span>
                            <button onClick={() => handleRemoveId(id)} className="text-red-500 font-bold cursor-pointer">×</button>
                        </div>
                    ))}
                </div>

                <input
                    ref={inputRef}
                    type="number"
                    className="w-full mb-4 p-2 border border-gray-300 placeholder-gray-400 text-gray-700 rounded [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="Type ID and press Enter"
                    value={inputId}
                    onChange={(e) => {
                        if (e.target.value.length > 6) {
                            e.target.value = e.target.value.slice(0,6);
                        }
                        setInputId(e.target.value)}
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && inputId.length == 6) {
                            e.preventDefault();
                            handleAddId();
                        }
                    }}
                />

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                        disabled={userIds.length === 0}
                    >
                        {editingGroup ? "Save" : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
};
