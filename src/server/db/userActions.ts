"use server"
import { clerkClient } from "@clerk/nextjs/server";
import { InfoModel, UserInfo } from "~/app/models";


export async function getUserbyUsername(username: string) {
  const { data, totalCount } = await clerkClient().users.getUserList({
    query: username,
  });

  const user = data.find((user) => user.username === username);

  if (!user) {
    return null;
  }

  const userInfoModel: UserInfo = {
    username: user.username,
    fullName: user.fullName,
    imageUrl: user.imageUrl,
  };

  const result = {
    id: user.id,
    infoModel: userInfoModel
  }

  return result;
};
