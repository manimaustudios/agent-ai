import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import { auth } from "@/lib/logto/auth";
import { db } from "@/lib/firebase";
import { ensureUserDocumentExists } from "@/lib/actions/users";

async function Page() {
  const { userId, userEmail, isAuthenticated } = await auth();

  if (!isAuthenticated || !userId || !userEmail) {
    console.error("User is not authenticated or missing user data.");
  }

  let userData = null;
  let welcomeMessage = "Hi, how are you today?";

  try {
    if (isAuthenticated && userId && userEmail) {
      userData = await ensureUserDocumentExists(userId, userEmail);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Handle the error, but still return the default structure
  }

  console.log("User data:", userData);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <Chat welcomeMessage={welcomeMessage} />
    </div>
  );
}

export default Page;
