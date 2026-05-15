import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string().max(160, 'Keep meta descriptions under 160 chars for SEO'),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			tags: z.array(z.string()).optional().default([]),
			author: z.string().optional().default('Hermes Agent'),
			canonicalURL: z.string().url().optional(),
			keywords: z.array(z.string()).optional().default([]),
		}),
});

export const collections = { blog };
