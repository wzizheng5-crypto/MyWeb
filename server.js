const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname)));

// 内存存储用户数据（演示用）
let users = [];

// 首页（注册页面）
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// 登录页面
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

// 注册功能
app.post("/register", (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // ===== 保留 4 个故意 BUG =====
    // BUG-01: username 空检查（这里保留，演示可以为空）
    // if (!username) return res.send("Username is required!"); // 注释掉演示 BUG

    if (!email) return res.send("Email is required!");
    if (!email.includes("@")) return res.send("Invalid email format!");

    if (!password) return res.send("Password is required!");
    // BUG-02: 密码长度逻辑错误
    if (password.length > 6) return res.send("Password must be at least 6 characters!");

    // BUG-03: confirmPassword 未验证
    // if (password !== confirmPassword) return res.send("Passwords do not match!");

    // BUG-04: 字段命名错误
    const newUser = { user: username, email, password };

    // 检查是否已经注册
    const existUser = users.find(u => u.user === username);
    if (existUser) return res.send("Username already exists. Please login.");

    users.push(newUser);
    console.log("User registered:", newUser);

    res.send(`Registration successful! You can now <a href="/login">login</a>.`);
});

// 登录功能
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username) return res.send("Username is required!");
    if (!password) return res.send("Password is required!");

    const foundUser = users.find(u => u.user === username && u.password === password);

    if (foundUser) {
        res.send(`Login successful! Welcome, ${username}`);
    } else {
        const existUser = users.find(u => u.user === username);
        if (existUser) {
            res.send("Incorrect password. Please try again.");
        } else {
            res.send("User not found. Please register first.");
        }
    }
});

// 监听端口（兼容线上平台环境变量）
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
