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
}
