// Static reference for the Takealot Seller API (v1).
// No credentials live here: the API key is held in the TAKEALOT_API_KEY
// server-side secret and is only ever read by the backend proxy.

export const TAKEALOT_API = {
  sellerId: '29855565',
  sellerName: 'Fruitful Shops',
  baseUrl: 'https://marketplace-api.takealot.com',
  version: 'v1',
  docsUrl: 'https://marketplace-api.takealot.com/v1/docs',
  authHeader: 'X-API-Key',
  sandbox: false,
};

// Registered under Seller API -> Webhooks in the Takealot Seller Portal.
export const WEBHOOK_ENDPOINT = 'https://fruitfulapp.base44.app/functions/takealotWebhook';

export const MAX_DATE_WINDOW_DAYS = 180;
export const BATCH_MAX_UPDATES = 10000;

export const TAKEALOT_RESOURCES = [
  {
    key: 'offers',
    label: 'Offers',
    entity: 'TakealotOffer',
    detail: 'Selling price, RRP, leadtime days and stock on hand.',
    dateWindowed: false,
  },
  {
    key: 'sales',
    label: 'Sales',
    entity: 'TakealotSale',
    detail: 'Sales records and their status lifecycles.',
    dateWindowed: true,
  },
  {
    key: 'transactions',
    label: 'Transactions',
    entity: 'TakealotTransaction',
    detail: 'Every transaction on the seller account.',
    dateWindowed: true,
  },
  {
    key: 'returns',
    label: 'Returns',
    entity: 'TakealotReturn',
    detail: 'Customer returns against the account.',
    dateWindowed: true,
  },
  {
    key: 'shipments',
    label: 'Shipments',
    entity: 'TakealotShipment',
    detail: 'Shipment and dispatch information.',
    dateWindowed: true,
  },
];

export const TAKEALOT_WEBHOOK_TYPES = [
  {
    key: 'offer_update',
    label: 'Offer Updated',
    detail: 'Latest offer values, including stock changes.',
  },
  {
    key: 'offer_creation',
    label: 'Offer Creation',
    detail: 'An offer was created for the seller account.',
  },
  {
    key: 'batch_completed',
    label: 'Batch Completed',
    detail: 'A batch finished — the trigger to read the batch result.',
  },
  {
    key: 'new_leadtime_order',
    label: 'New Leadtime Order',
    detail: 'A new leadtime order needs fulfilment.',
  },
  {
    key: 'new_dropship_order',
    label: 'New Dropship Order',
    detail: 'A new dropship order needs fulfilment.',
  },
  {
    key: 'sale_status_changed',
    label: 'Sale Status Changed',
    detail: 'Carries the full sale, so the sales endpoint needs no re-query.',
  },
];

export const RATE_LIMIT_HEADERS = [
  { header: 'X-RateLimit-Limit', meaning: 'Requests allowed in the current window.' },
  { header: 'X-RateLimit-Remaining', meaning: 'Requests left in this window.' },
  { header: 'X-RateLimit-Reset', meaning: 'When the window and remaining requests reset.' },
];

export const TAKEALOT_RULES = [
  `Pull at most ${MAX_DATE_WINDOW_DAYS} days per date-filtered request and page through until no records remain.`,
  'Treat a webhook payload as the current record — do not re-query the API after receiving one.',
  `Batch offer writes run up to ${BATCH_MAX_UPDATES.toLocaleString()} updates at a time, with completion confirmed by the Batch Completed webhook.`,
  'Update a single offer by its offer_id rather than its SKU.',
  'Back off exponentially on HTTP 429 and read the rate-limit headers on every response.',
];