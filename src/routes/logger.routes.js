// logger.routes.js
import express from 'express';
import { logInfo, logDebug, logWarning, logError, logFatal, testLogger } from '../controllers/logger.controllers.js';

const loggerRouter = express.Router();

loggerRouter.get('/info', logInfo);
loggerRouter.get('/debug', logDebug);
loggerRouter.get('/warning', logWarning);
loggerRouter.get('/error', logError);
loggerRouter.get('/fatal', logFatal);
loggerRouter.get('/loggerTest', testLogger);

export default loggerRouter;
