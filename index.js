const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const database_user = process.env.DATABASE_USER;
const database_password = process.env.DATABASE_PASSWORD;

// เชื่อมต่อ MongoDB Atlas
mongoose.connect(`mongodb+srv://${database_user}:${database_password}@cluster0.nsd5g.mongodb.net/?retryWrites=true&w=majority`, {})
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.log(err));

// สร้าง Schema สำหรับการเก็บจำนวนการ์ดที่สุ่มทั้งหมด
const totalDrawsSchema = new mongoose.Schema({
  totalCardsDrawn: { type: Number, default: 0 },
});

// สร้าง Schema สำหรับคำถามและคำตอบ
const tarotResponseSchema = new mongoose.Schema({
  cards: {
    name_short: String,
    isReversed: Boolean,
  },
  userId: String,
  question: String,
  answer: String,
  timestamp: { type: Date, default: Date.now },
});

// สร้าง Model
const TotalDraws = mongoose.model('TotalDraws', totalDrawsSchema);
const TarotResponse = mongoose.model('TarotResponse', tarotResponseSchema);

// Route สำหรับ root path
app.get('/', (req, res) => {
  res.send('Welcome to the Astral Oracle API!');
});

// ดึงข้อมูลคำถามและคำตอบทั้งหมด
app.get('/draw-card', async (req, res) => {
  const responses = await TotalDraws.find();
  res.json(responses);
});

// อัพเดทจำนวนการ์ดที่หยิบ
app.put('/draw-card', async (req, res) => {
  const { count } = req.body;

  let totalDraws = await TotalDraws.findOne();
  if (!totalDraws) {
    totalDraws = new TotalDraws();
  }
  totalDraws.totalCardsDrawn += count;
  await totalDraws.save();

  res.json({
    message: `${count} cards drawn.`,
    totalCardsDrawn: totalDraws.totalCardsDrawn
  });
});

// บันทึกคำถามและคำตอบ โดยเก็บ userId ด้วย
app.post('/tarot-response', async (req, res) => {
  const { userId, cards, question, answer } = req.body;

  const newResponse = new TarotResponse({ userId, cards, question, answer });
  await newResponse.save();

  res.json({ message: 'Tarot question and answer saved' });
});

// ลบข้อมูลคำถามและคำตอบด้วย `userId` ของผู้ใช้ 
app.delete('/delete-tarot-responses/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
      await TarotResponse.deleteMany({ userId });
      res.json({ message: `All tarot responses for user ${userId} deleted` });
  } catch (error) {
      console.error('Error deleting tarot responses:', error);
      res.status(500).json({ message: 'Error deleting tarot responses' });
  }
});


// ตั้งค่าให้ Server รันที่พอร์ต 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
