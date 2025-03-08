import firebaseConfig from "../../../shared/firebaseConfig.js";
import { sendSignInLinkToEmail } from "firebase/auth";

const { auth } = firebaseConfig;


export const sendVerificationEmail = async (email, verificationUrl) => {
    try {
        const actionCodeSettings = {
            url: verificationUrl,
            handleCodeInApp: true,
            //dynamicLinkDomain: 'your-project-id.page.link'
        };
        
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        console.log("Verification email sent!");
        return { success: true, message: "Verification email sent!" };
    } catch (error) {
        console.error("Error sending email verification:", error);
        throw new Error("Failed to send verification email.");
    }
};
