import { Injectable, ProviderScope, Scope } from "@tsed/common";
import { BadRequest } from "ts-httpexceptions";
import { randomBytes } from "crypto";
import { renameSync } from "fs";

import { SubmissionEntityService } from "../services/SubmissionEntityService";
import { Submission } from "../models/Submission";
import { SubmissionEntity } from "../entities/SubmissionEntity";

@Injectable()
@Scope(ProviderScope.SINGLETON)
export class SubmissionRepo
{
	private submissionEntityService: SubmissionEntityService;
	private directoryLocation: string;

	public constructor(submissionEntityService: SubmissionEntityService)
	{
		this.submissionEntityService = submissionEntityService;
		this.directoryLocation = `${process.cwd()}/submissions`;
	}

	public async create(submission: Submission, file: Express.Multer.File): Promise<string>
	{
		if(submission.id != undefined && submission.file != undefined)
			throw new BadRequest("The request body was either not present or did not contain a valid Submission object.");

		submission.id = randomBytes(8).toString("hex");
		submission.file = `${this.directoryLocation}/${submission.id}`;
		const result = await submission.validate();
		if(!result)
		{
			console.log(submission);
			throw new BadRequest("The request body was either not present or did not contain a valid Submission object.");
		}

		const newSubmission = SubmissionEntity.fromSubmission(submission);
		await this.submissionEntityService.save(newSubmission);

		renameSync(file.path, submission.file);

		return newSubmission.id;
	}
}
