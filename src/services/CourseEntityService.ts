import { AfterRoutesInit, Service } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { Repository, FindManyOptions } from "typeorm";
import { InternalServerError } from "ts-httpexceptions";

import { CourseEntity } from "../entities/CourseEntity";

@Service()
export class CourseEntityService implements AfterRoutesInit
{
	private typeOrmService: TypeORMService;
	private courseRepository: Repository<CourseEntity>;

	public constructor(typeOrmService: TypeORMService)
	{
		this.typeOrmService = typeOrmService;
	}

	public $afterRoutesInit(): void
	{
		const connection = this.typeOrmService.get();
		if(!connection)
			throw new InternalServerError("Connection is undefined");

		this.courseRepository = connection.getRepository(CourseEntity);
	}

	public async find(options?: FindManyOptions): Promise<CourseEntity[]>
	{
		return this.courseRepository.find(options);
	}

	public async save(courseEntity: CourseEntity): Promise<number>
	{
		await this.courseRepository.save(courseEntity);

		return courseEntity.id;
	}

	public async update(courseEntity: CourseEntity): Promise<void>
	{
		await this.courseRepository.update(courseEntity.id, courseEntity);
	}

	public async delete(id: number): Promise<void>
	{
		await this.courseRepository.delete(id);
	}
}
