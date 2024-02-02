// logger.controller.js
export const logInfo = (req, res) => {
    req.logger.info("Info");
    res.send("Info!");
};

export const logDebug = (req, res) => {
    req.logger.debug("Debug");
    res.send("Debug!");
};

export const logWarning = (req, res) => {
    req.logger.warning("Warning");
    res.send("Warning!");
};

export const logError = (req, res) => {
    req.logger.error("Error");
    res.send("Error!");
};

export const logFatal = (req, res) => {
    req.logger.fatal("Fatal");
    res.send("Fatal!");
};

export const testLogger = (req, res) => {
    req.logger.debug("Debug message");
    req.logger.info("Info message");
    req.logger.warning("Warning message");
    req.logger.error("Error message");
    req.logger.fatal("Fatal message");

    res.send("Logger test complete!");
};
