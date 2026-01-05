import z from "zod";

const serverSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	BASE_DOMAIN: z.string().min(1, "BASE_DOMAIN is required"),
});

const clientSchema = z.object({});

const parsedServerEnv = serverSchema.safeParse(process.env);
const parsedClientEnv = clientSchema.safeParse(process.env);

if (!parsedServerEnv.success || !parsedClientEnv.success) {
	const serverErrors = parsedServerEnv.error?.flatten().fieldErrors;
	const clientErrors = parsedClientEnv.error?.flatten().fieldErrors;
	console.error("Invalid or missing environment variables", {
		server: serverErrors,
		client: clientErrors,
	});
	process.exit(1);
}

export const env = Object.freeze({
	client: parsedClientEnv.data,
	server: parsedServerEnv.data,
});
