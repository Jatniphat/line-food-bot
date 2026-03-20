const express = require('express');
const line = require('@line/bot-sdk');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 1. ตั้งค่า LINE API ของคุณ
const config = {
  channelAccessToken: 'FfRQB0ytWAUE0ePBK0s/QLK86gv/Fm0gFgtLsO9n5sR+vEmAUmrHKtH3cFr+QUOxn3rUdy1a4Lih39xSsIfd/38S1kwDpx8Ya7S7DviB7dv2Y4NIXndvwv/Zvz/7yutf/c7NB6pdh3zQ7P3g6WqRkQdB04t89/1O/w1cDnyilFU=',
  channelSecret: '1e3fecef99aba8df326e7cc0515c018e'
};

// 2. ตั้งค่า Gemini API Key ของคุณ
const genAI = new GoogleGenerativeAI("AIzaSyCRqVhaWj_bL6a1XwRpaG0m5FYAaPvP1Fk"); 

const client = new line.Client(config);
const app = express();

// 3. ฐานข้อมูลอาหารชุดใหญ่ 20 เมนูของคุณ
const foodDatabase = [
  { name: "สเต็กเนื้อพรีเมียม", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?fm=jpg&w=800", nutrition: "พลังงาน: 650 kcal | โปรตีน: 45g | ไขมัน: 35g" },
  { name: "ผัดไทยกุ้งสด", image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?fm=jpg&w=800", nutrition: "พลังงาน: 450 kcal | โปรตีน: 15g | ไขมัน: 18g" },
  { name: "ข้าวผัดรวมมิตร", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?fm=jpg&w=800", nutrition: "พลังงาน: 500 kcal | โปรตีน: 15g | ไขมัน: 20g" },
  { name: "ซูชิเซ็ตพรีเมียม", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?fm=jpg&w=800", nutrition: "พลังงาน: 400 kcal | โปรตีน: 25g | ไขมัน: 8g" },
  { name: "ชีสเบอร์เกอร์", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?fm=jpg&w=800", nutrition: "พลังงาน: 700 kcal | โปรตีน: 30g | ไขมัน: 40g" },
  { name: "พิซซ่าหน้าเปปเปอโรนี", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?fm=jpg&w=800", nutrition: "พลังงาน: 850 kcal | โปรตีน: 35g | ไขมัน: 45g" },
  { name: "ราเมนทงคตสึ", image: "https://images.unsplash.com/photo-1552611052-33e04de081de?fm=jpg&w=800", nutrition: "พลังงาน: 600 kcal | โปรตีน: 25g | ไขมัน: 30g" },
  { name: "ส้มตำแซ่บๆ", image: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?fm=jpg&w=800", nutrition: "พลังงาน: 150 kcal | โปรตีน: 5g | ไขมัน: 5g" },
  { name: "แพนเค้กผลไม้รวม", image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?fm=jpg&w=800", nutrition: "พลังงาน: 450 kcal | โปรตีน: 10g | ไขมัน: 15g" },
  { name: "ข้าวมันไก่", image: "https://images.unsplash.com/photo-1626804475297-4160bbdf2481?fm=jpg&w=800", nutrition: "พลังงาน: 550 kcal | โปรตีน: 22g | ไขมัน: 20g" },
  { name: "ไก่ทอดกรอบ", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?fm=jpg&w=800", nutrition: "พลังงาน: 650 kcal | โปรตีน: 28g | ไขมัน: 45g" },
  { name: "ข้าวแกงกะหรี่ญี่ปุ่น", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?fm=jpg&w=800", nutrition: "พลังงาน: 750 kcal | โปรตีน: 20g | ไขมัน: 30g" },
  { name: "สปาเก็ตตี้คาโบนาร่า", image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?fm=jpg&w=800", nutrition: "พลังงาน: 680 kcal | โปรตีน: 22g | ไขมัน: 35g" },
  { name: "ติ่มซำร้อนๆ", image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?fm=jpg&w=800", nutrition: "พลังงาน: 300 kcal | โปรตีน: 18g | ไขมัน: 12g" },
  { name: "สลัดเพื่อสุขภาพ", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?fm=jpg&w=800", nutrition: "พลังงาน: 320 kcal | โปรตีน: 15g | ไขมัน: 12g" },
  { name: "ก๋วยเตี๋ยวเนื้อตุ๋น", image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?fm=jpg&w=800", nutrition: "พลังงาน: 420 kcal | โปรตีน: 30g | ไขมัน: 15g" },
  { name: "คลับแซนวิช", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?fm=jpg&w=800", nutrition: "พลังงาน: 450 kcal | โปรตีน: 18g | ไขมัน: 20g" },
  { name: "ชาบู หม้อไฟ", image: "https://images.unsplash.com/photo-1548943487-a2e4f43b4850?fm=jpg&w=800", nutrition: "พลังงาน: 500 kcal | โปรตีน: 40g | ไขมัน: 20g" },
  { name: "ไอศกรีมดับร้อน", image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?fm=jpg&w=800", nutrition: "พลังงาน: 250 kcal | โปรตีน: 4g | ไขมัน: 12g" },
  { name: "ครัวซองต์เนยสด", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?fm=jpg&w=800", nutrition: "พลังงาน: 350 kcal | โปรตีน: 6g | ไขมัน: 18g" }
];

// 4. ฟังก์ชัน AI วิเคราะห์ข้อความ (ของเพื่อน)
async function analyzeIntentWithAI(userText) {
  try {
    // ปรับรุ่น AI ให้เป็นรุ่นปัจจุบันที่เสถียรสำหรับงานแชทบอท
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
        คุณคือ AI ผู้ช่วยวิเคราะห์ความต้องการ (Intent) ของผู้ใช้งานสำหรับบอท LINE แนะนำอาหาร
        หน้าที่ของคุณคือ อ่านข้อความจากผู้ใช้ แล้ววิเคราะห์ว่าผู้ใช้กำลัง "หิว", "ถามหาของกิน", "ให้แนะนำร้านอาหาร", หรือ "อยากได้เมนูอาหาร" หรือไม่

        กฎการตอบ (สำคัญมาก):
        1. หากข้อความสื่อถึงเรื่องกินหรือความหิว (เช่น หิว, กินไรดี, ท้องร้อง, มีร้านเด็ดไหม, หาไรลงท้องหน่อย) ให้ตอบกลับมาแค่คำว่า "YES" เท่านั้น
        2. หากข้อความสื่อถึงเรื่องอื่นที่ไม่เกี่ยวข้องกัน (เช่น สวัสดี, ทำอะไรอยู่, อากาศดีจัง) ให้ตอบกลับมาแค่คำว่า "NO" เท่านั้น
        3. ห้ามพิมพ์อธิบาย ห้ามพิมพ์เครื่องหมายวรรคตอนใดๆ เพิ่มเติมเด็ดขาด ให้ตอบแค่ YES หรือ NO คำเดียวโดดๆ

        ข้อความจากผู้ใช้: "${userText}"
        `;
        
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim().toUpperCase();
    
    console.log(`🤖 AI อ่านข้อความ "${userText}" แล้วตอบว่า:`, responseText); 
    
    return responseText.includes("YES");
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return false;
  }
}

// 5. Webhook Endpoint
app.post('/webhook', line.middleware(config), async (req, res) => {
  try {
    const results = await Promise.all(req.body.events.map(handleEvent));
    res.json(results);
  } catch (err) {
    console.error("Webhook Error:", err);
    res.status(500).end();
  }
});

// 6. ฟังก์ชันจัดการข้อความหลัก (ผสานระบบ AI เข้ากับรูปแบบ Flex Message ของคุณ)
async function handleEvent(event) {
  if (event.type !== 'message') {
    return Promise.resolve(null);
  }

  const defaultReply = {
    type: 'text',
    text: 'ฉันไม่เข้าใจ'
  };

  // เช็คว่าถ้าเป็นข้อความตัวอักษร ให้ส่งไปให้ AI คิด
  if (event.message.type === 'text') {
    const userText = event.message.text.trim();
    
    // โยนข้อความให้ AI วิเคราะห์
    const wantsToEat = await analyzeIntentWithAI(userText);

    // ถ้า AI ตอบว่า YES (แปลว่าหิว)
    if (wantsToEat) {
      const randomFood = foodDatabase[Math.floor(Math.random() * foodDatabase.length)];
      
      const flexMessage = {
        type: 'flex',
        altText: `ลองเมนู ${randomFood.name} ไหม?`,
        contents: {
          type: "bubble",
          hero: {
            type: "image",
            url: randomFood.image,
            size: "full",
            aspectRatio: "20:13",
            aspectMode: "cover"
          },
          body: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [
              { type: "text", text: randomFood.name, weight: "bold", size: "xl", wrap: true },
              { type: "text", text: randomFood.nutrition, size: "sm", color: "#666666", wrap: true }
            ]
          }
        }
      };
      
      return client.replyMessage(event.replyToken, flexMessage);
    }
  }

  // ถ้าส่งรูป สติ๊กเกอร์ หรือ AI ตอบว่า NO (ไม่หิว)
  return client.replyMessage(event.replyToken, defaultReply);
}

// 7. ส่วนสำหรับ UptimeRobot และตั้งค่าเซิร์ฟเวอร์
app.get('/', (req, res) => {
  res.send('Bot is awake!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
