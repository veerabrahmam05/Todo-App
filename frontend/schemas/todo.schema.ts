import * as z from 'zod';

export const TodoSchema = z.object({
    name: z.string().min(1, "title must be given"),
    description: z.string().min(1, "description must be given"),
    priority: z.union([z.literal("0"), z.literal("1"), z.literal("2")]), // using string just to use radio buttons for priority
    completed: z.boolean().default(false).nonoptional(),
    deadline: z.date().default(new Date()).nonoptional(),
})

export type TodoSchemaValues = z.infer<typeof TodoSchema>;