import { IMiddleware, Locals, Middleware } from "@tsed/common";
import { Forbidden, InternalServerError } from "ts-httpexceptions";

import { UserJwtRepo } from "../repos/UserJwtRepo";

@Middleware()
export class UserPayloadMiddleware implements IMiddleware
{
	private userJwtRepo: UserJwtRepo;

	public constructor(userJwtRepo: UserJwtRepo)
	{
		this.userJwtRepo = userJwtRepo;
	}

	public use(
		@Locals() locals: any
	): void
	{
		if(!locals.token)
			throw new InternalServerError("An internal server error occurred.");

		const userPayload = this.userJwtRepo.validate(locals.token);

		if(!userPayload)
			throw new Forbidden("The request was not made by an authenticated User satisfying the authorization criteria described above.");

		locals.userPayload = userPayload;
	}
}
