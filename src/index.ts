import { Server } from "./Server";

new Server().start()
	.then((): void =>
	{
		console.log("Server started...");
	})
	.catch((error: Error): void =>
	{
		console.error(error);
	});
