// api/proxy.js

// Función principal para manejar la solicitud
export default async (req, res) => {
    // 1. Configurar los encabezados CORS para permitir que cualquier origen acceda
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');

    // Manejar las peticiones OPTIONS (preflight requests) del navegador
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 2. Obtener la URL de destino de la API
    const targetUrl = req.query.url;

    if (!targetUrl) {
        res.status(400).send('Error: Falta el parámetro "url".');
        return;
    }

    try {
        // 3. Realizar la solicitud Servidor-a-Servidor (como lo hace Python)
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {}
        });

        // 4. Leer el cuerpo y el estado de la respuesta
        const responseData = await response.text();

        // 5. Devolver el contenido al frontend con el estado original
        res.status(response.status).send(responseData);

    } catch (error) {
        console.error('Error al hacer fetch a la API de destino:', error);
        res.status(500).send(`Error interno del proxy: ${error.message}`);
    }
};