const { z } = require("zod");

const userRegisterSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),

  email: z.string().email("Invalid email"),

  password: z.string().min(6, "Password must be 6+ chars"),
});

const userLoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be 6+ chars"),
});

module.exports = { userRegisterSchema, userLoginSchema };
