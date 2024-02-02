import { Router } from "express";
import { postCompra, getTicketDetails } from "../controllers/ticket.controllers";

const ticketRouter = Router();

ticketRouter.post("/:cid/purchase", postCompra);
ticketRouter.get("/:cid/purchase", getTicketDetails);

export default ticketRouter;
