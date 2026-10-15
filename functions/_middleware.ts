const ARD_MANIFEST = {
  specVersion: "1.0",
  host: { displayName: "GeoSoft" },
  entries: [{
    identifier: "urn:air:geosoft:services:web-automation",
    displayName: "GeoSoft AI Automation & Web Development",
    type: "application/ai-catalog+json",
    url: "https://geosoftweb.pages.dev/assets/agent-card.json",
    representativeQueries: [
      "desarrollo de software y paginas web",
      "chatbots inteligentes e inteligencia artificial",
      "automatizacion de ventas y sistemas de reservas"
    ]
  }]
};

const AGENT_CARD = {
  name: "GeoSoft AI Automation & Web Development",
  description: "Desarrollo de software a medida, páginas web de alto impacto, agentes inteligentes 24/7 y sistemas de automatización que multiplican tus ventas.",
  version: "1.0.0",
  url: "https://geosoftweb.pages.dev/"
};

export const onRequest = async (context: any) => {
  const url = new URL(context.request.url);

  if (url.pathname === "/.well-known/ai-catalog.json" || url.pathname === "/ai-catalog.json") {
    return new Response(JSON.stringify(ARD_MANIFEST, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600"
      }
    });
  }

  if (url.pathname === "/assets/agent-card.json") {
    return new Response(JSON.stringify(AGENT_CARD, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600"
      }
    });
  }

  return context.next();
};