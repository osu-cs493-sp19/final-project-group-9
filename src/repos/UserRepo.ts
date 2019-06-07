import { Injectable, ProviderScope, Scope } from "@tsed/common";
import { BadRequest } from "ts-httpexceptions";
import bcrypt from "bcrypt";

import { UserEntityService } from "../services/UserEntityService";
import { User } from "../models/User";
import { UserEntity } from "../entities/UserEntity";

@Injectable()
@Scope(ProviderScope.SINGLETON)
export class UserRepo
{
	private userEntityService: UserEntityService;

	public constructor(userService: UserEntityService)
	{
		this.userEntityService = userService;
	}

	public async create(user: User): Promise<number>
	{
		if(user.id != undefined)
			throw new BadRequest("The request body was either not present or did not contain a valid User object.");

		const newUser = new UserEntity();
		Object.assign(newUser, user);
		newUser.password = await bcrypt.hash(user.password, 8);

		return this.userEntityService.save(newUser);
	}

	public async getById(id: number): Promise<User | null>
	{
		const userEntities = await this.userEntityService.find({ where: { id } });
		if(userEntities.length != 1)
			return null;

		const user = new User();
		Object.assign(user, userEntities[0]);

		return user;
	}

	public async getEntityByEmail(email: string): Promise<UserEntity | null>
	{
		const userEntities = await this.userEntityService.find({ where: { email } });
		if(userEntities.length != 1)
			return null;

		return userEntities[0];
	}
}
