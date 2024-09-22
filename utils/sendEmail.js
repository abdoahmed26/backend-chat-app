import nodemailer from "nodemailer"

const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port:465,
    secure: true,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
})

export const sendEmail = (name,email,code)=>{
    const option = {
        from: process.env.USER,
        to: email,
        subject: "Reset Password Comfirmation",
        html: 
        `<div>
            <h1>Hello ${name}</h1>
            <p style='padding: 10px; border-left: 2px solid gray; margin: 10px 0px;'>Your reset password code is ${code}</p>
            <p style='color: red;'>This code will expire in 5 minutes</p>
            <p>Thank you</p>
        </div>`
    }
    return transport.sendMail(option)
}