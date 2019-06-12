import { Injectable, ProviderScope, Scope } from "@tsed/common";

import { EnrolledEntityService } from "../services/EnrolledEntityService";
import { EnrolledEntity } from "../entities/EnrolledEntity";

@Injectable()
@Scope(ProviderScope.SINGLETON)
export class EnrolledRepo
{
	private enrolledEntityService: EnrolledEntityService;

	public constructor(enrolledEntityService: EnrolledEntityService)
	{
		this.enrolledEntityService = enrolledEntityService;
	}

	public async enrolledIn(userId: number, courseId: number): Promise<boolean>
	{
		const numCourses = await this.enrolledEntityService.count({ where: { userId, courseId } });

		return numCourses != 0;
	}

	public async addToCourse(userIds: number[], courseId: number): Promise<void>
	{
		const newEntities = userIds.map((userId: number): EnrolledEntity =>
		{
			const enrolledEntity = new EnrolledEntity();
			enrolledEntity.userId = userId;
			enrolledEntity.courseId = courseId;

			return enrolledEntity;
		});

		await this.enrolledEntityService.bulkSave(newEntities);
	}

	public async removeFromCourse(userIds: number[], courseId: number): Promise<void>
	{
		await this.enrolledEntityService.bulkDeleteUsers(userIds, courseId);
	}
}
