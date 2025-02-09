import express from "express";
import { Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

const users: Record<string, number> = {};

const initializeUser = (stdID: string) => {
    if (!users[stdID]) {
        users[stdID] = 1000;
    }
};

app.post("/payment", (req: Request,res:Response) => {
    try {
        const { stdID, amount } = req.body;
        
        if (!stdID || !amount || amount <= 0) {
            return res.status(400).json({
                status: "400",
                msg: "ข้อมูลคำขอไม่ถูกต้อง"
            });
        }
        
        initializeUser(stdID);
        const pointsEarned = Math.floor(amount / 100) * 10;
        users[stdID] += pointsEarned;
        
        res.status(200).json({
            status: "200",
            msg: "สะสมแต้มสำเร็จ",
            data: {
                stdID,
                amount,
                pointsEarned,
                totalPoints: users[stdID]
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "500",
            msg: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
            error: error instanceof Error ? error.message : "ข้อผิดพลาดที่ไม่รู้จัก"
        });
    }
});

app.get("/points/:stdID", (req: Request, res: Response) => {
    try {
        const { stdID } = req.params;
        
        if (!stdID) {
            return res.status(400).json({
                status: "400",
                msg: "กรุณาระบุรหัสนักศึกษา"
            });
        }
        
        initializeUser(stdID);
        
        res.status(200).json({
            status: "200",
            msg: "ดึงข้อมูลแต้มสำเร็จ",
            data: {
                stdID,
                totalPoints: users[stdID]
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "500",
            msg: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
            error: error instanceof Error ? error.message : "ข้อผิดพลาดที่ไม่รู้จัก"
        });
    }
});

app.listen(3600, () => {
    console.log("Server is running on port 3600");
});