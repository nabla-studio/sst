/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "cloudflare-d1-static",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "cloudflare",
    };
  },
  async run() {
    const accountId = "ACCOUNT_ID_HERE";
    const dbId = "DB_ID_HERE";

    const db = $app.stage === "giorgio" ? sst.cloudflare.D1.get("MyDatabase", accountId, dbId) : new sst.cloudflare.D1("MyDatabase");
    
    const worker = new sst.cloudflare.Worker("Worker", {
      link: [db],
      url: true,
      handler: "index.ts",
    });

    return {
      dbId: db["database"].id,
      dbName: db["database"].name,
      url: worker.url,
    };
  },
});
