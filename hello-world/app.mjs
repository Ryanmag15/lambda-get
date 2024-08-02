import 'dotenv/config';
import { z } from 'zod';
import { searchProduct } from './src/search-product.mjs';

export async function lambdaHandler(event) {
    const bodySchema = z.object({
        productName: z.string(),
        userLatitude: z.coerce.number(),
        userLongitude: z.coerce.number(),
        maxDistance: z.coerce.number(),
    });

    try {
        const body = bodySchema.parse(JSON.parse(event.body));

        const data = await searchProduct(body);

        const formatedData = {
            results: data.map((row) => ({
                product: row['product_name'],
                supermarket: row['supermarket_name'],
                address: row['address'],
                distance: row['distance'],
                price: row['price'],
                date: row['date'],
            })),
        };

        return {
            statusCode: 200,
            body: JSON.stringify(formatedData),
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: error.format() }),
            };
        }
        console.error('Internal server error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
}
