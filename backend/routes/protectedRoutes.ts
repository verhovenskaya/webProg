import express from "express";
const router = express.Router();
import passport from "passport";
import Event from "../model/event";
import checkEventLimit from "../middleware/eventLimit";

/**
 * @swagger
 * /api/events:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Events]
 *     summary: Создать мероприятие (требуется авторизация)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
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
 *     responses:
 *       201:
 *         description: Мероприятие создано
 *       401:
 *         description: Не авторизован
 *       400:
 *         description: Неверные данные
 *       500:
 *         description: Ошибка сервера
 */
router.post("/events", 
  passport.authenticate("jwt", { session: false }),
  checkEventLimit,
  async (req, res) => {
    try {
      const { title, description, date, location } = req.body;
      
      if (!title || !date) {
        return res.status(400).json({ message: 'Укажите название и дату' });
      }

      const event = await Event.create({ 
        title, 
        description, 
        date, 
        location,
        createdby: req.user.id
      });
      
      res.status(201).json(event);
    } catch (err) {
      console.error("Ошибка создания события:", err);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
);

export default router;