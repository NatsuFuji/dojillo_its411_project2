// firebase/auth.ts
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";


// Helper for registration
export const registerUser = async (email: string, password: string) => {
const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  return userCredential.user;
};
