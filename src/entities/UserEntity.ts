import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
