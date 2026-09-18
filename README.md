# Yateem TV

หน้าเว็บรวมของช่อง **Yateem TV** — ดูไลฟ์สด, แชทสด + ตัวนับผู้ชม, รวมโซเชียลของช่อง,
เข้าร้าน **Yateem Market**, และ **ร่วมบริจาค** ได้ในหน้าเดียว

- static site (ไฟล์เดียว `index.html`) — โฮสต์บน **GitHub Pages**
- ดีไซน์: Netflix × Apple Vision Pro (spatial / glass) โทนมืด
- แยกจาก Apps Script / `Code.gs` ของ Yateem Market โดยสิ้นเชิง (ไม่ยุ่งกับหลังบ้านเดิม)

---

## 0. โลโก้

วางไฟล์โลโก้ช่อง (สามนิ้วทอง–พื้นน้ำเงิน) ไว้ที่ **`YATEEM TV/logo.png`**
— ควรเป็น PNG พื้นโปร่ง (transparent) สี่เหลี่ยมจัตุรัส เช่น 512×512 เพื่อให้ตัดเป็นวงกลมสวย
ถ้ายังไม่มีไฟล์ หน้าเว็บจะใช้ `icon.jpg` แทนชั่วคราวโดยอัตโนมัติ

## 1. ตั้งค่า (แก้บล็อก `CONFIG` ใน `index.html`)

| ค่า | ใส่อะไร |
|---|---|
| `streamUrl` | **URL สตรีม `.m3u8` (HLS)** ของช่อง — *จำเป็น* ถ้าเว้นว่างจะขึ้น "ยังไม่มีการถ่ายทอดสด" |
| `social.*` | ลิงก์ YouTube / Facebook / TikTok / Instagram / LINE OA (อันไหนไม่ใส่จะซ่อนการ์ดนั้น) |
| `market.web` | URL GitHub Pages ของ Yateem Market (เปิดตอนไม่ได้อยู่ใน LINE) |
| `donate.promptpayId` | เบอร์พร้อมเพย์ `0812345678` หรือเลขบัตร ปชช. — ใส่แล้วจะสร้าง **QR ระบุยอดเงินได้** |
| `donate.qrImageUrl` | รูป QR พร้อมเพย์แบบคงที่ (ใช้แทนถ้าไม่ใส่ `promptpayId`) |
| `donate.bankName / accountName / accountNumber` | ข้อมูลบัญชีที่โชว์ + ปุ่มคัดลอก |
| `firebase.*` | ค่า config จาก Firebase (ดูข้อ 2) — ปลอดภัยที่จะ commit |
| `chat.roomId` | เปลี่ยนเพื่อเริ่มห้องแชทใหม่สำหรับไลฟ์ครั้งถัดไป |
| `chat.badWords` | รายการคำต้องห้าม (เติมได้) |

> **บัญชีบริจาค** ใช้บัญชีเดียวกับ Yateem Market หรือบัญชีการกุศลแยก ก็แค่กรอกใน `donate` — ไม่ผูกกับหลังบ้านร้าน

## 2. ตั้งค่า Firebase (สำหรับแชทสด + ตัวนับผู้ชม) — ทำครั้งเดียว

1. สร้างโปรเจกต์ที่ https://console.firebase.google.com
2. **Build → Authentication → Sign-in method → เปิด Anonymous**
3. **Build → Realtime Database → Create Database** (เลือกโซนใกล้ไทย เช่น `asia-southeast1`)
4. แท็บ **Rules** ของ Realtime Database → วางเนื้อหาจากไฟล์ [`database.rules.json`](database.rules.json) → **Publish**
5. **Project settings → General → Your apps → Web app** → คัดลอกค่า `apiKey`, `authDomain`,
   `databaseURL`, `projectId`, `appId` มาใส่ใน `CONFIG.firebase`
6. **บัญชีแอดมิน** (ใช้ทั้งลบแชท + แก้ลิงก์/ผังรายการ): สร้างบัญชี **Email/Password** ใน Authentication
   → ในฐานข้อมูลเพิ่ม node `/admins/<uid> = true` (เอา uid จากหน้า Authentication ของบัญชีนั้น)

> **โควตา:** แผนฟรี (Spark) จำกัด Realtime Database ที่ **~100 การเชื่อมต่อพร้อมกัน** (ผู้ชม 1 คน = 1)
> ถ้าคาดว่าคนดูสดพร้อมกันเกิน ~100 ให้เปิดแผน **Blaze** (จ่ายตามใช้ ราคาถูกที่ระดับนี้)

## 2.1 หน้าแอดมิน (แก้ลิงก์/บัญชี/วิดีโอ/ผังรายการ)

หลังตั้ง Firebase + บัญชีแอดมินแล้ว **ไม่ต้องแก้ `CONFIG` ในโค้ดอีก** — เข้าหน้าแอดมินเพื่อแก้ค่าที่เก็บใน
Firebase `/settings` และ `/schedule` แทน:

- เปิดเว็บด้วย `...index.html#admin` → ใส่อีเมล/รหัสแอดมิน → เปิดแผงแก้ไข (`#mod` = โหมดลบแชทอย่างเดียว)
- **แท็บ "ลิงก์":** **โลโก้เว็บ** (อัปโหลด/วาง URL), URL สตรีม `.m3u8`, โซเชียล 5 ช่อง, ลิงก์ Market,
  บัญชีบริจาค/QR, และ **วิดีโอแนะนำ** (วางลิงก์ YouTube — รองรับ `watch?v=`, `youtu.be`, `shorts`) → กด **บันทึก**
- **แท็บ "ธีม":** เลือกชุดสีสำเร็จจากโลโก้ (ทอง–น้ำเงินหลายแบบ) หรือปรับสีเอง (accent/accent2/พื้นหลัง)
  — พรีวิวสดทันที กด **บันทึกธีม**
- **แท็บ "ข้อความ":** แก้ข้อความ/ปุ่มทุกจุดบนหน้าเว็บ (หัวข้อ, ปุ่มบริจาค, ชื่อการ์ดโซเชียล, footer ฯลฯ)
  → กด **บันทึกข้อความ**
- **แท็บ "ผังรายการ":**
  - **แม่แบบรายสัปดาห์** — เลือกวัน (จ–อา) ใส่เวลา+ชื่อรายการ (วนซ้ำทุกสัปดาห์อัตโนมัติ)
  - **แก้เฉพาะวัน** — เลือกวันที่ (เดือน/ปีไหนก็ได้) ใส่รายการ หรือ **แนบรูป/PDF** ของวันนั้น
  - **ไฟล์ผังรวม** — แนบรูป/PDF ผังประจำสัปดาห์/เดือน/ปี
- ค่าที่บันทึกจะ **อัปเดตหน้าเว็บทุกเครื่องแบบเรียลไทม์** (ค่าใน `CONFIG` เป็นแค่ค่าเริ่มต้นสำรอง)

> **อัปโหลดรูป/PDF ผัง** ใช้ **Cloudinary** บัญชีเดิม (`CONFIG.cloudinary` = cloud `qk5q5cys` / preset
> `pjmfqmmf`). ถ้าอัป **PDF ไม่ผ่าน** แปลว่า preset unsigned ตัวนี้อนุญาตเฉพาะรูป — เข้า Cloudinary →
> Settings → Upload → แก้ preset ให้ resource type เป็น **Auto** (หรือสร้าง preset ใหม่แล้วใส่ใน `CONFIG.cloudinary.preset`)

## 3. Deploy (GitHub Pages)

```bash
cd "YATEEM TV"
git init
git add -A
git commit -m "Yateem TV: live + chat + social + donation"
gh repo create yateem1433-ui/yateem-tv --public --source=. --push
# เปิด GitHub Pages: Settings → Pages → Branch: main /(root)
```

เช็กสถานะ build:
```bash
gh api repos/yateem1433-ui/yateem-tv/pages --jq .status   # -> "built"
```

## 4. ทดสอบ

- เปิดหน้าเว็บ 2 แท็บ → ตัวนับผู้ชมควรขึ้น 2, ส่งข้อความแท็บนึงต้องเด้งอีกแท็บทันที
- ใส่ `streamUrl` จริง → เล่นได้; เว้นว่าง → ขึ้นสถานะ "ยังไม่มีการถ่ายทอดสด"
- กดบริจาค → QR ขึ้น, ปุ่มคัดลอกเลขบัญชีทำงาน; ถ้าใช้ QR ระบุยอด **ให้สแกนด้วยแอปธนาคารจริงยืนยันก่อน**
