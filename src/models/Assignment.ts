import { Property } from "@tsed/common";
import { IsInt, Min, MinLength, IsISO8601 } from "class-validator";
import { BadRequest } from "ts-httpexceptions";

import { ValidatedModel } from "./ValidatedModel";
import { AssignmentEntity } from "../entities/AssignmentEntity";

export class Assignment extends ValidatedModel
{
	@Property()
	@IsInt()
	public id: number;

	@Property()
	@MinLength(1)
	public title: string;

	@Property()
	@Min(0)
	public points: number;

	@Property()
	@IsISO8601()
	public due: string;

	@Property()
	@IsInt()
	public courseId: number;

	public static fromAssignmentEntity(assignmentEntity: AssignmentEntity): Assignment
	{
		const assignment = new Assignment();
		Object.assign(assignment, assignmentEntity);

		assignment.due = assignmentEntity.due.toISOString();

		return assignment;
	}

	public equals(assignment: Assignment): boolean
	{
		return this.id === assignment.id
			&& this.title === assignment.title
			&& this.points === assignment.points
			&& this.due === assignment.due
			&& this.courseId === assignment.courseId;
	}

	public update(assignment: Assignment): void
	{
		if(assignment.equals(this))
			throw new BadRequest("The request body was either not present or did not contain any fields related to Assignment objects.");

		if(this.id != assignment.id || this.courseId != assignment.courseId)
			throw new BadRequest("The request body was either not present or did not contain any fields related to Assignment objects.");

		Object.assign(this, assignment);
	}
}
