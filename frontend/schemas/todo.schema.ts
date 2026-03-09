import * as z from 'zod';

export const TodoSchema = z.object({
    name: z.string().min(1, "title must be given"),
    description: z.string().min(1, "description must be given"),
    priority: z.string().min(1, "priority must be given"),
    completed: z.boolean().default(false).nonoptional(),
    deadline: z.date().default(new Date()).nonoptional(),
})

export type TodoSchemaValues = z.infer<typeof TodoSchema>;