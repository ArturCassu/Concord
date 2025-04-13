export type UserGroupData = {
    id: string;
    name: string;
    userIds: string[]
    messages: MessageData[]
    unread: boolean
}
export type MessageData = {
    message: string;
    type: MessageType;
    timestamp: number;
    name: string;
    image: string | undefined;
}

export enum MessageType {
    USER = "USER",
    SYSTEM = "SYSTEM",
}

export type User = {
    "id": string,
    "name": string,
    "image": string | undefined,
}