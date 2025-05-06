import { IncomingMessage, ServerResponse } from "http";

export function optionsHandler(req: IncomingMessage, res: ServerResponse){
    res.writeHead(204);
    res.end();
    return;
}