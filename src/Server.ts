import { ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware } from "@tsed/common";
import { $log } from "ts-log-debug";
import "@tsed/typeorm";
import redis from "redis";
import RateLimit from "express-rate-limit";
//@ts-ignore
import RedisStore from "rate-limit-redis";

import express from "express";

const rootDir = __dirname;
const PORT = Number(process.env.PORT) || 8080;
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PORT = process.env.DB_PORT || 3306;
const DB_PASS = process.env.DB_PASS;
const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || 6379;

@ServerSettings(
{
 	rootDir,
	port: PORT,
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
			"host": DB_HOST,
			"port": DB_PORT,
			"username": DB_USER,
			"password": DB_PASS,
			"database": DB_NAME,
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
		host: REDIS_HOST,
		port: REDIS_PORT
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
