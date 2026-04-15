import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");
const baseHtmlPath = path.join(distDir, "index.html");

const routes = [
  { route: "/", title: "EduSystemDesign", description: "Plateforme UX/UI de conception de systemes de gestion pour l'enseignement superieur", robots: "index,follow" },
  { route: "/home", title: "Accueil | EduSystemDesign", description: "Accueil du projet UX/UI pour votre etablissement", robots: "noindex,nofollow" },
  { route: "/persona", title: "Persona | EduSystemDesign", description: "Creation de persona detaille", robots: "noindex,nofollow" },
  { route: "/journey-map", title: "Journey Map | EduSystemDesign", description: "Cartographie du parcours utilisateur", robots: "noindex,nofollow" },
  { route: "/poster", title: "Poster | EduSystemDesign", description: "Poster final et export PDF", robots: "noindex,nofollow" },
  { route: "/compare", title: "Comparaison | EduSystemDesign", description: "Comparaison multi-personas", robots: "noindex,nofollow" },
  { route: "/analytics", title: "Analytics | EduSystemDesign", description: "Dashboard d'insights UX", robots: "noindex,nofollow" },
  { route: "/present", title: "Presentation | EduSystemDesign", description: "Mode presentation", robots: "noindex,nofollow" },
];

function withSeo(html, { title, description, robots, route }) {
  const canonical = `https://example.com${route === "/" ? "" : route}`;
  return html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${description}" />\n    <meta name="robots" content="${robots}" />\n    <link rel="canonical" href="${canonical}" />`
    );
}

async function run() {
  const baseHtml = await readFile(baseHtmlPath, "utf8");
  await Promise.all(
    routes.map(async (entry) => {
      const routeDir =
        entry.route === "/"
          ? distDir
          : path.join(distDir, entry.route.replace(/^\/+/, ""));

      await mkdir(routeDir, { recursive: true });
      const html = withSeo(baseHtml, entry);
      await writeFile(path.join(routeDir, "index.html"), html, "utf8");
    })
  );
  console.log(`Prerendered route shells for ${routes.length} routes.`);
}

run().catch((err) => {
  console.error("Prerender route generation failed:", err);
  process.exit(1);
});

