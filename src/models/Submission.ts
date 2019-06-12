import { Property } from "@tsed/common";
import { IsInt, IsISO8601, IsUrl } from "class-validator";

import { ValidatedModel } from "./ValidatedModel";

export class Submission extends ValidatedModel
{
	@Property()
	@IsInt()
	public assignmentId: number;

	@Property()
	@IsInt()
	public studentId: number;

	@Property()
	@IsISO8601()
	public timestamp: Date;

	@Property()
	@IsUrl()
	public file: string;
}
