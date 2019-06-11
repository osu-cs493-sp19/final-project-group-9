import {
	BodyParams, Locals, MergeParams, PathParams,
	ContentType, Status,
	Controller,
	Delete, Get, Patch, Post,
	Next,
	Use
} from "@tsed/common";
import { Forbidden, NotFound } from "ts-httpexceptions";

import { JwtMiddleware } from "../middleware/JwtMiddleware";
import { UserPayloadMiddleware } from "../middleware/UserPayloadMiddleware";
import { UserPayload } from "../repos/UserJwtRepo";
import { User } from "../models/User";
import { Course } from "../models/Course";
import { Assignment } from "../models/Assignment";
import { CourseRepo } from "../repos/CourseRepo";
import { AssignmentRepo } from "../repos/AssignmentRepo";

@Controller("/:id")
@MergeParams()
export class CourseController
{
	private courseRepo: CourseRepo;
	private assignmentRepo: AssignmentRepo;

	public constructor(courseRepo: CourseRepo, assignmentRepo: AssignmentRepo)
	{
		this.courseRepo = courseRepo;
		this.assignmentRepo = assignmentRepo;
	}

	@Use()
	public async retrieveCourse(
		@PathParams("id") id: number,
		@Locals() locals: any,
		@Next() next: Next
	): Promise<void>
	{
		const course = await this.courseRepo.getById(id);
		if(!course)
			throw new NotFound("Specified Course not found.");

		locals.course = course;
		next();
	}

	@Get("/")
	public get(@Locals("course") course: Course): Course
	{
		return course;
	}

	@Patch("/")
	@Use(JwtMiddleware, UserPayloadMiddleware)
	@Status(204)
	public async update(
		@Locals("course") course: Course,
		@BodyParams() patchedCourse: Course,
		@Locals("userPayload") userPayload: UserPayload
	): Promise<void>
	{
		if(!(userPayload.role == "admin" || (userPayload.role == "instructor" && userPayload.userId == course.instructorId)))
			throw new Forbidden("The request was not made by an authenticated User satisfying the authorization criteria described above.");

		await this.courseRepo.patch(course, patchedCourse);
	}

	@Delete("/")
	@Use(JwtMiddleware, UserPayloadMiddleware)
	@Status(204)
	public async delete(
		@Locals("course") course: Course,
		@Locals("userPayload.role") role: string
	): Promise<void>
	{
		if(role != "admin")
			throw new Forbidden("The request was not made by an authenticated User satisfying the authorization criteria described above.");

		await this.courseRepo.delete(course.id);
	}

	@Get("/students")
	@Use(JwtMiddleware, UserPayloadMiddleware)
	public async getStudents(
		@Locals("course") course: Course,
		@Locals("userPayload") userPayload: UserPayload
	): Promise<User[]>
	{
		if(!(userPayload.role == "admin" || (userPayload.role == "instructor" && userPayload.userId == course.instructorId)))
			throw new Forbidden("The request was not made by an authenticated User satisfying the authorization criteria described above.");

		const students = await this.courseRepo.getStudents(course.id);
		if(!students)
			throw new NotFound("Specified Course `id` not found.");

		return students;
	}

	@Post("/students")
	@Use(JwtMiddleware, UserPayloadMiddleware)
	@Status(204)
	public async updateStudents(
		@Locals("course") course: Course,
		@BodyParams("add") addIds: number[],
		@BodyParams("remove") removeIds: number[],
		@Locals("userPayload") userPayload: UserPayload
	): Promise<void>
	{
		if(!(userPayload.role == "admin" || (userPayload.role == "instructor" && userPayload.userId == course.instructorId)))
			throw new Forbidden("The request was not made by an authenticated User satisfying the authorization criteria described above.");

		//need some way to batch remove
		//need some way to batch add
	}

	@Get("/roster")
	@Use(JwtMiddleware, UserPayloadMiddleware)
	@ContentType("text/csv")
	public async getRoster(
		@Locals("course") course: Course,
		@Locals("userPayload") userPayload: UserPayload
	): Promise<string>
	{
		if(!(userPayload.role == "admin" || (userPayload.role == "instructor" && userPayload.userId == course.instructorId)))
			throw new Forbidden("The request was not made by an authenticated User satisfying the authorization criteria described above.");

		const students = await this.courseRepo.getStudents(course.id);
		if(!students)
			throw new NotFound("Specified Course `id` not found.");

		const csvLines: string[] = ["id,name,email"];
		for(const student of students)
		{
			const csvLine = `${student.id},${student.name},${student.email}`;
			csvLines.push(csvLine);
		}

		return csvLines.join("\n");
	}

	@Get("/assignments")
	public async getAssignments(@Locals("course") course: Course): Promise<Assignment[]>
	{
		const query = new Assignment();
		query.courseId = course.id;

		return this.assignmentRepo.getList(query);
	}
}
