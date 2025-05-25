import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    // Generate a cryptographically secure random string (plain token)
    const token = crypto.randomBytes(32).toString('hex'); // Generates a 64-character hex string

    // const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    console.log("MAIL", userId);
    console.log("EMAIL TYPE", emailType);
    console.log(typeof emailType);

    if (emailType === "VERIFY") {
      console.log("VERIFY SECTION");

      const updatedUser = await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: token,
          verifyTokenExpiry: new Date(Date.now() + 3600000) // Expiry 1 hour from now
        },
        // Optional: clear out password reset tokens if they exist
        $unset: {
          forgotPasswordToken: "",
          forgotPasswordTokenExpiry: ""
        }
      }, { new: true }); // { new: true } returns the updated document
      console.log("Updated User for VERIFY", updatedUser);

    } else if (emailType === "RESET") {
      // For reset, you might still want to hash the token if you compare hashes later.
      // If you plan to lookup directly, use a plain token here too.
      // For now, I'll keep your original bcrypt logic for reset, assuming you'll compare it.
      const hashedPasswordForReset = await bcryptjs.hash(token, 10); // Hash the generated token for reset

      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedPasswordForReset,
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
        // Email Link: Send the PLAIN random token in the URL
      html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${token}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"} or copy and paste the link below in your browser.
      <br> ${process.env.DOMAIN}/verifyemail?token=${token}
      </p>`
    };

    const mailResponse = await transport.sendMail(mailOptions);
    console.log(mailResponse);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
