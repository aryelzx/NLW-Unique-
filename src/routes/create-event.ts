import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { generateSlug } from '../utils/generate-slug'

export async function createEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/events',
    {
      schema: {
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable(),
        }),
        reponse: {
          201: z.object({
            eventId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { details, maximumAttendees, title } = request.body

      const slug = generateSlug(title)

      const eventWithSameSlug = await prisma.event.findUnique({
        where: {
          slug,
        },
      })

      if (eventWithSameSlug !== null) {
        throw new Error('Another event with same title already exists.')
      }

      const event = await prisma.event.create({
        data: {
          title: title,
          details: details,
          maximumAttendees: maximumAttendees,
          slug,
        },
      })

      return reply.status(201).send({ eventId: event.id })
    }
  )
}
