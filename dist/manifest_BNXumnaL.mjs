import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import 'es-module-lexer';
import { N as NOOP_MIDDLEWARE_HEADER, h as decodeKey } from './chunks/astro/server_CWCt2Jmm.mjs';
import 'clsx';
import 'html-escaper';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///D:/websites/kalidass%20attempt/","adapterName":"","routes":[{"file":"file:///D:/websites/kalidass%20attempt/dist/calculator/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/calculator","isIndex":false,"type":"page","pattern":"^\\/calculator\\/?$","segments":[[{"content":"calculator","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/calculator.astro","pathname":"/calculator","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///D:/websites/kalidass%20attempt/dist/drivers/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/drivers","isIndex":false,"type":"page","pattern":"^\\/drivers\\/?$","segments":[[{"content":"drivers","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/drivers.astro","pathname":"/drivers","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///D:/websites/kalidass%20attempt/dist/services/acting-drivers/highway-copilot/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/services/acting-drivers/highway-copilot","isIndex":false,"type":"page","pattern":"^\\/services\\/acting-drivers\\/highway-copilot\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}],[{"content":"acting-drivers","dynamic":false,"spread":false}],[{"content":"highway-copilot","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services/acting-drivers/highway-copilot.astro","pathname":"/services/acting-drivers/highway-copilot","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///D:/websites/kalidass%20attempt/dist/services/acting-drivers/vehicle-relocation/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/services/acting-drivers/vehicle-relocation","isIndex":false,"type":"page","pattern":"^\\/services\\/acting-drivers\\/vehicle-relocation\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}],[{"content":"acting-drivers","dynamic":false,"spread":false}],[{"content":"vehicle-relocation","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services/acting-drivers/vehicle-relocation.astro","pathname":"/services/acting-drivers/vehicle-relocation","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///D:/websites/kalidass%20attempt/dist/services/business-travel/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/services/business-travel","isIndex":false,"type":"page","pattern":"^\\/services\\/business-travel\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}],[{"content":"business-travel","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services/business-travel.astro","pathname":"/services/business-travel","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///D:/websites/kalidass%20attempt/dist/services/employee-transportation/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/services/employee-transportation","isIndex":false,"type":"page","pattern":"^\\/services\\/employee-transportation\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}],[{"content":"employee-transportation","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services/employee-transportation.astro","pathname":"/services/employee-transportation","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///D:/websites/kalidass%20attempt/dist/services/events-mice/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/services/events-mice","isIndex":false,"type":"page","pattern":"^\\/services\\/events-mice\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}],[{"content":"events-mice","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services/events-mice.astro","pathname":"/services/events-mice","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///D:/websites/kalidass%20attempt/dist/services/executive-fleet/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/services/executive-fleet","isIndex":false,"type":"page","pattern":"^\\/services\\/executive-fleet\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}],[{"content":"executive-fleet","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services/executive-fleet.astro","pathname":"/services/executive-fleet","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///D:/websites/kalidass%20attempt/dist/services/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/services","isIndex":true,"type":"page","pattern":"^\\/services\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services/index.astro","pathname":"/services","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///D:/websites/kalidass%20attempt/dist/smart-travel-solution/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/smart-travel-solution","isIndex":false,"type":"page","pattern":"^\\/smart-travel-solution\\/?$","segments":[[{"content":"smart-travel-solution","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/smart-travel-solution.astro","pathname":"/smart-travel-solution","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///D:/websites/kalidass%20attempt/dist/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"https://kalidasstravels.in","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["D:/websites/kalidass attempt/src/pages/calculator.astro",{"propagation":"none","containsHead":true}],["D:/websites/kalidass attempt/src/pages/drivers.astro",{"propagation":"none","containsHead":true}],["D:/websites/kalidass attempt/src/pages/index.astro",{"propagation":"none","containsHead":true}],["D:/websites/kalidass attempt/src/pages/services/[slug].astro",{"propagation":"none","containsHead":true}],["D:/websites/kalidass attempt/src/pages/services/acting-drivers/highway-copilot.astro",{"propagation":"none","containsHead":true}],["D:/websites/kalidass attempt/src/pages/services/acting-drivers/vehicle-relocation.astro",{"propagation":"none","containsHead":true}],["D:/websites/kalidass attempt/src/pages/services/business-travel.astro",{"propagation":"none","containsHead":true}],["D:/websites/kalidass attempt/src/pages/services/category/[category].astro",{"propagation":"none","containsHead":true}],["D:/websites/kalidass attempt/src/pages/services/employee-transportation.astro",{"propagation":"none","containsHead":true}],["D:/websites/kalidass attempt/src/pages/services/events-mice.astro",{"propagation":"none","containsHead":true}],["D:/websites/kalidass attempt/src/pages/services/executive-fleet.astro",{"propagation":"none","containsHead":true}],["D:/websites/kalidass attempt/src/pages/services/index.astro",{"propagation":"none","containsHead":true}],["D:/websites/kalidass attempt/src/pages/smart-travel-solution.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:src/pages/calculator@_@astro":"pages/calculator.astro.mjs","\u0000@astro-page:src/pages/drivers@_@astro":"pages/drivers.astro.mjs","\u0000@astro-page:src/pages/og/[slug].jpg@_@ts":"pages/og/_slug_.jpg.astro.mjs","\u0000@astro-page:src/pages/services/acting-drivers/highway-copilot@_@astro":"pages/services/acting-drivers/highway-copilot.astro.mjs","\u0000@astro-page:src/pages/services/acting-drivers/vehicle-relocation@_@astro":"pages/services/acting-drivers/vehicle-relocation.astro.mjs","\u0000@astro-page:src/pages/services/business-travel@_@astro":"pages/services/business-travel.astro.mjs","\u0000@astro-page:src/pages/services/category/[category]@_@astro":"pages/services/category/_category_.astro.mjs","\u0000@astro-page:src/pages/services/employee-transportation@_@astro":"pages/services/employee-transportation.astro.mjs","\u0000@astro-page:src/pages/services/events-mice@_@astro":"pages/services/events-mice.astro.mjs","\u0000@astro-page:src/pages/services/executive-fleet@_@astro":"pages/services/executive-fleet.astro.mjs","\u0000@astro-page:src/pages/services/[slug]@_@astro":"pages/services/_slug_.astro.mjs","\u0000@astro-page:src/pages/services/index@_@astro":"pages/services.astro.mjs","\u0000@astro-page:src/pages/smart-travel-solution@_@astro":"pages/smart-travel-solution.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-manifest":"manifest_BNXumnaL.mjs","lucide-react":"_astro/_astro-entry_lucide-react.D1MOnBuk.js","D:/websites/kalidass attempt/src/components/VehicleRelocation.jsx":"_astro/VehicleRelocation.qV5lFWJt.js","D:/websites/kalidass attempt/src/components/HighwayCopilotFaq.jsx":"_astro/HighwayCopilotFaq.C1YmMv1s.js","D:/websites/kalidass attempt/src/components/EmployeeTransportation.jsx":"_astro/EmployeeTransportation.BDBwjhsa.js","/astro/hoisted.js?q=1":"_astro/hoisted.3tFgPspN.js","D:/websites/kalidass attempt/node_modules/html2canvas/dist/html2canvas.esm.js":"_astro/html2canvas.esm.BfxBtG_O.js","D:/websites/kalidass attempt/node_modules/dompurify/dist/purify.es.mjs":"_astro/purify.es.B6FQ9oRL.js","D:/websites/kalidass attempt/node_modules/workbox-window/build/workbox-window.prod.es5.mjs":"_astro/workbox-window.prod.es5.vqzQaGvo.js","D:/websites/kalidass attempt/src/components/BusinessTravel.jsx":"_astro/BusinessTravel.BsOwuFU_.js","D:/websites/kalidass attempt/src/components/ActingDrivers.jsx":"_astro/ActingDrivers.B5ysaLNy.js","D:/websites/kalidass attempt/src/components/EventsMice.jsx":"_astro/EventsMice.CvEkNZ5D.js","D:/websites/kalidass attempt/src/components/ExecutiveFleet.jsx":"_astro/ExecutiveFleet.Bh0VYAeH.js","D:/websites/kalidass attempt/src/components/QuotationEngine.jsx":"_astro/QuotationEngine.AdZSlrpt.js","@astrojs/react/client.js":"_astro/client.BHSq4mdQ.js","D:/websites/kalidass attempt/node_modules/canvg/lib/index.es.js":"_astro/index.es.CAgi5C9D.js","D:/websites/kalidass attempt/src/components/VehicleRelocationCalculator.jsx":"_astro/VehicleRelocationCalculator.3GBu7ezm.js","/astro/hoisted.js?q=0":"_astro/hoisted.B3Wnh3Hh.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/file:///D:/websites/kalidass%20attempt/dist/calculator/index.html","/file:///D:/websites/kalidass%20attempt/dist/drivers/index.html","/file:///D:/websites/kalidass%20attempt/dist/services/acting-drivers/highway-copilot/index.html","/file:///D:/websites/kalidass%20attempt/dist/services/acting-drivers/vehicle-relocation/index.html","/file:///D:/websites/kalidass%20attempt/dist/services/business-travel/index.html","/file:///D:/websites/kalidass%20attempt/dist/services/employee-transportation/index.html","/file:///D:/websites/kalidass%20attempt/dist/services/events-mice/index.html","/file:///D:/websites/kalidass%20attempt/dist/services/executive-fleet/index.html","/file:///D:/websites/kalidass%20attempt/dist/services/index.html","/file:///D:/websites/kalidass%20attempt/dist/smart-travel-solution/index.html","/file:///D:/websites/kalidass%20attempt/dist/index.html"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"uflIS4dzYDalRvXIDsOaRTok3YTAOed0w1DV5ccKx/Q=","experimentalEnvGetSecretEnabled":false});

export { manifest };
