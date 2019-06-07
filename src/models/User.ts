import { IgnoreProperty, Property } from "@tsed/common";
import { IsEmail, IsIn, MinLength } from "class-validator";

import { ValidatedModel } from "./ValidatedModel";

export class User extends ValidatedModel
{
	@Property()
	public id: number;

	@Property()
	@MinLength(1)
	public name: string;

	@Property()
	@IsEmail()
	public email: string;

	@IgnoreProperty()
	@MinLength(5)
	public password: string;

	@Property()
	@IsIn(["admin", "instructor", "student"])
	public role: "admin" | "instructor" | "student";
}
