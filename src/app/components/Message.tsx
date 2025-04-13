import {useEffect, useRef, useState} from "react";

type MessageProps = {
    message: string;
    timestamp: number;
    name: string;
    image: string|undefined;
};

export const Message = ({ message, timestamp, name, image }: MessageProps) => {
    const date = new Date(timestamp);
    const [formattedDate, setFormattedDate] = useState(getRelativeTime(date));
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    function getRelativeTime(time: Date) {
        const now = new Date();
        const diff = Math.floor((now.getTime() - time.getTime()) / 1000);

        if (diff < 60) return `${diff} seconds ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;

        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);

        const isYesterday =
            time.getDate() === yesterday.getDate() &&
            time.getMonth() === yesterday.getMonth() &&
            time.getFullYear() === yesterday.getFullYear();

        if (isYesterday) {
            return `Yesterday at ${time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
        }

        return time.toLocaleDateString() + " at " + time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }


    // Setup IntersectionObserver
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    // Update time every second only if visible
    useEffect(() => {
        if (!isVisible) return;

        setFormattedDate(getRelativeTime(date));
        const interval = setInterval(() => {
            setFormattedDate(getRelativeTime(date));
        }, 1000);

        return () => clearInterval(interval);
    }, [isVisible, timestamp]); // No need to include date (static)
    return (
        <div
            ref={ref}
            className={`w-full flex flex-col p-4 transition-colors duration-200 ${
                isHovered ? "bg-white/10" : "bg-white/0"
            }`}
            onMouseEnter={() => {setIsHovered(true)}}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-row items-top space-x-3">
                <img className="w-12 h-12 object-cover rounded-full" src={image} alt="User" />
                <div className="flex flex-col w-full text-white">
                    <div className="flex flex-row gap-2">
                        <h1 className="font-bold">{name}</h1>
                        <span className="text-sm text-gray-400 mt-1 min-h-[1rem]">
                            {formattedDate}
                        </span>
                    </div>
                    <p className="break-words w-full">{message}</p>
                </div>
                {/*<button*/}
                {/*    className="bg-white text-black w-10 h-10 rounded-xl relative top-0 cursor-pointer opacity-0 transition-opacity duration-200"*/}
                {/*    style={{ opacity: isHovered ? 1 : 0 }}*/}
                {/*>*/}
                {/*    ...*/}
                {/*</button>*/}
            </div>
        </div>
    );
};
