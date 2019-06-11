import { BodyParams, Controller, Get, Locals, Post, QueryParams, Status, Use } from "@tsed/common";
import { Forbidden } from "ts-httpexceptions";

import { JwtMiddleware } from "../middleware/JwtMiddleware";
import { UserPayloadMiddleware } from "../middleware/UserPayloadMiddleware";
import { Course } from "../models/Course";
import { CourseRepo } from "../repos/CourseRepo";

import { CourseController } from "./CourseController";

@Controller(
{
	path: "/courses",
	children: [CourseController]
})
export class CoursesController
{
	private courseRepo: CourseRepo;

	public constructor(courseRepo: CourseRepo)
	{
		this.courseRepo = courseRepo;
	}

	@Get("/")
	public async getList(
		@QueryParams("page") page?: number,
		@QueryParams("subject") subject?: string,
		@QueryParams("number") number?: string,
		@QueryParams("term") term?: string
	): Promise<Course[]>
	{
		//TODO: handle paging

		const course = new Course();

		//TODO: should find a cleaner way to do this
		if(subject != undefined)
			course.subject = subject;
		if(number != undefined)
			course.number = number;
		if(term != undefined)
			course.term = term;

		return this.courseRepo.getList(course);
	}

	@Post("/")
	@Use(JwtMiddleware, UserPayloadMiddleware)
	@Status(201)
	public async create(
		@BodyParams() course: Course,
		@Locals("userPayload.role") role: string
	): Promise<object>
	{
		if(role != "admin")
			throw new Forbidden("The request was not made by an authenticated User satisfying the authorization criteria described above.");

		const newCourseId = await this.courseRepo.create(course);

		return { id: newCourseId };
	}
}
