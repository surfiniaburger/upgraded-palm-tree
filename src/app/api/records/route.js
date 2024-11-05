// app/api/records/stats/route.js
export async function GET() {
    try {
        // Mock data - replace with your actual data source
        const data = {
            total: 1250,
            medical: 450,
            financial: 300,
            insurance: 280,
            educational: 220
        };

        return Response.json(data);
    } catch (error) {
        console.error('API Error:', error);
        return Response.json(
            { error: 'Failed to fetch record stats' },
            { status: 500 }
        );
    }
}
