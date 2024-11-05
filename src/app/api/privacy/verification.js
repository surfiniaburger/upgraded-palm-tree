// pages/api/privacy/verification.js
export default function handler(req, res) {
    res.status(200).json({
        verified: 85,
        failed: 15,
    });
}
