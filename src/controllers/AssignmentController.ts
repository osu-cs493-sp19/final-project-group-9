import {
	BodyParams, Locals, MergeParams, PathParams,
	Controller,
	Delete, Get, Patch, Post,
	Next,
	Status,
	Use
} from "@tsed/common";
import { MulterOptions, MultipartFile } from "@tsed/multipartfiles";
import { BadRequest, Forbidden, NotFound } from "ts-httpexceptions";
import { unlinkSync } from "fs";

import { JwtMiddleware } from "../middleware/JwtMiddleware";
import { UserPayloadMiddleware } from "../middleware/UserPayloadMiddleware";
import { UserPayload } from "../repos/UserJwtRepo";
import { Assignment } from "../models/Assignment";
import { AssignmentRepo } from "../repos/AssignmentRepo";
import { CourseRepo } from "../repos/CourseRepo";
import { Submission } from "../models/Submission";
import { EnrolledRepo } from "../repos/EnrolledRepo";
import { SubmissionRepo } from "../repos/SubmissionRepo";

@Controller("/:id")
@MergeParams()
export class AssignmentController
{
	private assignmentRepo: AssignmentRepo;
	private courseRepo: CourseRepo;
	private enrolledRepo: EnrolledRepo;
	private submissionRepo: SubmissionRepo;

	public constructor(assignmentRepo: AssignmentRepo, courseRepo: CourseRepo, enrolledRepo: EnrolledRepo, submissionRepo: SubmissionRepo)
	{
		this.assignmentRepo = assignmentRepo;
		this.courseRepo = courseRepo;
		this.enrolledRepo = enrolledRepo;
		this.submissionRepo = submissionRepo;
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
	@Use(JwtMiddleware, UserPayloadMiddleware)
	@Status(201)
	@MulterOptions({ dest: `${process.cwd()}/.tmp` })
	public async addSubmission(
		@Locals("assignment") assignment: Assignment,
		@BodyParams() submission: Submission,
		@MultipartFile("file") file: Express.Multer.File,
		@Locals("userPayload") userPayload: UserPayload
	): Promise<object>
	{
		try
		{
			if(userPayload.role != "student")
				throw new Forbidden("The request was not made by an authenticated User satisfying the authorization criteria described above.");

			//file will be === undefined if contentType is not multipart/formdata

			//try to submit to the wrong assignment or try to submit for someone else
			if(submission.assignmentId !== assignment.id || submission.studentId !== userPayload.userId)
				throw new BadRequest("The request body was either not present or did not contain a valid Submission object.");

			const inCourse = await this.enrolledRepo.enrolledIn(userPayload.userId, assignment.courseId);
			if(!inCourse)
				throw new BadRequest("The request body was either not present or did not contain a valid Submission object.");

			const newSubmissionId = await this.submissionRepo.create(submission, file);

			return { id: newSubmissionId };
		}
		catch(error)
		{
			throw error;
		}
		finally
		{
			unlinkSync(file.path);
		}
	}
}
