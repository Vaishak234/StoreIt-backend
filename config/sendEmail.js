import { Resend } from 'resend';
import dotenv from 'dotenv'

dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY);


export const sendEmail = async({ to, subject, html }) => {
    try {
          const { data, error } = await resend.emails.send({
          from: 'StoreIt <onboarding@resend.dev>',
          to: to,
          subject: subject,
          html: html,
          })
        if (error) return 
    
        return data

    } catch (error) {
        throw error
        
    }
}

