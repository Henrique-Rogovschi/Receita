import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
     apiKey: "AIzaSyB5kt5aPAjuPoNxxjEXSMJN_oR7rx47DPw",
  authDomain: "receita-88f2d.firebaseapp.com",
  projectId: "receita-88f2d",
  appId: "1:265461592019:web:d09609cb0a1f2be7ffc926",
};

let cache = null;

export function getFirebase() {
  if (cache) return cache;
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  cache = { auth: getAuth(app), db: getFirestore(app), provider: new GoogleAuthProvider() };
  return cache;
}

export const ALLOWED_EMAILS = ["henriquejrogovschi@gmail.com", "gabrielatamirisrc@gmail.com"];
