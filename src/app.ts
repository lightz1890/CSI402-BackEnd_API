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

interface PointsRequest {
    stdID: string;
    paymentAmount: number;
}

const defaultPoints = 1000; 

app.post("/api/payment", (req: Request, res: Response) => {
    try {
        const { stdID, paymentAmount }: PointsRequest = req.body;

        if (!stdID || paymentAmount === undefined) {
            return res.status(400).json({ status: "400", message: "ข้อมูลไม่ครบถ้วน" });
        }

        if (!Number.isInteger(paymentAmount) || paymentAmount <= 0) {
            return res.status(400).json({ status: "400", message: "จำนวนเงินไม่ถูกต้อง" });
        }

        const pointsEarned = Math.floor(paymentAmount / 100) * 10;
        const totalPoints = defaultPoints + pointsEarned;

        return res.status(200).json({
            status: "200",
            message: "ได้รับแต้มเรียบร้อยแล้ว",
            data: {
                stdID,
                pointsEarned,
                totalPoints,
            },
        });

    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        return res.status(500).json({
            status: "500",
            message: "เกิดข้อผิดพลาดในระบบ",
        });
    }
});

app.listen(3600, () => {
    console.log("Server is running on port 3600");
});
