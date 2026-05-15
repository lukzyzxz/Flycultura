// FlyCultura — k6 load test
// Cobre frontend (CDN) + edge functions críticas (busca de hotéis, destinos, voos, IA).
//
// Rodar:
//   k6 run loadtest/flycultura-loadtest.js
//
// Variáveis de ambiente (todas opcionais):
//   BASE_URL    URL do frontend publicado     (default: https://flycultura.lovable.app)
//   SUPA_URL    URL do backend (Lovable Cloud) (default: https://xoiwbtlpeftitknmozif.supabase.co)
//   SUPA_ANON   Chave pública anon            (default: a chave publishable do projeto)
//   JWT         Token de um usuário logado    (necessário p/ funções autenticadas)
//   STAGE       smoke | load | stress         (default: smoke)
//
// Exemplos:
//   k6 run -e STAGE=smoke   loadtest/flycultura-loadtest.js
//   k6 run -e STAGE=load    -e JWT="eyJhbGciOi..." loadtest/flycultura-loadtest.js
//   k6 run -e STAGE=stress  -e JWT="eyJhbGciOi..." loadtest/flycultura-loadtest.js

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'https://flycultura.lovable.app';
const SUPA_URL = __ENV.SUPA_URL || 'https://xoiwbtlpeftitknmozif.supabase.co';
const SUPA_ANON =
  __ENV.SUPA_ANON ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvaXdidGxwZWZ0aXRrbm1vemlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2ODQ1NjAsImV4cCI6MjA4OTI2MDU2MH0.qO2FfZ86lwyExknpr7aCwCkslNWFvnccdC9kme-zNz0';
const JWT = __ENV.JWT || ''; // se vazio, pula chamadas autenticadas
const STAGE = (__ENV.STAGE || 'smoke').toLowerCase();

// Perfis de carga — VUs graduais
const STAGES = {
  smoke: [
    { duration: '30s', target: 5 },
    { duration: '1m',  target: 5 },
    { duration: '20s', target: 0 },
  ],
  load: [
    { duration: '1m', target: 20 },
    { duration: '3m', target: 50 },
    { duration: '2m', target: 50 },
    { duration: '1m', target: 0 },
  ],
  stress: [
    { duration: '1m', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '2m', target: 200 },
    { duration: '1m', target: 0 },
  ],
};

const errorRate = new Rate('errors');
const edgeLatency = new Trend('edge_function_latency', true);

export const options = {
  stages: STAGES[STAGE] || STAGES.smoke,
  thresholds: {
    http_req_failed:   ['rate<0.05'],          // <5% de falhas
    http_req_duration: ['p(95)<2500'],         // p95 < 2.5s
    errors:            ['rate<0.10'],
    edge_function_latency: ['p(95)<5000'],     // edge functions mais lentas
  },
  summaryTrendStats: ['avg', 'min', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
};

const supaHeaders = () => {
  const h = {
    'Content-Type': 'application/json',
    apikey: SUPA_ANON,
    Authorization: `Bearer ${JWT || SUPA_ANON}`,
  };
  return h;
};

const ORIGINS = ['GRU', 'GIG', 'BSB', 'CNF', 'POA'];
const DESTS = ['JFK', 'LIS', 'MAD', 'CDG', 'FCO'];
const QUERIES = ['Lisboa', 'Paris', 'Roma', 'Nova York', 'Madri'];
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function callEdge(name, body) {
  const res = http.post(`${SUPA_URL}/functions/v1/${name}`, JSON.stringify(body), {
    headers: supaHeaders(),
    tags: { endpoint: name },
  });
  edgeLatency.add(res.timings.duration, { endpoint: name });
  const ok = check(res, {
    [`${name} status<500`]: (r) => r.status < 500,
  });
  errorRate.add(!ok);
  return res;
}

export default function () {
  // 1) Frontend (CDN) — sempre roda
  group('frontend', () => {
    const pages = ['/', '/event-packages', '/deals', '/blog'];
    const res = http.get(`${BASE_URL}${pick(pages)}`, { tags: { endpoint: 'frontend' } });
    const ok = check(res, { 'frontend 200': (r) => r.status === 200 });
    errorRate.add(!ok);
  });

  sleep(1);

  // 2) Edge functions — só com JWT (caso contrário 401 e estraga métrica)
  if (JWT) {
    group('search-destinations', () => {
      callEdge('search-destinations', { query: pick(QUERIES) });
    });

    sleep(1);

    group('search-flights', () => {
      const today = new Date();
      const dep = new Date(today.getTime() + 7 * 86400000).toISOString().slice(0, 10);
      const ret = new Date(today.getTime() + 14 * 86400000).toISOString().slice(0, 10);
      callEdge('search-flights', {
        origin: pick(ORIGINS),
        destination: pick(DESTS),
        departureDate: dep,
        returnDate: ret,
        adults: 1,
      });
    });

    sleep(1);

    // search-hotels e generate-itinerary consomem cota/$. Reduza a frequência.
    if (Math.random() < 0.3) {
      group('search-hotels', () => {
        const today = new Date();
        const ci = new Date(today.getTime() + 7 * 86400000).toISOString().slice(0, 10);
        const co = new Date(today.getTime() + 10 * 86400000).toISOString().slice(0, 10);
        callEdge('search-hotels', {
          dest_id: '20088325',
          search_type: 'CITY',
          checkin: ci,
          checkout: co,
          adults: 1,
          currency_code: 'BRL',
        });
      });
    }

    if (Math.random() < 0.1) {
      group('generate-itinerary', () => {
        callEdge('generate-itinerary', {
          destination: pick(QUERIES),
          days: 3,
          interests: 'cultura, gastronomia',
          budget: 5000,
          locale: 'pt',
        });
      });
    }
  }

  sleep(Math.random() * 2 + 1); // think time 1–3s
}

export function handleSummary(data) {
  return {
    stdout: textSummary(data),
    'loadtest/summary.json': JSON.stringify(data, null, 2),
  };
}

function textSummary(data) {
  const m = data.metrics;
  const get = (k, s = 'avg') => (m[k] && m[k].values ? m[k].values[s] : '-');
  return `
FlyCultura load test — stage: ${STAGE}
----------------------------------------
VUs máx:           ${get('vus_max', 'max')}
Requisições:       ${get('http_reqs', 'count')}
Falhas (%):        ${(get('http_req_failed', 'rate') * 100).toFixed(2)}
Latência avg:      ${Number(get('http_req_duration', 'avg')).toFixed(0)} ms
Latência p95:      ${Number(get('http_req_duration', 'p(95)')).toFixed(0)} ms
Edge p95:          ${Number(get('edge_function_latency', 'p(95)')).toFixed(0)} ms
Erros (custom):    ${(get('errors', 'rate') * 100).toFixed(2)} %
`;
}