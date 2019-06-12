import { AfterRoutesInit, Service } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { Repository, FindManyOptions } from "typeorm";
import { InternalServerError } from "ts-httpexceptions";

import { EnrolledEntity } from "../entities/EnrolledEntity";

@Service()
export class EnrolledEntityService implements AfterRoutesInit
{
	private typeOrmService: TypeORMService;
	private enrolledRepository: Repository<EnrolledEntity>;

	public constructor(typeOrmService: TypeORMService)
	{
		this.typeOrmService = typeOrmService;
	}

	public $afterRoutesInit(): void
	{
		const connection = this.typeOrmService.get();
		if(!connection)
			throw new InternalServerError("Connection is undefined");

		this.enrolledRepository = connection.getRepository(EnrolledEntity);
	}

	public async count(options?: FindManyOptions): Promise<number>
	{
		return this.enrolledRepository.count(options);
	}
}
