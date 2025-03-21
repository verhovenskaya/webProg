const express = require('express');
const router = express.Router();
const Event = require('../model/event'); 
const User = require('../model/user'); 
const checkEventLimit = require('../middleware/eventLimit'); 


/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Управление мероприятиями
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     tags: [Events]
 *     summary: Получить все мероприятия
 *     responses:
 *       200:
 *         description: Успешный запрос
 *       500:
 *         description: Ошибка сервера
 */

// Получение всех мероприятий
router.get('/events', async (req, res) => {
    try {
        const events = await Event.findAll({
            include: [{ model: User, as: 'creator', attributes: ['name', 'email'] }], 
        });
        res.json(events);
    } catch (err) {
        console.error("Ошибка при получении событий:", err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     tags: [Events]
 *     summary: Получить мероприятие по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Успешный запрос
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка сервера
 */

// Получение одного мероприятия по ID
router.get('/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findByPk(id, {
            include: [{ model: User, as: 'creator', attributes: ['name', 'email'] }], // Добавлено для получения данных пользователя
        });
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Событие не найдено' });
        }
    } catch (err) {
        console.error("Ошибка при получении события:", err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

/**
 * @swagger
 * /api/events:
 *   post:
 *     tags: [Events]
 *     summary: Создать мероприятие
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *               - createdby
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               createdby:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Мероприятие создано
 *       400:
 *         description: Неверные данные
 *       429:
 *         description: Превышен лимит создания мероприятий
 *       500:
 *         description: Ошибка сервера
 */

// Создание мероприятия
/*router.post('/events', async (req, res) => {
    try {
        const { title, description, date, location, createdby } = req.body;

        if (!title || !date || !createdby) {
            return res.status(400).json({ message: 'Необходимо указать название, дату и создателя мероприятия' });
        }

        // Проверка, что location не пустая строка
        if (typeof location !== 'string' || location.trim() === '') {
            return res.status(400).json({ message: 'Поле Локация не может быть пустым' });
        }

        const event = await Event.create({ title, description, date, location, createdby });
        res.status(201).json(event);
    } catch (err) {
        console.error("Ошибка при создании события:", err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});*/
router.post('/events', checkEventLimit, async (req, res) => {
    try {
        const { title, description, date, location, createdby } = req.body;

        if (!title || !date || !createdby) {
            return res.status(400).json({ message: 'Необходимо указать название, дату и создателя мероприятия' });
        }

        // Проверка, что location не пустая строка
        if (typeof location !== 'string' || location.trim() === '') {
            return res.status(400).json({ message: 'Поле Локация не может быть пустым' });
        }

        const event = await Event.create({ title, description, date, location, createdby });
        res.status(201).json(event);
    } catch (err) {
        console.error("Ошибка при создании события:", err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     tags: [Events]
 *     summary: Обновить мероприятие
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               createdby:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Мероприятие обновлено
 *       400:
 *         description: Неверные данные
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка сервера
 */

// Обновление мероприятия
router.put('/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date, location, createdby } = req.body;

        // Поиск мероприятия
        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: 'Событие не найдено' });
        }

        // Обновление полей
        if (title) event.title = title;
        if (description) event.description = description;
        if (date) event.date = date;
        if (location) event.location = location; // Обновление локации
        if (createdby) event.createdby = createdby;

        // Сохранение изменений
        await event.save();
        res.json(event);
    } catch (err) {
        console.error("Ошибка при обновлении события:", err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     tags: [Events]
 *     summary: Удалить мероприятие
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Мероприятие удалено
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка сервера
 */

// Удаление мероприятия
router.delete('/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: 'Событие не найдено' });
        }

        await event.destroy();
        res.status(204).send();
    } catch (err) {
        console.error("Ошибка при удалении события:", err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

module.exports = router;