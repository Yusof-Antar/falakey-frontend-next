'use client';
import { Challenge } from "./challenge";
import { Collection } from "./collection";
import { LeaderBoardUser } from "./leaderBoardUser";
import { Type } from "./type";

export interface HomeData {
  logo: {
    light?: string;
    dark?: string;
  };
  challenges: Challenge[];
  collections: Collection[];
  types: Type[];
  banner: {
    image?: string;
    author: {
      display_name?: string;
      username?: string;
    };
    position?: string;
  };
  social_media: {
    platform: string;
    icon: string;
    link: string;
  }[];
  leaderboard: LeaderBoardUser[];
}
