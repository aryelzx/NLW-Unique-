import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler
} from 'fastify-type-provider-zod'
import { checkIn } from './routes/checki-in'
import { createEvent } from './routes/create-event'
import { getAttendeeBadge } from './routes/get-attendee-badge'
import { getEvent } from './routes/get-events'
import { registerForEvent } from './routes/register-for-event'

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttendeeBadge)
app.register(checkIn)

app.listen({ port: 3333 }).then(() => {
  console.log('Server is running on port 3333')
})
