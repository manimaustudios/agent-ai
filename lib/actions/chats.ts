"use server";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Chat {
  name: string;
  type: string;
  prompt: string;
  chatId: string;
  imgUrl: string;
}

export async function getAllChats(): Promise<Chat[]> {
  const chatsCollectionRef = collection(db, "chats");
  const chats: Chat[] = [];

  try {
    const querySnapshot = await getDocs(chatsCollectionRef);

    querySnapshot.forEach((doc) => {
      const chatData = doc.data() as Chat;
      chats.push({
        ...chatData,
        chatId: doc.id, // Add the document ID as chatId
      });
    });
  } catch (error) {
    console.log("Error fetching chats:", error);
  }

  return chats;
}
