import { ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware } from "@tsed/common";
import { $log } from "ts-log-debug";
import "@tsed/typeorm";

import express from "express";

const rootDir = __dirname;

@ServerSettings(
{
 	rootDir,
	port: 8080,
	mount:
	{
		"/": `${rootDir}/controllers/**/*.ts`
	},
	componentsScan:
	[
		`${rootDir}/middleware/**/*.ts`,
	    `${rootDir}/services/**/*.ts`,
	    `${rootDir}/converters/**/*.ts`,
		`${rootDir}/repos/**/*.ts`
	],
	logger:
	{
		level: "error"
	},
 	acceptMimes: ["application/json"],
	typeorm:
	[
		{
			"name": "default",
			"type": "mysql",
			"host": "localhost",
			"port": 3306,
			"username": "tarpaulin",
			"password": "tarpaulin",
			"database": "tarpaulin-db",
			"synchronize": false,
			"logging": false,
			"entities": [`${rootDir}/entities/**/*.ts`],
			"migrations": [`${rootDir}/migration/**/*.ts`],
			"subscribers": [`${rootDir}/subscriber/**/*.ts`]
		}
	]
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

	public $onServerInitError(error: Error): void
	{
		$log.error("Server encountered an init error =>", error);
	}
}
