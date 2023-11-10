//Importa o microframework Fastify que vai ajudar com a criação de rotas
import { fastify } from "fastify";
import { DatabasePostgres } from "./database-postgresql.js";

const server = fastify()

const database = new DatabasePostgres()


//Cria a função com o metodo POST, que vai criar novos videos
server.post('/videos', async(request, reply) => {
    const { title, description, duration } = request.body

   await database.create({
        title,
        description,
        duration
    })
    return reply.status(201).send()
})

//Cria a função que vai mostrar os videos criados
server.get('/videos', async (request) => {
    try {
        const search = request.query.search || ''; // Certifique-se de que search não seja undefined

        const videos = await database.list(search);

        return { statusCode: 200, data: videos };
    } catch (error) {
        console.error("Error handling request:", error);
        return { statusCode: 500, error: "Internal Server Error", message: error.message || "An internal server error occurred" };
    }
});

server.put('/videos/:id', async (request, reply) => {
    const videoId = request.params.id
    const { title, description, duration } = request.body

    await database.update(videoId, {
        title,
        description,
        duration
    })

    return reply.status(204).send()
})

server.delete('/videos/:id', async (request, reply) => {
    const videoId = request.params.id

   await database.delete(videoId)

    reply.status(204).send()
})

server.listen({
    port: process.env.PORT ?? 3000
})