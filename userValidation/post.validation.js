const { z } = require("zod");

const addPostSchemaValidation = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  content: z.string().trim().min(10, "Content must be at least 10 characters"),

  image: z
    .string()
    .trim()
    .url("Image must be a valid URL")
    .optional()
    .or(z.literal("")), // allow empty string
});

module.exports = addPostSchemaValidation;
