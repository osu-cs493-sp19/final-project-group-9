import { AfterRoutesInit, Service } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { Repository, FindManyOptions } from "typeorm";
import { InternalServerError } from "ts-httpexceptions";

import { SubmissionEntity } from "../entities/SubmissionEntity";

@Service()
export class SubmissionEntityService implements AfterRoutesInit
{
	private typeOrmService: TypeORMService;
	private submissionRepository: Repository<SubmissionEntity>;

	public constructor(typeOrmService: TypeORMService)
	{
		this.typeOrmService = typeOrmService;
	}

	public $afterRoutesInit(): void
	{
		const connection = this.typeOrmService.get();
		if(!connection)
			throw new InternalServerError("Connection is undefined");

		this.submissionRepository = connection.getRepository(SubmissionEntity);
	}

	public async find(options?: FindManyOptions): Promise<SubmissionEntity[]>
	{
		return this.submissionRepository.find(options);
	}

	public async save(submissionEntity: SubmissionEntity): Promise<string>
	{
		await this.submissionRepository.save(submissionEntity);

		return submissionEntity.id;
	}
}
