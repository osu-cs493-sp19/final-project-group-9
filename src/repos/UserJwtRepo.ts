import { Injectable, ProviderScope, Scope } from "@tsed/common";
import { Unauthorized } from "ts-httpexceptions";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { UserEntity } from "../entities/UserEntity";
import { UserRepo } from "./UserRepo";

export type Token = string;
export interface UserPayload
{
	userId: number;
	role: UserEntity["role"];
}

@Injectable()
@Scope(ProviderScope.SINGLETON)
export class UserJwtRepo
{
	private userRepo: UserRepo;

	public constructor(userRepo: UserRepo)
	{
		this.userRepo = userRepo;
	}

	public async authorize(email: string, password: string): Promise<Token>
	{
		const userEntity = await this.userRepo.getEntityByEmail(email);
		if(!userEntity)
			throw new Unauthorized("The specified credentials were invalid.");

		const result = await bcrypt.compare(password, userEntity.password);
		if(!result)
			throw new Unauthorized("The specified credentials were invalid.");

		const payload: UserPayload =
		{
			userId: userEntity.id,
			role: userEntity.role
		};
		const signOptions =
		{
			expiresIn: "24h"
		};

		return jwt.sign(payload, "mySecretKey", signOptions);
	}

	public validate(token: Token): UserPayload | null
	{
		let userPayload = null;

		try
		{
			userPayload = jwt.verify(token, "mySecretKey") as UserPayload;
		}
		catch(error)
		{
			if(!(error instanceof jwt.JsonWebTokenError))
				throw error;
		}

		return userPayload;
	}
}
