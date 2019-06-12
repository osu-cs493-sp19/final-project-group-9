import { ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware } from "@tsed/common";
import { $log } from "ts-log-debug";
import "@tsed/typeorm";
import redis from "redis";
import RateLimit from "express-rate-limit";
//@ts-ignore
import RedisStore from "rate-limit-redis";

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
 	acceptMimes: ["application/json", "multipart/form-data"],
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
	],
	submissionLocation: `${process.cwd()}/submissions`,
	redis:
	{
		host: "localhost",
		port: 6379
	}
})
export class Server extends ServerLoader
{
	/**
	 * This method lets you configure the express middleware required by your application.
	 */
	public $onMountingMiddlewares(): void
	{
		const redisClient = redis.createClient(this.settings.get("redis.port"), this.settings.get("redis.host"));
		const redisLimiter = new RateLimit(
		{
			store: new RedisStore({ client: redisClient }),
			max: 100
		});

		this
			.use(GlobalAcceptMimesMiddleware)
			.use(express.json())
			.use(redisLimiter);
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
