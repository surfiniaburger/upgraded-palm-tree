// pages/api/diagnosis/stats.js
export default function handler(req, res) {
    res.status(200).json({
        types: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics'],
        counts: [50, 75, 40, 20],
    });
}
