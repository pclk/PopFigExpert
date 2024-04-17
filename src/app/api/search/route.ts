export async function POST(request) {
    const { query } = await request.json();
  
    try {
      const response = await fetch(`${process.env.ELASTICSEARCH_URL}your_index_name/_search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            match: {
              field_name: query,
            },
          },
        }),
      });
  
      const data = await response.json();
      return new Response(JSON.stringify(data.hits.hits), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'An error occurred' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }