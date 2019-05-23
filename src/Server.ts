import { ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware } from "@tsed/common";
import { $log } from "ts-log-debug";

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
	 * This method lets you configure the express middleware required by your application.
	 */
	public $onMountingMiddlewares(): void
	{
		this
			.use(GlobalAcceptMimesMiddleware)
			.use(express.json());
	}

	public $onReady(): void
	{
		$log.debug("Server initialized");
	}

	public $onServerInitError(error: Error): void {
		$log.error("Server encountered an init error =>", error);
	}
}
