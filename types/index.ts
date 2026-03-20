export interface Startup {
  id: string;
  startup_name: string;
  domain: string;
  funding_stage: string;
  description: string;
  founder_id: string;
  created_at: string;
}

export interface Message {
  message_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
}

export type UserRole = 'founder' | 'investor' | 'incubator';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  created_at: string;
}

export interface Pitch {
  id: string;
  videoId: string;
  startupName: string;
  tagline: string;
  incubator: string;
  verified: boolean;
  vouched: boolean;
  duration: string;
  industry: string;
  fundingStage: string;
  founderName: string;
  askAmount: string;
  thumbnail: string;
}

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Verification: { role: string; fullName: string };
  Dashboard: { userName: string; role: string };
};
