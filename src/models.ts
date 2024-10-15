// models.ts

export interface Message {
  _id: string;
  senderId: string;
  content: string;
  type: string; // 'img' or 'msg'
}

export interface Channel {
  _id: string; // MongoDB ObjectId as string
  channelName: string;
  groupId: string;
  messages?: Message[];
}

export interface Group {
  _id: string;
  groupName: string;
  admins: string[];
  members: string[];
  channels: string[]; // Array of channel IDs (strings)
}

export interface User {
  _id: string;
  username: string;
  email: string;
  password?: string; // Omit password when not needed
  roles: string[];
  groups: string[]; // Array of group IDs
}
