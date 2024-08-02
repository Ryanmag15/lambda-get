import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
    connectionString: 'postgresql://root:dhHjLmNnlj2jJALhuQTN0LmR7GtDSrab@dpg-cq7i09bv2p9s73c4u7m0-a.virginia-postgres.render.com/arquiteturadatabase',
    ssl: {
        rejectUnauthorized: false,
    },
});

export async function searchProduct(body) {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `
            SELECT 
                p.name AS product_name, 
                s.name AS supermarket_name, 
                s.address, 
                ph.price, 
                ph.date,
                (6371 * acos( 
                    cos(radians($1)) * cos(radians(s.latitude)) * 
                    cos(radians(s.longitude) - radians($2)) + 
                    sin(radians($1)) * sin(radians(s.latitude))
                )) AS distance
            FROM 
                supermarkets AS s
            INNER JOIN 
                price_history AS ph ON s.cnpj = ph.supermarket_id
            INNER JOIN 
                products AS p ON ph.product_id = p.code
            WHERE 
                p.name ILIKE '%' || $3 || '%'
            AND
                (6371 * acos( 
                    cos(radians($1)) * cos(radians(s.latitude)) * 
                    cos(radians(s.longitude) - radians($2)) + 
                    sin(radians($1)) * sin(radians(s.latitude))
                )) < $4;
            `,
            [body.userLatitude, body.userLongitude, body.productName, body.maxDistance]
        );

        return result.rows;
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}
