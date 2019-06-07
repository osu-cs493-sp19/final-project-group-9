import { validate, ValidationError, ValidationOptions } from "class-validator";

export class ValidatedModel
{
	public async validate(options?: ValidationOptions): Promise<boolean>
	{
		const errors: ValidationError[] = await validate(this, options);

		return errors.length == 0;
	}
}
