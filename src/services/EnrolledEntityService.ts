import { AfterRoutesInit, Service } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { In, Repository, FindManyOptions } from "typeorm";
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

	public async bulkSave(enrolledEntities: EnrolledEntity[]): Promise<void>
	{
		await this.enrolledRepository.save(enrolledEntities);
	}

	public async bulkDeleteUsers(userIds: number[], courseId: number): Promise<void>
	{
		await this.enrolledRepository.delete(
		{
			courseId,
			userId: In(userIds)
		});
	}
}
