import { resend } from "../lib/resend"
import VerificationEmail from "../../emails/VerificationEmil"
import { apiResponse } from "@/types/apiResponse"

export async function sendVerificationEmail(
    email : string,
    username : string,
    verifyCode : string
): Promise<apiResponse>{
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Surprise Feedback | Verification Code',
            react: VerificationEmail({username,otp : verifyCode}),
          });
        return {success : true, message : "Verification email send successfully"}
    } catch (emailError) {
        console.error("Error in sending verification Email", emailError)
        return {success : false, message : "Failed to send verification email"}
    }
}