import { Entity, PrimaryColumn } from "typeorm";

@Entity("enrolled")
export class EnrolledEntity
{
	@PrimaryColumn()
	public userId: number;

	@PrimaryColumn()
	public courseId: number;
}
