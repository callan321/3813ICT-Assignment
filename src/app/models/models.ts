export interface Message {
  _id: string;
  senderId: string;
  content: string;
  type: string; // 'img' or 'txt'
}

export interface Channel {
  _id: string;
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
  _id?: string;
  username: string;
  email: string;
  password: string;
  roles: string[];
  groups: string[]; // Array of group IDs
}
