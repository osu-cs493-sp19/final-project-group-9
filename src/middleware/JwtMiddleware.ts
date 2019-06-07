import { IMiddleware, Locals, Middleware, Req } from "@tsed/common";
import { Forbidden } from "ts-httpexceptions";

@Middleware()
export class JwtMiddleware implements IMiddleware
{
	public use(
		@Req() request: Req,
		@Locals() locals: any,
	): void
	{
		const authHeader = request.get("Authorization");
		if(!authHeader)
			throw new Forbidden("Authorization header is required.");

		if(!authHeader.match(/^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/))
			throw new Forbidden("A JWT needs to be passed in the bearer format");

		const token = authHeader.split(" ")[1];
		locals.token = token;
	}
}
