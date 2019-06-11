import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import { CourseEntity } from "./CourseEntity";

@Entity("users")
export class UserEntity
{
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public name: string;

	@Column()
	public email: string;

	@Column()
	public password: string;

	@Column()
	public role: "admin" | "instructor" | "student";

	@ManyToMany(type => CourseEntity, course => course.students)
	@JoinTable(
	{
		name: "enrolled",
		joinColumn:
		{
			name: "userId",
			referencedColumnName: "id"
		},
		inverseJoinColumn:
		{
			name: "courseId",
			referencedColumnName: "id"
		}
	})
	public enrolledCourses: CourseEntity[];
}
