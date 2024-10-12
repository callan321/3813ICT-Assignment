export interface Channel {
  channelId: string;
  channelName: string;
  groupId: string;
  messages: any[];
}

export interface Group {
  _id: string;
  groupName: string;
  admins: string[];
  members: string[];
  channels: Channel[];
}
