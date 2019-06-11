import { BodyParams, Controller, Locals, Post, Status, Use } from "@tsed/common";
import { Forbidden } from "ts-httpexceptions";

import { JwtMiddleware } from "../middleware/JwtMiddleware";
import { UserPayloadMiddleware } from "../middleware/UserPayloadMiddleware";
import { Assignment } from "../models/Assignment";
import { AssignmentRepo } from "../repos/AssignmentRepo";

import { AssignmentController } from "./AssignmentController";

@Controller(
{
	path: "/assignments",
	children: [AssignmentController]
})
export class AssignmentsController
{
	private assignmentRepo: AssignmentRepo;

	public constructor(assignmentRepo: AssignmentRepo)
	{
		this.assignmentRepo = assignmentRepo;
	}

	@Post("/")
	@Use(JwtMiddleware, UserPayloadMiddleware)
	@Status(201)
	public async create(
		@BodyParams() assignment: Assignment,
		@Locals("userPayload.role") role: string
	): Promise<object>
	{
		if(role != "admin")
			throw new Forbidden("The request was not made by an authenticated User satisfying the authorization criteria described above.");

		const newAssignmentId = await this.assignmentRepo.create(assignment);

		return { id: newAssignmentId };
	}
}
