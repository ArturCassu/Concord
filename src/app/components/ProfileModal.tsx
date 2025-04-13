import React, { useState, useEffect } from "react";
import { User } from "@/app/page";
import fallback from "@/app/assets/fallback.jpg";

type ProfileModalProps = {
    user: User;
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, photoUrl: string | undefined) => void;
};

export const ProfileModal = ({ user, isOpen, onClose, onSave }: ProfileModalProps) => {
    const [name, setName] = useState("");
    const [photoUrl, setPhotoUrl] = useState<string>(fallback.src);

    // Sync name/photoUrl with user when modal opens
    useEffect(() => {
        if (isOpen) {
            setName(user.name || `User#${user.id}`);
            setPhotoUrl(user.image || fallback.src);
        }
    }, [isOpen, user]);

    // Disable background scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    // Validate image fallback
    useEffect(() => {
        const img = new Image();
        img.src = photoUrl;
        img.onerror = () => setPhotoUrl(fallback.src);
    }, [photoUrl]);

    const handleSubmit = () => {
        if (name.trim()) {
            onSave(name.trim(), photoUrl.trim() || fallback.src);
            onClose();
        }
    };

    if (!isOpen) return <></>; // Only render an empty fragment when closed

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-100">
            <div
                className="bg-white p-6 rounded-xl shadow-xl max-w-xl w-full z-50"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold mb-4 text-black">Profile</h2>
                <h3 className="mb-4 text-sm font-bold text-gray-700">ID: #{user.id}</h3>

                <div className="flex items-start gap-4">
                    <div className="flex-grow">
                        <label className="block mb-2 text-sm font-bold text-gray-700">Name</label>
                        <input
                            type="text"
                            className="w-full mb-4 p-2 border border-gray-300 rounded placeholder-gray-400 text-gray-700"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                        />
                        <label className="block mb-2 text-sm font-bold text-gray-700">Profile Picture</label>
                        <div className="flex flex-row items-center">
                            <div className="flex justify-center items-center mr-5">
                                <img
                                    src={photoUrl}
                                    alt="Preview"
                                    className="w-24 h-24 object-cover rounded-full border"
                                />
                            </div>
                            <div className="flex-grow mr-5">
                                <label className="block mb-2 text-sm font-bold text-gray-700">URL</label>
                                <input
                                    type="url"
                                    className="w-full mb-4 p-2 border border-gray-300 rounded placeholder-gray-400 text-gray-700"
                                    onChange={(e) => setPhotoUrl(e.target.value || fallback.src)}
                                    placeholder="https://example.com/photo.jpg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                        onClick={handleSubmit}
                        disabled={!name.trim()}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};
