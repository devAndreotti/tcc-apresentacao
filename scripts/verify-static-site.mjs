import { createServer } from "node:http";
import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const repoRoot = process.cwd();
const parentRoot = path.dirname(repoRoot);
const repoName = path.basename(repoRoot);
const pages = [
  "index.html",
  "01_capa_v3/code.html",
  "02_contexto_v3/code.html",
  "03_pipeline_v3/code.html",
  "04_diferenciais_v3/code.html",
  "05_conclus_o_v3/code.html"
];

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"]
]);

function isInsideRoot(root, target) {
  const relative = path.relative(root, target);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

const failures = [];
const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
    const safePath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, "");
    let filePath = path.resolve(parentRoot, safePath);
    if (!isInsideRoot(parentRoot, filePath)) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    const fileStat = await stat(filePath).catch(() => null);
    if (fileStat?.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    await access(filePath);
    response.setHeader("Content-Type", mimeTypes.get(path.extname(filePath)) ?? "application/octet-stream");
    response.end(await readFile(filePath));
  } catch {
    response.writeHead(404).end("File not found");
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}/${repoName}/`;

let browser;
try {
  browser = await chromium.launch();
  const page = await browser.newPage();

  page.on("console", (message) => {
    if (message.type() === "error") {
      failures.push(`Console error: ${message.text()}`);
    }
  });

  page.on("pageerror", (error) => {
    failures.push(`Page error: ${error.message}`);
  });

  for (const pagePath of pages) {
    const response = await page.goto(new URL(pagePath, baseUrl).href, { waitUntil: "domcontentloaded" });
    if (!response || response.status() >= 400) {
      failures.push(`${pagePath} returned HTTP ${response?.status() ?? "no response"}`);
    }
  }

  await page.goto(new URL("index.html", baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".stitch-shell__link");

  const injectedLinks = await page.$$eval(".stitch-shell a[href], .stitch-help a[href]", (links) =>
    links.map((link) => ({
      text: link.textContent.replace(/\s+/g, " ").trim(),
      href: link.href
    }))
  );

  for (const link of injectedLinks) {
    const url = new URL(link.href);
    if (url.origin !== new URL(baseUrl).origin) {
      continue;
    }

    if (!url.pathname.startsWith(`/${repoName}/`)) {
      failures.push(`Injected link leaves Pages base path: ${link.text} -> ${url.pathname}`);
      continue;
    }

    const response = await page.request.get(url.href, { failOnStatusCode: false });
    if (response.status() >= 400) {
      failures.push(`Injected link is broken: ${link.text} -> ${url.pathname} (${response.status()})`);
    }
  }

  await page.setViewportSize({ width: 390, height: 844 });

  for (const pagePath of ["04_diferenciais_v3/code.html", "05_conclus_o_v3/code.html"]) {
    await page.goto(new URL(pagePath, baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);
    const result = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      const rect = h1?.getBoundingClientRect();
      return {
        heading: h1?.textContent.replace(/\s+/g, " ").trim() ?? "",
        headingRect: rect && {
          top: Math.round(rect.top),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          bottom: Math.round(rect.bottom)
        },
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight
      };
    });

    if (!result.headingRect || result.headingRect.top < 0 || result.headingRect.left < 0) {
      failures.push(`${pagePath} heading is clipped on mobile: ${JSON.stringify(result.headingRect)}`);
    }

    if (result.headingRect && result.headingRect.right > result.innerWidth) {
      failures.push(`${pagePath} heading overflows on mobile: ${JSON.stringify(result.headingRect)}`);
    }

    if (result.scrollWidth > result.innerWidth + 2) {
      failures.push(`${pagePath} has horizontal overflow on mobile: ${result.scrollWidth}px > ${result.innerWidth}px`);
    }
  }
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Static site verified under /${repoName}/`);
