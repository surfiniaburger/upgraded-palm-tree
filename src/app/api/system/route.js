// pages/api/system/health.js
export default function handler(req, res) {
    res.status(200).json({
        timestamps: ['10:00', '11:00', '12:00'],
        responseTimes: [200, 180, 210],
    });
}
