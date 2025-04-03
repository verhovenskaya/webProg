const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const dotenv = require("dotenv");

dotenv.config();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Успешная регистрация
 *       400:
 *         description: Ошибка валидации
 */
router.post("/register", async (req, res) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return res.status(400).json({ message: "Все поля обязательны" });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email уже используется" });
        }

        // Создаем пользователя - пароль автоматически хешируется в хуке beforeCreate
        const user = await User.create({ email, name, password });
        
        // Генерируем токен сразу после регистрации
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({ 
            message: "Регистрация успешна",
            token, // Отправляем токен клиенту
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error("Ошибка регистрации:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Авторизация пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       401:
 *         description: Неверные учетные данные
 */
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt for:', email); // Логируем email

    try {
        const user = await User.findOne({ 
            where: { email },
            attributes: ['id', 'email', 'name', 'password'] 
        });
        
        console.log('User found:', user ? 'Yes' : 'No'); // Логируем факт нахождения
        
        if (!user) {
            console.log('Reason: User not found');
            return res.status(401).json({ message: "Неверные учетные данные" });
        }

        //проверяем пароль
        console.log('Stored password hash:', user.password);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);
        
        if (!isMatch) {
            console.log('Reason: Password mismatch');
            return res.status(401).json({ message: "Неверные учетные данные" });
        }

        //генерируем токен
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log('Login successful. Token generated.');
        res.json({ token });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
    console.log('Input password:', `"${password}"`, 'Length:', password.length);
});

module.exports = router;