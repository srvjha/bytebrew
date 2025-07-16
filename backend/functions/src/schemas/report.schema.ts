import { z } from 'zod';

export const reportSchema = z.object({
  type: z.enum(['traffic', 'power', 'cultural', 'accident']),
  mediaUrl: z.string().optional(),
  geo: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  source: z.enum(['twitter', 'user', 'sensor']),
  rawText: z.string(),
});


type Report = z.infer<typeof reportSchema>;

const validateReport = (data:Report)=>{
    return reportSchema.safeParse(data)
}

export {
    validateReport
}
