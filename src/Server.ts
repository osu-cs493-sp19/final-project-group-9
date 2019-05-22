import {ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware} from "@tsed/common";
import express from "express";

const rootDir = __dirname;

@ServerSettings(
{
 	rootDir,
	port: 8080,
	mount:
	{
		"/": "${rootDir}/controllers/**/*.ts"
	},
	componentsScan:
	[
		"${rootDir}/middleware/**/*.ts",
	    "${rootDir}/services/**/*.ts",
	    "${rootDir}/converters/**/*.ts"
	],
	logger:
	{
		level: "warn"
	},
 	acceptMimes: ["application/json"]
})
export class Server extends ServerLoader
{
	/**
	 * This method let you configure the express middleware required by your application to works.
	 * @returns {Server}
	 */
	public $onMountingMiddlewares(): void
	{
		this
			.use(GlobalAcceptMimesMiddleware)
			.use(express.json());
	}

	public $onReady(): void
	{
		console.log("Server initialized");
	}

	public $onServerInitError(error: Error): void {
		console.log("Server encounter an init error =>", error);
	}
}
