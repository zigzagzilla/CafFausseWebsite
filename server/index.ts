import { spawn } from "child_process";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  console.log("Starting Flask server in production mode...");
  
  const flaskProcess = spawn("python", ["run.py"], {
    cwd: process.cwd(),
    stdio: "inherit",
    env: { ...process.env }
  });

  flaskProcess.on("error", (err) => {
    console.error("Failed to start Flask server:", err);
    process.exit(1);
  });

  flaskProcess.on("exit", (code) => {
    console.log(`Flask server exited with code ${code}`);
    process.exit(code || 0);
  });

  process.on("SIGTERM", () => {
    flaskProcess.kill("SIGTERM");
  });

  process.on("SIGINT", () => {
    flaskProcess.kill("SIGINT");
  });
} else {
  import("express").then(async ({ default: express }) => {
    const { registerRoutes } = await import("./routes");
    const { setupVite, serveStatic, log } = await import("./vite");
    
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use((req: any, res: any, next: any) => {
      const start = Date.now();
      const reqPath = req.path;
      let capturedJsonResponse: Record<string, any> | undefined = undefined;

      const originalResJson = res.json;
      res.json = function (bodyJson: any, ...args: any[]) {
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, [bodyJson, ...args]);
      };

      res.on("finish", () => {
        const duration = Date.now() - start;
        if (reqPath.startsWith("/api")) {
          let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
          if (capturedJsonResponse) {
            logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
          }

          if (logLine.length > 80) {
            logLine = logLine.slice(0, 79) + "…";
          }

          log(logLine);
        }
      });

      next();
    });

    const server = await registerRoutes(app);

    app.use((err: any, _req: any, res: any, _next: any) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    await setupVite(app, server);

    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });
  });
}
