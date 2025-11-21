const pool = require('./mysql.js'); 
const { connectMail } = require("./nodemailer.js");

async function mailsend() {
    try {
        const [rows] = await pool.query("SELECT * FROM boys");

        const tableitems = rows
            .map(
                (el, index) => `
            <tr style = " text-align:center;">
                <td>${index + 1}</td>
                <td>${el.Name}</td>
            </tr>`
            )
            .join("");

        const transport = await connectMail();

        const msgtext = {
            from: `Remainder-App <${process.env.Email_id}>`,
            to: "21PA1a0278@VISHNU.EDU.IN",
            subject: "Un-completed tasks today",
            html: `
            <h4>Tasks you must complete before sleeping</h4>
            <table border="1" cellpadding="6" style="border-collapse: collapse; width: 100%;">
                <tr><th>#</th><th>Task</th></tr>
                ${tableitems}
            </table>
        `,
        };

        const info = await transport.sendMail(msgtext);
        console.log("Daily Email Sent:", info.response);
    } catch (err) {
        console.error("mailsend() error:", err);
    }
}

module.exports = mailsend;
