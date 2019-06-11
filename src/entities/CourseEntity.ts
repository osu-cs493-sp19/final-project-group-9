import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import { UserEntity } from "./UserEntity";
import { Course } from "../models/Course";

@Entity("courses")
export class CourseEntity
{
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public subject: string;

	@Column()
	public number: string;

	@Column()
	public title: string;

	@Column()
	public term: string;

	@Column()
	public year: number;

	@Column()
	public instructorId: number;

	@ManyToMany(type => UserEntity, user => user.enrolledCourses)
	@JoinTable(
	{
		name: "enrolled",
		joinColumn:
		{
			name: "courseId",
			referencedColumnName: "id"
		},
		inverseJoinColumn:
		{
			name: "userId",
			referencedColumnName: "id"
		}
	})
	public students: UserEntity[];

	public static fromCourse(course: Course): CourseEntity
	{
		const courseEntity = new CourseEntity();
		Object.assign(courseEntity, course);

		const term = course.term.substring(0,2);
		const year = parseInt(course.term.substring(2));

		switch(term)
		{
			case "fa": courseEntity.term = "Fall"; break;
			case "wi": courseEntity.term = "Winter"; break;
			case "sp": courseEntity.term = "Spring"; break;
			case "su": courseEntity.term = "Summer"; break;
		}

		courseEntity.year = year + 2000;

		return courseEntity;
	}
}
