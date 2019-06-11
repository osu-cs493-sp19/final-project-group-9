import { Property } from "@tsed/common";

export class Submission
{
	@Property()
	public assignmentId: number;

	@Property()
	public studentId: number;

	@Property()
	public timestamp: Date;

	@Property()
	public file: string;
}
