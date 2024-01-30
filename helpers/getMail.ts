const nodemailer = require('nodemailer');

// transporter function for connecting with the email to send messages
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "cinema.ticketing.system117@gmail.com",
        pass: process.env.PASS
    }
})

export // function to generate the code
async function mailVerification(req: Request, res: Response, receiver: String) {
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    // generating the message
    const message = {
        from: "cinema.ticketing.system117@gmail.com",
        to: receiver,
        subject: "Account Verification",
        text: `Your Verification Code is ${verificationCode}`
    }
    console.log(verificationCode);
    // sending the mail to the user
    try{
        await new Promise((resolve, reject) => {
            transporter.sendMail(message, function (err: any, info: any) {
                // Sending error message in case of any error    
                if (err) {
                    reject(err);
                } else {
                    resolve(info);
                }
            });
        });
    }catch(e){

    }
    

    return verificationCode.toString();
}
