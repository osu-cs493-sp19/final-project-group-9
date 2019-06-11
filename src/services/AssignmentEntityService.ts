import { AfterRoutesInit, Service } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { Repository, FindManyOptions } from "typeorm";
import { InternalServerError } from "ts-httpexceptions";

import { AssignmentEntity } from "../entities/AssignmentEntity";

@Service()
export class AssignmentEntityService implements AfterRoutesInit
{
	private typeOrmService: TypeORMService;
	private assignmentRepository: Repository<AssignmentEntity>;

	public constructor(typeOrmService: TypeORMService)
	{
		this.typeOrmService = typeOrmService;
	}

	public $afterRoutesInit(): void
	{
		const connection = this.typeOrmService.get();
		if(!connection)
			throw new InternalServerError("Connection is undefined");

		this.assignmentRepository = connection.getRepository(AssignmentEntity);
	}

	public async find(options?: FindManyOptions): Promise<AssignmentEntity[]>
	{
		return this.assignmentRepository.find(options);
	}

	public async save(assignmentEntity: AssignmentEntity): Promise<number>
	{
		await this.assignmentRepository.save(assignmentEntity);

		return assignmentEntity.id;
	}

	public async update(assignmentEntity: AssignmentEntity): Promise<void>
	{
		await this.assignmentRepository.update(assignmentEntity.id, assignmentEntity);
	}

	public async delete(id: number): Promise<void>
	{
		await this.assignmentRepository.delete(id);
	}
}
