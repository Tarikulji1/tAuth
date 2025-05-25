import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    console.log("MAIL", userId);
    console.log("EMAIL TYPE", emailType);
    console.log(typeof emailType);

    if (emailType === "VERIFY") {
      console.log("VERIFY SECTION");

      const updatedUser = await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: new Date(Date.now() + 3600000)} // Expiry 1 hour from now
      });
      console.log("Updated User for VERIFY", updatedUser);

    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: new Date(Date.now() + 3600000)} // Expiry 1 hour from now
      });
    }
console.log("Out side if else");

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.USER, // env
        pass: process.env.PASS, // env
      },
    });

    const mailOptions = {
      from: "tarikul@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"} or copy and paste the link below in your browser.
      <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
      </p>`
    };

    const mailResponse = await transport.sendMail(mailOptions);
    console.log(mailResponse);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
