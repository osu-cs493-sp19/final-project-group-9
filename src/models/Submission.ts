import { Property } from "@tsed/common";
import { IsInt, IsISO8601, IsString, Length } from "class-validator";

import { ValidatedModel } from "./ValidatedModel";

export class Submission extends ValidatedModel
{
	@Property()
	@Length(16)
	public id: string;

	@Property()
	@IsInt()
	public assignmentId: number;

	@Property()
	@IsInt()
	public studentId: number;

	@Property()
	@IsISO8601()
	public timestamp: string;

	@Property()
	@IsString()
	public file: string;
}
