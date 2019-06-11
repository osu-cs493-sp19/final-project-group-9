import { BodyParams, Controller, Get, Locals, PathParams, Post, Required, Status, Use } from "@tsed/common";
import { BadRequest, Forbidden, NotFound } from "ts-httpexceptions";

import { JwtMiddleware } from "../middleware/JwtMiddleware";
import { UserPayloadMiddleware } from "../middleware/UserPayloadMiddleware";
import { User } from "../models/User";
import { UserRepo } from "../repos/UserRepo";
import { UserJwtRepo, UserPayload } from "../repos/UserJwtRepo";
import { Course } from "../models/Course";
import { CourseRepo } from "../repos/CourseRepo";

@Controller("/users")
export class UsersController
{
	private userRepo: UserRepo;
	private userJwtRepo: UserJwtRepo;
	private courseRepo: CourseRepo;

	public constructor(userRepo: UserRepo, userJwtRepo: UserJwtRepo, courseRepo: CourseRepo)
	{
		this.userRepo = userRepo;
		this.userJwtRepo = userJwtRepo;
		this.courseRepo = courseRepo;
	}

	@Post("/")
	@Use(JwtMiddleware, UserPayloadMiddleware)
	@Status(201)
	public async create(
		@BodyParams() user: User,
		@Locals("userPayload.role") role: string
	): Promise<object>
	{
		if(role != "admin")
			throw new Forbidden("The request was not made by an authenticated User satisfying the authorization criteria described above.");

		const result = await user.validate();
		if(!result)
			throw new BadRequest("The request body was either not present or did not contain a valid User object.");

		const newUserId = await this.userRepo.create(user);

		return { id: newUserId };
	}

	@Post("/login")
	public async authenticate(
		@Required() @BodyParams("email") email: string,
		@Required() @BodyParams("password") password: string
	): Promise<object>
	{
		const token = await this.userJwtRepo.authorize(email, password);

		return { token };
	}

	@Get("/:id")
	@Use(JwtMiddleware, UserPayloadMiddleware)
	public async get(
		@PathParams("id") id: number,
		@Locals("userPayload") userPayload: UserPayload
	): Promise<object>
	{
		if(userPayload.userId != id)
			throw new Forbidden("The request was not made by an authenticated User satisfying the authorization criteria described above.");

		const enrolledCourses = await this.userRepo.getEnrolledCourses(id);
		if(!enrolledCourses)
			throw new NotFound("Specified User `id` not found.");

		switch(userPayload.role)
		{
			case "instructor":
				const query = new Course();
				query.instructorId = id;
				return this.courseRepo.getList(query);
			case "student":
				return enrolledCourses;
		}

		return [];
	}
}
