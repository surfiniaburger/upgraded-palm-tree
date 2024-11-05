// pages/api/records/stats.js
export default function handler(req, res) {
    res.status(200).json({
        types: ['Medical', 'Financial', 'Insurance', 'Educational'],
        counts: [120, 90, 60, 30],
    });
}
