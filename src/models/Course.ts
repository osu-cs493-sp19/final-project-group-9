import { Property } from "@tsed/common";
import { IsInt, Matches, MinLength } from "class-validator";
import { BadRequest } from "ts-httpexceptions";

import { ValidatedModel } from "./ValidatedModel";
import { CourseEntity } from "../entities/CourseEntity";

export class Course extends ValidatedModel
{
	@Property()
	@IsInt()
	public id: number;

	@Property()
	@MinLength(2)
	public subject: string;

	@Property()
	@Matches(/[1-9]\d{2}/)
	public number: string;

	@Property()
	@MinLength(1)
	public title: string;

	@Property()
	@Matches(/(fa|wi|sp|su)\d{2}/)
	public term: string;

	@Property()
	@IsInt()
	public instructorId: number;

	public static fromCourseEntity(courseEntity: CourseEntity): Course
	{
		const course = new Course();

		course.id = courseEntity.id;
		course.subject = courseEntity.subject;
		course.number = courseEntity.number;
		course.title = courseEntity.title;
		course.instructorId = courseEntity.instructorId;

		let term = "";
		switch(courseEntity.term)
		{
			case "Fall": term = "fa"; break;
			case "Winter": term = "wi"; break;
			case "Spring": term = "sp"; break;
			case "summer": term = "su"; break;
		}

		course.term = term + (courseEntity.year - 2000);

		return course;
	}

	public equals(course: Course): boolean
	{
		return this.id === course.id
			&& this.subject === course.subject
			&& this.number === course.number
			&& this.title === course.title
			&& this.term === course.term
			&& this.instructorId === course.instructorId;
	}

	public async update(course: Course): Promise<void>
	{
		if(course.equals(this))
			throw new BadRequest("The request body was either not present or did not contain any fields related to Course objects.");

		if(this.id != course.id)
			throw new BadRequest("The request body was either not present or did not contain any fields related to Course objects.");

		const result = await course.validate();
		if(!result)
			throw new BadRequest("The request body was either not present or did not contain any fields related to Course objects.");

		Object.assign(this, course);
	}
}
