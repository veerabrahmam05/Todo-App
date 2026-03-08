import * as z from 'zod';

export const TodoSchema = z.object({
    name: z.string().min(1, "title must be given"),
    description: z.string().min(1, "description must be given"),
    priority: z.string().min(1, "priority must be given"),
    deadline: z.string().min(1, "deadline must be given"),
})

export type TodoSchemaValues = z.infer<typeof TodoSchema>;