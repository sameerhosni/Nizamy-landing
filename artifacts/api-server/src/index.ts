import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  if (!process.env["DATABASE_URL"]) {
    logger.error(
      "DATABASE_URL is NOT set — lead form submissions will fail with 503. Set the DATABASE_URL environment variable and restart.",
    );
  } else {
    logger.info("DATABASE_URL is set");
  }

  const smtpMissing = ["SMTP_HOST", "SMTP_PORT", "SMTP_USERNAME", "SMTP_PASSWORD"].filter(
    (k) => !process.env[k],
  );
  if (smtpMissing.length > 0) {
    logger.warn(
      { missing: smtpMissing },
      "SMTP is not fully configured — lead welcome emails will be skipped",
    );
  } else {
    logger.info("SMTP configuration present");
  }
});
