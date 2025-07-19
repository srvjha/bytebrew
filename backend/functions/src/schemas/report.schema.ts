import { z } from 'zod';

export const reportSchema = z.object({
  description: z.string().optional().default(""),
  latitude: z.number(),
  longitude: z.number(),
  userId: z.string().min(1, "User ID is required") 
});


type Report = z.infer<typeof reportSchema>;

const validateReport = (data:Report)=>{
  console.log("validate ko call aaya")
    return reportSchema.safeParse(data)
}

export {
    validateReport
}
