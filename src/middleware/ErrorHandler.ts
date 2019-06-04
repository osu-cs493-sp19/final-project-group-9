import { Exception } from "ts-httpexceptions";
import { Err, GlobalErrorHandlerMiddleware, OverrideProvider, Req, Res } from "@tsed/common";
import { $log } from "ts-log-debug";

@OverrideProvider(GlobalErrorHandlerMiddleware)
export class ErrorHandler extends GlobalErrorHandlerMiddleware
{
	public use(
		@Err() error: any,
		@Req() request: Req,
		@Res() response: Res
	): Res
	{
		if(error instanceof Exception)
		{
			$log.info(error);
			return response.status(error.status).send({ error: error.message });
		}

		$log.error(error);
		return response.status(500).send({ error: "Internal Error" });
	}
}
