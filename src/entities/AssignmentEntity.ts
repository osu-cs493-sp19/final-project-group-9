import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { Assignment } from "../models/Assignment";

@Entity("assignments")
export class AssignmentEntity
{
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public title: string;

	@Column()
	public points: number;

	@Column()
	public due: Date;

	@Column()
	public courseId: number;

	public static fromAssignment(assignment: Assignment): AssignmentEntity
	{
		const assignmentEntity = new AssignmentEntity();
		Object.assign(assignmentEntity, assignment);

		if(assignment.due)
			assignmentEntity.due = new Date(assignment.due);

		return assignmentEntity;
	}
}
