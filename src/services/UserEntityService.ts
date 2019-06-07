import { AfterRoutesInit, Service } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { Repository, FindManyOptions } from "typeorm";
import { InternalServerError } from "ts-httpexceptions";

import { UserEntity } from "../entities/UserEntity";

@Service()
export class UserEntityService implements AfterRoutesInit
{
	private typeOrmService: TypeORMService;
	private userRepository: Repository<UserEntity>;

	public constructor(typeOrmService: TypeORMService)
	{
		this.typeOrmService = typeOrmService;
	}

	public $afterRoutesInit(): void
	{
		const connection = this.typeOrmService.get();
		if(!connection)
			throw new InternalServerError("Connection is undefined");

		this.userRepository = connection.getRepository(UserEntity);
	}

	public async find(options?: FindManyOptions): Promise<UserEntity[]>
	{
		return this.userRepository.find(options);
	}

	public async save(userEntity: UserEntity): Promise<number>
	{
		await this.userRepository.save(userEntity);

		return userEntity.id;
	}
}
