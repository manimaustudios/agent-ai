"use client";

import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { Button } from "./ui/button";
import { db } from "@/lib/firebase";
import { getUserDocument } from "@/lib/actions/users";

type CreateUserButtonProps = {
  userId: string | null;
};

function CreateUserButton({ userId }: CreateUserButtonProps) {
  const handleCreateUser = async () => {
    const userId = "TEST_ID_TWO"; // Replace with your actual userId from Logto

    try {
      await setDoc(doc(db, "users", userId), {
        email: "bbb@aaa.com",
        userId: userId,
      });
      console.log("User document created successfully.");
    } catch (error) {
      console.error("Error creating user document:", error);
    }
  };

  const handleGetUser = async () => {
    if (!userId) {
      console.error("User ID is missing.");
      return;
    }
    console.log("userId", userId);
    const data = await getUserDocument(userId);
    console.log("data", data);
  };

  return (
    <div>
      <Button onClick={() => handleGetUser()}>Get User</Button>
      <Button onClick={() => handleCreateUser()}>Create User</Button>
    </div>
  );
}

export default CreateUserButton;
