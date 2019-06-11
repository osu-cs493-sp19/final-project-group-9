import {
	BodyParams, Locals, MergeParams, PathParams,
	Controller,
	Delete, Get, Patch, Post,
	Next,
	Status,
	Use
} from "@tsed/common";
import { Forbidden, NotFound } from "ts-httpexceptions";

import { JwtMiddleware } from "../middleware/JwtMiddleware";
import { UserPayloadMiddleware } from "../middleware/UserPayloadMiddleware";
import { UserPayload } from "../repos/UserJwtRepo";
import { Assignment } from "../models/Assignment";
import { AssignmentRepo } from "../repos/AssignmentRepo";
import { CourseRepo } from "../repos/CourseRepo";
import { Submission } from "../models/Submission";

@Controller("/:id")
@MergeParams()
export class AssignmentController
{
	private assignmentRepo: AssignmentRepo;
	private courseRepo: CourseRepo;

	public constructor(assignmentRepo: AssignmentRepo, courseRepo: CourseRepo)
	{
		this.assignmentRepo = assignmentRepo;
		this.courseRepo = courseRepo;
	}

	@Use()
	public async retrieveAssignment(
		@PathParams("id") id: number,
		@Locals() locals: any,
		@Next() next: Next
	): Promise<void>
	{
		const assignment = await this.assignmentRepo.getById(id);
		if(!assignment)
			throw new NotFound("Specified Assignment not found.");

		const course = await this.courseRepo.getById(assignment.courseId);
		if(!course)
			throw new NotFound("Specified Assignment not found.");

		locals.assignment = assignment;
		locals.instructorId = course.instructorId;
		next();
	}

	@Get("/")
	public get(@Locals("assignment") assignment: Assignment): Assignment
	{
		return assignment;
	}

	@Patch("/")
	@Use(JwtMiddleware, UserPayloadMiddleware)
	@Status(204)
	public async update(
		@Locals("assignment") assignment: Assignment,
		@BodyParams() patchedAssignment: Assignment,
		@Locals("userPayload") userPayload: UserPayload,
		@Locals("instructorId") instructorId: number
	): Promise<void>
	{
		if(!(userPayload.role == "admin" || (userPayload.role == "instructor" && userPayload.userId == instructorId)))
			throw new Forbidden("The request was not made by an authenticated User satisfying the authorization criteria described above.");

		await this.assignmentRepo.patch(assignment, patchedAssignment);
	}

	@Delete("/")
	@Status(204)
	public async delete(
		@Locals("assignment") assignment: Assignment,
		@Locals("userPayload") userPayload: UserPayload,
		@Locals("instructorId") instructorId: number
	): Promise<void>
	{
		if(!(userPayload.role == "admin" || (userPayload.role == "instructor" && userPayload.userId == instructorId)))
			throw new Forbidden("The request was not made by an authenticated User satisfying the authorization criteria described above.");

		await this.assignmentRepo.delete(assignment.id);
	}

	@Get("/submissions")
	public getSubmissions(@Locals("assignment") assignment: Assignment): Submission[]
	{
		console.log(assignment);

		return [];
	}

	@Post("/submissions")
	@Status(201)
	public addSubmission(@Locals("assignment") assignment: Assignment): object
	{
		console.log(assignment);

		return { id: 0 };
	}
}
