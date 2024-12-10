const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const collection = require("./mongodb");
const nodemailer = require("nodemailer");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // This tells multer to store files in the "uploads" folder

const { exec } = require('child_process');



const templatePath = path.join(__dirname, '../templates');
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "vanamgatoj@gmail.com",
        pass: "ejmr snmv guar zqsa"
    }
});

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});
app.get('/profile', (req, res) => {
    res.render("profile");
});


app.post("/register", async (req, res) => {
    const data = {
        email: req.body.email.toLowerCase().trim(),
        password: req.body.password
    };
    await collection.insertMany([data]);
    res.render("login");
});
app.get('/login', (req, res) => {
    res.render("home");
});
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email.toLowerCase().trim();
        const check = await collection.findOne({ email: email });
        if (!check) {
            res.send("Email not found");
        } else if (check.password === req.body.password) {
            res.render("home");
        } else {
            res.send("Wrong Password");
        }
    } catch (error) {
        console.error("Error during login: ", error);
        res.send("An error occurred while processing your request");
    }
});

app.get("/forgot-password", (req, res) => {
    res.render("forgot-password");
});

app.post("/forgot-password", async (req, res) => {
    const email = req.body.email.toLowerCase().trim();
    const user = await collection.findOne({ email: email });

    if (!user) {
        return res.send("Email not found");
    }

    const resetToken = Math.random().toString(36).substr(2);
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    console.log(`Reset Link: ${resetLink}`);

    const mailOptions = {
        from: "vanamgatoj@gmail.com",
        to: email, // Dynamically set recipient email
        subject: "Password Reset Request",
        text: `You requested a password reset. Click the link to reset your password: ${resetLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
            return res.send("Error sending email");
        }
        console.log("Email sent: " + info.response);
        res.send("Password reset link sent to your email.");
    });
});


// Configure Handlebars
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../templates"));

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));
app.post("/reset-password/:token", async (req, res) => {
    const { email, newPassword } = req.body;
    await collection.updateOne({ email: email }, { $set: { password: newPassword } });
    res.send("Password has been reset successfully. You can now log in.");
});
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../templates"));

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// Configure Multer for file uploads

// Routes
app.get("/login", (req, res) => {
    res.render("home");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
app.use(express.static('public'));


app.post('/convert', upload.single('pdf'), (req, res) => {
    const pdfPath = req.file.path;
    const outputAudio = `output_${Date.now()}.mp3`;

    // Python script execution
    const { exec } = require('child_process');
    exec(`"C:\Users\vanam\AppData\Local\Programs\Python\Python312\Scripts\;%SystemRoot%\system32;%SystemRoot%;%SystemRoot%\System32\Wbem;%SYSTEMROOT%\System32\WindowsPowerShell\v1.0\;%SYSTEMROOT%\System32\OpenSSH\;C:\Program Files\nodejs\;C:\Program Files\Git\cmd;" app.py ${pdf_path} ${audio_path}`, (err, stdout, stderr) => {
        if (err) {
            console.error("Error:", stderr);
            return res.status(500).send('Error processing the file.');
        }
        res.download(outputAudio, outputAudio);
    });
    

        // Send the audio file to the user
        return res.download(outputAudio, outputAudio, () => {
            const fs = require('fs');
            fs.unlinkSync(pdfPath); // Cleanup: remove uploaded PDF
            fs.unlinkSync(outputAudio); // Cleanup: remove generated audio file
        });
    });






