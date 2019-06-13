import { validate, ValidationError, ValidatorOptions } from "class-validator";

export class ValidatedModel
{
	public async validate(options?: ValidatorOptions): Promise<boolean>
	{
		if(!options)
			options = { whitelist: true, forbidNonWhitelisted: true };

		const errors: ValidationError[] = await validate(this, options);

		return errors.length == 0;
	}
}
