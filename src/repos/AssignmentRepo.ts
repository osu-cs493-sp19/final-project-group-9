import { Injectable, ProviderScope, Scope } from "@tsed/common";
import { BadRequest } from "ts-httpexceptions";

import { AssignmentEntityService } from "../services/AssignmentEntityService";
import { Assignment } from "../models/Assignment";
import { AssignmentEntity } from "../entities/AssignmentEntity";

@Injectable()
@Scope(ProviderScope.SINGLETON)
export class AssignmentRepo
{
	private assignmentEntityService: AssignmentEntityService;

	public constructor(assignmentEntityService: AssignmentEntityService)
	{
		this.assignmentEntityService = assignmentEntityService;
	}

	public async create(assignment: Assignment): Promise<number>
	{
		if(assignment.id != undefined)
			throw new BadRequest("The request body was either not present or did not contain a valid Assignment object.");

		assignment.id = 0;
		const result = await assignment.validate();
		if(!result)
			throw new BadRequest("The request body was either not present or did not contain a valid Assignment object.");

		delete assignment.id;
		const newAssignment = AssignmentEntity.fromAssignment(assignment);

		return this.assignmentEntityService.save(newAssignment);
	}

	public async getById(id: number): Promise<Assignment | null>
	{
		const assignmentEntities = await this.assignmentEntityService.find({ where: { id } });
		if(assignmentEntities.length != 1)
			return null;

		return Assignment.fromAssignmentEntity(assignmentEntities[0]);
	}

	public async getList(assignment: Assignment): Promise<Assignment[]>
	{
		const assignmentEntities = await this.assignmentEntityService.find({ where: assignment });
		return assignmentEntities.map((assignmentEntity: AssignmentEntity): Assignment =>
		{
			return Assignment.fromAssignmentEntity(assignmentEntity);
		});
	}

	public async update(assignment: Assignment, newAssignment: Assignment): Promise<void>
	{
		await newAssignment.validate();
		assignment.update(newAssignment);

		return this.assignmentEntityService.update(AssignmentEntity.fromAssignment(assignment));
	}

	public async patch(assignment: Assignment, assignmentPatch: Assignment): Promise<void>
	{
		Object.entries(assignment).forEach(([key, value]): void =>
		{
			if((assignmentPatch as any)[key] === undefined)
				(assignmentPatch as any)[key] = value;
		});

		return this.update(assignment, assignmentPatch);
	}

	public async delete(id: number): Promise<void>
	{
		return this.assignmentEntityService.delete(id);
	}
}
