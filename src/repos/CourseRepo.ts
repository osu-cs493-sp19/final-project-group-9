import { Injectable, ProviderScope, Scope } from "@tsed/common";
import { BadRequest } from "ts-httpexceptions";

import { CourseEntityService } from "../services/CourseEntityService";
import { Course } from "../models/Course";
import { CourseEntity } from "../entities/CourseEntity";
import { User } from "../models/User";
import { UserEntity } from "../entities/UserEntity";

@Injectable()
@Scope(ProviderScope.SINGLETON)
export class CourseRepo
{
	private courseEntityService: CourseEntityService;

	public constructor(courseEntityService: CourseEntityService)
	{
		this.courseEntityService = courseEntityService;
	}

	public async create(course: Course): Promise<number>
	{
		if(course.id != undefined)
			throw new BadRequest("The request body was either not present or did not contain a valid Course object.");

		course.id = 0;
		const result = await course.validate();
		if(!result)
			throw new BadRequest("The request body was either not present or did not contain a valid Course object.");

		delete course.id;
		const newCourse = CourseEntity.fromCourse(course);

		return this.courseEntityService.save(newCourse);
	}

	public async getById(id: number): Promise<Course | null>
	{
		const courseEntities = await this.courseEntityService.find({ where: { id } });
		if(courseEntities.length != 1)
			return null;

		const course = Course.fromCourseEntity(courseEntities[0]);

		return course;
	}

	public async getList(course: Course): Promise<Course[]>
	{
		const courseEntities = await this.courseEntityService.find(
		{
			where: CourseEntity.fromCourse(course)
		});

		return courseEntities.map((courseEntity: CourseEntity): Course =>
		{
			return Course.fromCourseEntity(courseEntity);
		});
	}

	public async getPaginatedList(course: Course, page: number): Promise<Course[]>
	{
		const skip = (page-1)*10;

		const courseEntities = await this.courseEntityService.find(
		{
			where: CourseEntity.fromCourse(course),
			skip,
			take: 10
		});

		return courseEntities.map((courseEntity: CourseEntity): Course =>
		{
			return Course.fromCourseEntity(courseEntity);
		});
	}

	public async getStudents(id: number): Promise<User[] | null>
	{
		const courseEntities = await this.courseEntityService.find(
		{
			where: { id },
			relations: ["students"]
		});

		if(courseEntities.length != 1)
			return null;

		return courseEntities[0].students.map((userEntity: UserEntity): User =>
		{
			const user = new User();
			Object.assign(user, userEntity);

			return user;
		});
	}

	public async update(course: Course, newCourse: Course): Promise<void>
	{
		await course.update(newCourse);

		return this.courseEntityService.update(CourseEntity.fromCourse(course));
	}

	public async patch(course: Course, coursePatch: Course): Promise<void>
	{
		Object.entries(course).forEach(([key, value]): void =>
		{
			if((coursePatch as any)[key] === undefined)
				(coursePatch as any)[key] = value;
		});

		return this.update(course, coursePatch);
	}

	public async delete(id: number): Promise<void>
	{
		return this.courseEntityService.delete(id);
	}
}
