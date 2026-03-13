const express = require('express');
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: 'FfRQB0ytWAUE0ePBK0s/QLK86gv/Fm0gFgtLsO9n5sR+vEmAUmrHKtH3cFr+QUOxn3rUdy1a4Lih39xSsIfd/38S1kwDpx8Ya7S7DviB7dv2Y4NIXndvwv/Zvz/7yutf/c7NB6pdh3zQ7P3g6WqRkQdB04t89/1O/w1cDnyilFU=',
  channelSecret: '1e3fecef99aba8df326e7cc0515c018e'
};

const client = new line.Client(config);
const app = express();

const foodDatabase = [
  {
    name: "สเต็กเนื้อพรีเมียม",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?fm=jpg&w=800",
    nutrition: "พลังงาน: 650 kcal | โปรตีน: 45g | ไขมัน: 35g"
  },
  {
    name: "ผัดไทยกุ้งสด",
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?fm=jpg&w=800",
    nutrition: "พลังงาน: 450 kcal | โปรตีน: 15g | ไขมัน: 18g"
  },
  {
    name: "ข้าวผัดรวมมิตร",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?fm=jpg&w=800",
    nutrition: "พลังงาน: 500 kcal | โปรตีน: 15g | ไขมัน: 20g"
  },
  {
    name: "ซูชิเซ็ตพรีเมียม",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?fm=jpg&w=800",
    nutrition: "พลังงาน: 400 kcal | โปรตีน: 25g | ไขมัน: 8g"
  },
  {
    name: "ชีสเบอร์เกอร์",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?fm=jpg&w=800",
    nutrition: "พลังงาน: 700 kcal | โปรตีน: 30g | ไขมัน: 40g"
  },
  {
    name: "พิซซ่าหน้าเปปเปอโรนี",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?fm=jpg&w=800",
    nutrition: "พลังงาน: 850 kcal | โปรตีน: 35g | ไขมัน: 45g"
  },
  {
    name: "ราเมนทงคตสึ",
    image: "https://images.unsplash.com/photo-1552611052-33e04de081de?fm=jpg&w=800",
    nutrition: "พลังงาน: 600 kcal | โปรตีน: 25g | ไขมัน: 30g"
  },
  {
    name: "ส้มตำแซ่บๆ",
    image: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?fm=jpg&w=800",
    nutrition: "พลังงาน: 150 kcal | โปรตีน: 5g | ไขมัน: 5g"
  },
  {
    name: "แพนเค้กผลไม้รวม",
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?fm=jpg&w=800",
    nutrition: "พลังงาน: 450 kcal | โปรตีน: 10g | ไขมัน: 15g"
  },
  {
    name: "ข้าวมันไก่",
    image: "https://images.unsplash.com/photo-1626804475297-4160bbdf2481?fm=jpg&w=800",
    nutrition: "พลังงาน: 550 kcal | โปรตีน: 22g | ไขมัน: 20g"
  },
  {
    name: "ไก่ทอดกรอบ",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?fm=jpg&w=800",
    nutrition: "พลังงาน: 650 kcal | โปรตีน: 28g | ไขมัน: 45g"
  },
  {
    name: "ข้าวแกงกะหรี่ญี่ปุ่น",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?fm=jpg&w=800",
    nutrition: "พลังงาน: 750 kcal | โปรตีน: 20g | ไขมัน: 30g"
  },
  {
    name: "สปาเก็ตตี้คาโบนาร่า",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?fm=jpg&w=800",
    nutrition: "พลังงาน: 680 kcal | โปรตีน: 22g | ไขมัน: 35g"
  },
  {
    name: "ติ่มซำร้อนๆ",
    image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?fm=jpg&w=800",
    nutrition: "พลังงาน: 300 kcal | โปรตีน: 18g | ไขมัน: 12g"
  },
  {
    name: "สลัดเพื่อสุขภาพ",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?fm=jpg&w=800",
    nutrition: "พลังงาน: 320 kcal | โปรตีน: 15g | ไขมัน: 12g"
  },
  {
    name: "ก๋วยเตี๋ยวเนื้อตุ๋น",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?fm=jpg&w=800",
    nutrition: "พลังงาน: 420 kcal | โปรตีน: 30g | ไขมัน: 15g"
  },
  {
    name: "คลับแซนวิช",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?fm=jpg&w=800",
    nutrition: "พลังงาน: 450 kcal | โปรตีน: 18g | ไขมัน: 20g"
  },
  {
    name: "ชาบู หม้อไฟ",
    image: "https://images.unsplash.com/photo-1548943487-a2e4f43b4850?fm=jpg&w=800",
    nutrition: "พลังงาน: 500 kcal | โปรตีน: 40g | ไขมัน: 20g"
  },
  {
    name: "ไอศกรีมดับร้อน",
    image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?fm=jpg&w=800",
    nutrition: "พลังงาน: 250 kcal | โปรตีน: 4g | ไขมัน: 12g"
  },
  {
    name: "ครัวซองต์เนยสด",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?fm=jpg&w=800",
    nutrition: "พลังงาน: 350 kcal | โปรตีน: 6g | ไขมัน: 18g"
  }
];

// สร้าง Webhook Endpoint
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// ฟังก์ชันจัดการข้อความ
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const keywords = ["แนะนำร้านอาหาร", "กินอะไรดี", "หิวข้าว"];
  const userMessage = event.message.text.trim();

  if (keywords.includes(userMessage)) {
    // สุ่มเมนูอาหาร
    const randomFood = foodDatabase[Math.floor(Math.random() * foodDatabase.length)];
    
    // พิมพ์บอกในหน้าจอสีดำ (Terminal) ว่าสุ่มได้อะไร
    console.log(`🤖 กำลังสุ่มอาหาร... สุ่มได้เมนู: ${randomFood.name}`);
    
    // สร้าง Flex Message
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
  } else {
    // กรณีพิมพ์คำอื่นๆ
    console.log(`🤖 ผู้ใช้พิมพ์คำว่า: ${userMessage} (ไม่ตรงกับ Keyword)`);
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: 'ฉันไม่เข้าใจ'
    });
  }
}

const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('Bot is awake!');
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});