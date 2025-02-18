import { GoogleAuthProvider, signInWithRedirect, getAuth } from "firebase/auth";
import { auth } from "../config/firebase.config";
import { v4 as uuidv4 } from "uuid";
import { MdOutlineFeedback, MdOutlineSettings } from "react-icons/md";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const authInstance = getAuth();

  try {
    // Start the Google sign-in process
    await signInWithRedirect(authInstance, googleProvider);
  } catch (error) {
    console.error("Google sign-in error:", error);
  }
};

// Add a function to check if the user's email has the correct domain
const isFptEmail = (email) => {
  const emailParts = email.split("@");
  const domain = emailParts[1];
  return domain === "fpt.edu.vn";
};

// Override the default Google sign-in with a custom implementation
googleProvider.addScope("email");
googleProvider.addScope("profile");

googleProvider.setCustomParameters({
  login_hint: "user@example.com",
});

googleProvider.setCustomParameters({
  hd: "fpt.edu.vn", // Restrict sign-in to the specified domain
});

export const signInWithGoogleCustom = async () => {
  const authInstance = getAuth();

  try {
    const result = await signInWithRedirect(authInstance, googleProvider);
    // Access the user's email from the result object
    const userEmail = result.user.email;

    // Check if the email has the correct domain
    if (isFptEmail(userEmail)) {
      window.location.reload();
    } else {
      // If the email is not from the correct domain, sign the user out
      await auth.signOut();
      console.error(
        "Invalid email domain. Sign-in with fpt.edu.vn email only."
      );
    }
  } catch (error) {
    console.error("Google sign-in error:", error);
  }
};

export const signOutAction = async () => {
  await auth.signOut().then(() => {
    window.location.reload();
  });
};

export const Menus = [
  {
    id: uuidv4(),
    icon: <MdOutlineFeedback />,
    name: "Feedbacks",
    uri: "/feedback",
  },
  {
    id: uuidv4(),
    icon: <MdOutlineSettings />,
    name: "Settings",
    uri: "/setting/profile",
  },
];
