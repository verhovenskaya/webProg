const express = require('express');
const router = express.Router();
const Event = require('../model/event'); 
const User = require('../model/user'); 

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

// Создание мероприятия
router.post('/events', async (req, res) => {
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