import { Injectable, ProviderScope, Scope, Value } from "@tsed/common";
import { BadRequest } from "ts-httpexceptions";
import { randomBytes } from "crypto";
import { renameSync } from "fs";
import { basename } from "path";

import { SubmissionEntityService } from "../services/SubmissionEntityService";
import { Submission } from "../models/Submission";
import { SubmissionEntity } from "../entities/SubmissionEntity";

@Injectable()
@Scope(ProviderScope.SINGLETON)
export class SubmissionRepo
{
	private submissionEntityService: SubmissionEntityService;

	@Value("submissionLocation")
	private submissionLocation: string;

	public constructor(submissionEntityService: SubmissionEntityService)
	{
		this.submissionEntityService = submissionEntityService;
	}

	public async create(submission: Submission, file: Express.Multer.File): Promise<string>
	{
		if(submission.id != undefined && submission.file != undefined)
			throw new BadRequest("The request body was either not present or did not contain a valid Submission object.");

		submission.id = randomBytes(8).toString("hex");
		submission.file = `${this.submissionLocation}/${submission.id}`;
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

	public async getList(submission: Submission): Promise<Submission[]>
	{
		const baseUrl = `/${basename(this.submissionLocation)}/`;
		const submissionEntities = await this.submissionEntityService.find({ where: submission });
		return submissionEntities.map((submissionEntity: SubmissionEntity): Submission =>
		{
			const submission = Submission.fromSubmissionEntity(submissionEntity);
			submission.file = baseUrl + basename(submission.file);

			return submission;
		});
	}
}
