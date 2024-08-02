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
                s.company_name AS supermarket_name, 
                s.address_street || ', ' || s.address_number || ', ' || s.address_neighborhood || ', ' || s.address_city || ', ' || s.address_state AS address, 
                pp.price, 
                pp.date,
                (6371 * acos( 
                    cos(radians($1)) * cos(radians(s.address_lat)) * 
                    cos(radians(s.address_lng) - radians($2)) + 
                    sin(radians($1)) * sin(radians(s.address_lat))
                )) AS distance
            FROM 
                supermarkets AS s
            INNER JOIN 
                products AS p ON s.id = p.supermarket_id
            INNER JOIN 
                productprices AS pp ON p.id = pp.product_id
            WHERE 
                p.name ILIKE '%' || $3 || '%'
            AND
                (6371 * acos( 
                    cos(radians($1)) * cos(radians(s.address_lat)) * 
                    cos(radians(s.address_lng) - radians($2)) + 
                    sin(radians($1)) * sin(radians(s.address_lat))
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
