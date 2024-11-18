import { Express } from "express";
import * as express from "express";
import * as cors from "cors";
import { routePaymentMethods } from "./routes/routePaymentMethod";
import { routeUnitsOfMeasurement } from "./routes/routeUnitsOfMeasurement";
import { routeLogin } from "./routes/routeLogin";
import { routeUsers } from "./routes/routeUsers";
import { routeEmail } from "./routes/routeEmail";
import { routePdfGenerator } from "./routes/routePdfGenerator";

let server: Express = express();
const serverPort = 4000;

server.use(cors());
server.use(express.json());
server.use(routeLogin);
server.use(routePaymentMethods);
server.use(routeUnitsOfMeasurement);
server.use(routeUsers);
server.use(routeEmail);
server.use(routePdfGenerator);

server.listen(serverPort, () =>
{
    console.log("Server started on port " + serverPort);
});
