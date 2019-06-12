import { Column, Entity, PrimaryColumn } from "typeorm";

import { Submission } from "../models/Submission";

@Entity("submission")
export class SubmissionEntity
{
	@PrimaryColumn()
	public id: string;

	@Column()
	public assignmentId: number;

	@Column()
	public studentId: number;

	@Column()
	public timestamp: Date;

	@Column()
	public file: string;

	public static fromSubmission(submission: Submission): SubmissionEntity
	{
		const submissionEntity = new SubmissionEntity();
		Object.assign(submissionEntity, submission);

		submissionEntity.timestamp = new Date(submission.timestamp);

		return submissionEntity;
	}
}
