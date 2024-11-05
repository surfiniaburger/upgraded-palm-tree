// app/api/diagnosis/stats/route.js
export async function GET() {
    try {
        // Mock data - replace with your actual data source
        const data = {
            active: 85,
            completed: 150,
            pending: 30,
            total: 265
        };

        return Response.json(data);
    } catch (error) {
        console.error('API Error:', error);
        return Response.json(
            { error: 'Failed to fetch diagnosis stats' },
            { status: 500 }
        );
    }
}
