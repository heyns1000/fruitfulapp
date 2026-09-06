import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Shield, Code2, Database, Layers, GitBranch, Bot, CheckCircle2, AlertTriangle, FileText, Server, Zap } from 'lucide-react';

const SECTIONS = [
  { id: 'overview', label: 'Architecture Overview', icon: Layers },
  { id: 'golden-rule', label: 'The Golden Rule', icon: Shield },
  { id: 'safe-ops', label: 'Safe vs Dangerous Ops', icon: AlertTriangle },
  { id: 'structure', label: 'Plugin Structure', icon: FileText },
  { id: 'api-client', label: 'API Client', icon: Server },
  { id: 'cache', label: 'Cache Strategy', icon: Zap },
  { id: 'rest-routes', label: 'Narrow REST Routes', icon: Code2 },
  { id: 'banimal', label: 'Banimal Connector', icon: GitBranch },
  { id: 'forms', label: 'Form / Lead Workflow', icon: Database },
  { id: 'ai', label: 'AI Integration', icon: Bot },
  { id: 'data-mapping', label: 'Data Mapping', icon: Database },
  { id: 'security', label: 'Security Checklist', icon: Shield },
  { id: 'phases', label: 'Dev Phases', icon: GitBranch },
  { id: 'done', label: 'Definition of Done', icon: CheckCircle2 },
];

const CodeBlock = ({ children, lang = 'php' }) => (
  <pre className="text-xs text-teal-300 font-mono leading-relaxed overflow-x-auto bg-slate-950 rounded-lg p-4 border border-slate-700">{children}</pre>
);

const SectionTitle = ({ children }) => (
  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-teal-400 mb-4 border-b border-slate-700 pb-2">{children}</h2>
);

export default function FruitfulWordPressDocs() {
  const [active, setActive] = useState('overview');

  const renderSection = () => {
    switch (active) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-teal-700 rounded-xl p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-400 mb-1">Fruitful App → WordPress + Elementor</p>
              <h1 className="text-2xl font-black text-white mb-3">Integration Architecture Blueprint</h1>
              <p className="text-slate-400 text-sm max-w-3xl">
                Use the Fruitful app/API as the controlled data and automation backbone for multiple WordPress + Elementor websites—including Banimal—without exposing secrets or making each website a separate unmanaged system. Grounded in the Fruitful OpenAPI specification (Brand, DirectoryEntry, BarcodeMapping, SubscriptionBox, Metrics, SageItemRaw).
              </p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>System Architecture</SectionTitle>
              <CodeBlock lang="text">{`Fruitful Core App and approved APIs
        │
        │  Server-to-server authenticated requests
        ▼
Shared WordPress Integration Layer
  (API client • caching • schema validation • logs • security)
        │
        ├── Banimal Ecosystem Connector
        ├── Future Fruitful brand connectors
        └── Shared WordPress integration library
        │
        ▼
Elementor widgets, controls, forms and templates
        │
        ▼
Public WordPress websites

The public visitor sees a fast website.
The editor sees Elementor controls.
The browser never sees your private Fruitful API tokens.`}</CodeBlock>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>What This System Can Build</SectionTitle>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-700">
                      <th className="pb-2 pr-4">Website Type</th>
                      <th className="pb-2 pr-4">Elementor Displays</th>
                      <th className="pb-2">Fruitful App Provides</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {[
                      ['Brand website', 'Hero sections, brand stories, stockists, campaigns', 'Brand profile, approved copy, design tokens, locations'],
                      ['E-commerce site', 'Product grids, collections, product finders', 'Product catalogue, SKU/barcode mappings, stock data'],
                      ['Directory / marketplace', 'Searchable listings, filters, maps, profiles', 'DirectoryEntry records, categories, regions'],
                      ['Wholesale portal', 'Account request forms, catalogue cards', 'Brand data, product data, CRM/lead events'],
                      ['Subscription service', 'Plan comparisons, sign-up flows', 'SubscriptionBox records, pricing metadata'],
                      ['Operations dashboard', 'Private admin displays, health checks', 'Metrics and operational entity records'],
                      ['AI-assisted content site', 'Drafted sections, FAQs, product stories', 'Approved brand rules, structured product facts'],
                      ['Banimal website', 'Brand hero, products, animal-focused forms', 'Banimal brand data, WooCommerce, Worker workflows'],
                    ].map(([type, display, provides]) => (
                      <tr key={type} className="hover:bg-slate-700/30">
                        <td className="py-2.5 pr-4 font-bold text-teal-400">{type}</td>
                        <td className="py-2.5 pr-4 text-slate-300">{display}</td>
                        <td className="py-2.5 text-slate-400">{provides}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'golden-rule':
        return (
          <div className="space-y-6">
            <div className="bg-red-950/30 border border-red-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h2 className="text-xl font-black text-white">Your WordPress browser is not your backend.</h2>
              </div>
              <p className="text-slate-300 text-sm mb-4">Never allow Elementor, visitor-facing JavaScript, public page HTML, or a WordPress page export to contain any of the following:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Fruitful API secret keys', 'Banimal Worker secrets', 'Bearer tokens', 'Database passwords', 'Webhook signing secrets', 'Private API base URLs', 'Unrestricted write permissions', 'AI-provider keys'].map(item => (
                  <div key={item} className="bg-red-950/50 border border-red-800 rounded-lg p-2.5 text-xs text-red-300 flex items-start gap-1.5">
                    <span className="text-red-500 mt-0.5">✕</span>{item}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-emerald-950/30 border border-emerald-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <h2 className="text-xl font-black text-white">Safe Direction Instead</h2>
              </div>
              <CodeBlock lang="text">{`Visitor or Elementor editor browser
        │
        │ Only public data or authenticated WordPress requests
        ▼
WordPress plugin
        │
        │ Protected, server-to-server authentication
        ▼
Fruitful app / Banimal Worker / approved AI service`}</CodeBlock>
            </div>
          </div>
        );

      case 'safe-ops':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>Which API Operations Are Safe</SectionTitle>
              <p className="text-slate-400 text-sm mb-4">The Fruitful OpenAPI file contains broad entity CRUD patterns—list, get-by-ID, create, update, bulk operations, soft deletes, and restore. Not every operation belongs in a public-facing website.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-700">
                      <th className="pb-2 pr-4">Action</th>
                      <th className="pb-2 pr-4">Recommended Access</th>
                      <th className="pb-2">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {[
                      ['Show products, brands, directory listings', 'Read-only GET, usually cached', 'Low risk when data is explicitly public', 'safe'],
                      ['Elementor editor previews', 'WordPress-authenticated read route', 'Editors may see draft or restricted data', 'safe'],
                      ['Submit contact/quote/wholesale form', 'Server-side POST to narrow lead endpoint', 'Validate and minimise data before sending', 'safe'],
                      ['Update public profile (logged-in user)', 'Dedicated limited route with ownership checks', 'Never expose generic entity update routes', 'warn'],
                      ['Create a new product', 'Admin-only app workflow, not public Elementor', 'Needs validation, approvals, audit trail', 'warn'],
                      ['Bulk update records', 'Central app only', 'High blast radius if configured incorrectly', 'danger'],
                      ['Delete many records', 'Central app only, protected and reviewed', 'Empty delete query can delete ALL records in an entity', 'danger'],
                      ['Restore soft-deleted records', 'Central app only', 'Operational recovery requiring permission', 'danger'],
                    ].map(([action, access, reason, level]) => (
                      <tr key={action} className="hover:bg-slate-700/30">
                        <td className="py-2.5 pr-4 font-bold text-white">{action}</td>
                        <td className="py-2.5 pr-4 text-slate-300">{access}</td>
                        <td className={`py-2.5 text-xs ${level === 'danger' ? 'text-red-400' : level === 'warn' ? 'text-amber-400' : 'text-slate-400'}`}>{reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-red-950/30 border border-red-700 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-300 text-sm">
                  <strong>Critical warning from OpenAPI spec:</strong> Some entity delete-many endpoints can delete <strong>all</strong> records when an empty query is supplied. Never surface generic bulk-delete controls through Elementor or public WordPress routes.
                </p>
              </div>
            </div>
          </div>
        );

      case 'structure':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>Repository Layout</SectionTitle>
              <CodeBlock lang="text">{`fruitful-platform/
├── apps/
│   ├── fruitful-core-app/                 ← central app/API
│   ├── banimal-worker/                    ← Banimal domain workflows
│   └── other-apps/
├── packages/
│   ├── fruitful-api-contracts/            ← OpenAPI-derived schemas/types
│   ├── fruitful-brand-tokens/             ← shared colour/type/spacing tokens
│   └── fruitful-content-rules/            ← approved content constraints
├── wordpress-plugins/
│   ├── fruitful-wordpress-core/           ← shared API/security/cache layer
│   ├── banimal-ecosystem-connector/       ← Banimal-specific integration
│   └── fruitful-elementor-toolkit/        ← optional reusable Elementor base
└── docs/
    ├── architecture/
    ├── runbooks/
    └── api/`}</CodeBlock>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>Shared Core Plugin Structure</SectionTitle>
              <CodeBlock lang="text">{`wordpress-plugins/fruitful-wordpress-core/
├── fruitful-wordpress-core.php
├── includes/
│   ├── class-plugin.php
│   ├── class-settings.php
│   ├── class-api-client.php
│   ├── class-cache.php
│   ├── class-rest-api.php
│   ├── class-logger.php
│   ├── class-permissions.php
│   └── class-schema-validator.php
└── uninstall.php`}</CodeBlock>
              <p className="text-slate-400 text-xs mt-3">The shared plugin must not contain Banimal-only labels, widgets, or business rules. It provides API transport, security, caching, audit-friendly logging, and common REST patterns.</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>Main Plugin File</SectionTitle>
              <CodeBlock>{`<?php
/**
 * Plugin Name: Fruitful WordPress Core
 * Description: Shared Fruitful API, security, caching and WordPress integration layer.
 * Version: 1.0.0
 * Author: Fruitful Holdings (Pty) Ltd
 */

defined( 'ABSPATH' ) || exit;

define( 'FRUITFUL_WP_CORE_VERSION', '1.0.0' );
define( 'FRUITFUL_WP_CORE_FILE', __FILE__ );
define( 'FRUITFUL_WP_CORE_PATH', plugin_dir_path( __FILE__ ) );

require_once FRUITFUL_WP_CORE_PATH . 'includes/class-plugin.php';
require_once FRUITFUL_WP_CORE_PATH . 'includes/class-settings.php';
require_once FRUITFUL_WP_CORE_PATH . 'includes/class-api-client.php';
require_once FRUITFUL_WP_CORE_PATH . 'includes/class-cache.php';
require_once FRUITFUL_WP_CORE_PATH . 'includes/class-rest-api.php';
require_once FRUITFUL_WP_CORE_PATH . 'includes/class-logger.php';

add_action( 'plugins_loaded', static function() {
    Fruitful_WP_Core_Plugin::instance();
    Fruitful_WP_Core_REST_API::instance();
});`}</CodeBlock>
            </div>
            <div className="bg-amber-950/30 border border-amber-700 rounded-xl p-6">
              <SectionTitle>Secrets Outside Source Code</SectionTitle>
              <p className="text-slate-300 text-sm mb-3">On a secure server, add configuration to <code className="text-amber-400">wp-config.php</code> or the host's environment-variable panel:</p>
              <CodeBlock>{`// Example only. Do not commit real values into Git.
define( 'FRUITFUL_API_BASE_URL', 'https://api.example.internal' );
define( 'FRUITFUL_API_TOKEN', 'replace-with-a-long-random-server-side-secret' );
define( 'FRUITFUL_API_TIMEOUT', 15 );`}</CodeBlock>
              <p className="text-amber-300 text-xs mt-3">Never paste a real token into this README, GitHub issue, chat, Elementor control, screenshot, browser JavaScript, or public repository.</p>
            </div>
          </div>
        );

      case 'api-client':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>Shared Fruitful API Client</SectionTitle>
              <p className="text-slate-400 text-sm mb-4">The API client is the only code that should make outgoing calls to the Fruitful Core App.</p>
              <CodeBlock>{`<?php
defined( 'ABSPATH' ) || exit;

final class Fruitful_WP_Core_API_Client {

    public function get( $path, array $query = array() ) {
        return $this->request( 'GET', $path, null, $query );
    }

    public function post( $path, array $payload ) {
        return $this->request( 'POST', $path, $payload );
    }

    private function request( $method, $path, $payload = null, array $query = array() ) {
        $base_url = rtrim( (string) FRUITFUL_API_BASE_URL, '/' );
        $token    = (string) FRUITFUL_API_TOKEN;
        $timeout  = defined( 'FRUITFUL_API_TIMEOUT' ) ? absint( FRUITFUL_API_TIMEOUT ) : 15;

        if ( empty( $base_url ) || empty( $token ) ) {
            return new WP_Error( 'fruitful_api_not_configured',
                __( 'Fruitful API is not configured.', 'fruitful-wordpress-core' ) );
        }

        $url  = add_query_arg( $query, $base_url . '/' . ltrim( $path, '/' ) );
        $args = array(
            'method'  => strtoupper( $method ),
            'timeout' => $timeout,
            'headers' => array(
                'Accept'        => 'application/json',
                'Authorization' => 'Bearer ' . $token,
                'User-Agent'    => 'Fruitful-WordPress-Core/' . FRUITFUL_WP_CORE_VERSION,
            ),
        );

        if ( null !== $payload ) {
            $args['headers']['Content-Type'] = 'application/json';
            $args['body']                    = wp_json_encode( $payload );
        }

        $response = wp_remote_request( $url, $args );
        if ( is_wp_error( $response ) ) return $response;

        $status = (int) wp_remote_retrieve_response_code( $response );
        $body   = wp_remote_retrieve_body( $response );
        $data   = json_decode( $body, true );

        if ( $status < 200 || $status >= 300 ) {
            return new WP_Error( 'fruitful_api_error',
                __( 'Fruitful API request was unsuccessful.' ),
                array( 'status' => $status ) );
        }
        return $data;
    }
}`}</CodeBlock>
            </div>
            <div className="bg-blue-950/30 border border-blue-700 rounded-xl p-4">
              <p className="text-blue-300 text-sm">
                <strong>Note:</strong> The <code className="text-blue-400">Authorization: Bearer</code> convention is an example. Use the exact authentication scheme required by your deployed Fruitful API. If you use request signatures instead of bearer tokens, implement those signatures only in this server-side client.
              </p>
            </div>
          </div>
        );

      case 'cache':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>Cache Public Read Data</SectionTitle>
              <p className="text-slate-400 text-sm mb-4">Do not call your app API every time a public page loads. It creates cost, slow pages, rate-limit pressure, and a single point of failure.</p>
              <CodeBlock>{`<?php
defined( 'ABSPATH' ) || exit;

final class Fruitful_WP_Core_Cache {

    public static function remember( $key, $seconds, callable $callback ) {
        $cache_key = 'fruitful_' . md5( $key );
        $value     = get_transient( $cache_key );

        if ( false !== $value ) return $value;

        $value = call_user_func( $callback );

        if ( ! is_wp_error( $value ) ) {
            set_transient( $cache_key, $value, absint( $seconds ) );
        }
        return $value;
    }

    public static function forget( $key ) {
        delete_transient( 'fruitful_' . md5( $key ) );
    }
}`}</CodeBlock>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>Example Usage</SectionTitle>
              <CodeBlock>{`$client = new Fruitful_WP_Core_API_Client();

$brands = Fruitful_WP_Core_Cache::remember(
    'brands:public:limit=100',
    HOUR_IN_SECONDS,
    static function() use ( $client ) {
        return $client->get( '/entities/Brand', array( 'limit' => 100 ) );
    }
);`}</CodeBlock>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>Suggested Cache Durations</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  ['Brand names & design tokens', '1–24 hours'],
                  ['Directory entries', '5–60 minutes'],
                  ['Product catalogue cards', '5–30 minutes'],
                  ['Stock availability', '1–5 minutes (if safe)'],
                  ['Campaign page content', '5–30 minutes'],
                  ['Admin previews', 'No cache or very short'],
                ].map(([data, cache]) => (
                  <div key={data} className="flex justify-between p-3 bg-slate-900 rounded-lg">
                    <span className="text-xs text-slate-400">{data}</span>
                    <span className="text-xs font-bold text-teal-400">{cache}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'rest-routes':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>Narrow WordPress REST Routes</SectionTitle>
              <p className="text-slate-400 text-sm mb-4">Elementor editor interfaces may need data from WordPress. Provide narrow, safe routes—not a generic proxy that lets a browser call any Fruitful API path.</p>
              <CodeBlock>{`<?php
defined( 'ABSPATH' ) || exit;

final class Fruitful_WP_Core_REST_API {

    private static $instance = null;

    public static function instance() {
        if ( null === self::$instance ) self::$instance = new self();
        return self::$instance;
    }

    private function __construct() {
        add_action( 'rest_api_init', array( $this, 'register_routes' ) );
    }

    public function register_routes() {
        register_rest_route( 'fruitful/v1', '/brands', array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array( $this, 'list_brands' ),
            'permission_callback' => array( $this, 'can_edit_pages' ),
        ));

        register_rest_route( 'fruitful/v1', '/brand/(?P<brand_id>[a-zA-Z0-9_-]+)', array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array( $this, 'get_brand' ),
            'permission_callback' => array( $this, 'can_edit_pages' ),
            'args'                => array(
                'brand_id' => array( 'sanitize_callback' => 'sanitize_key' ),
            ),
        ));
    }

    public function can_edit_pages() {
        return current_user_can( 'edit_pages' );
    }

    public function list_brands() {
        $client = new Fruitful_WP_Core_API_Client();
        return rest_ensure_response(
            Fruitful_WP_Core_Cache::remember( 'brands:editor',
                10 * MINUTE_IN_SECONDS,
                static function() use ( $client ) {
                    return $client->get( '/entities/Brand', array( 'limit' => 100 ) );
                })
        );
    }
}`}</CodeBlock>
            </div>
            <div className="bg-red-950/30 border border-red-700 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-red-300">Do NOT Create This Dangerous Route</h3>
              </div>
              <CodeBlock>{`// DO NOT BUILD THIS: it turns WordPress into an unrestricted API proxy.
register_rest_route( 'fruitful/v1', '/proxy/(?P<path>.*)', ... );`}</CodeBlock>
              <p className="text-red-300 text-xs mt-3">A generic proxy can accidentally expose write/delete routes, internal records, administrative endpoints, tokens, or data never intended for a public website.</p>
            </div>
          </div>
        );

      case 'banimal':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>Banimal Connector Dependency</SectionTitle>
              <p className="text-slate-400 text-sm mb-4">The Banimal connector should remain the Banimal domain layer. It should use Fruitful WordPress Core rather than repeating API authentication, caching, logging, and REST security.</p>
              <CodeBlock lang="text">{`Fruitful WordPress Core
    ↑ provides API client, caching, logs and protected REST support
    │
Banimal Ecosystem Connector
    ↑ provides Banimal widgets, brand rules, WooCommerce bridge and lead routing
    │
Elementor site`}</CodeBlock>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>Dependency Check</SectionTitle>
              <CodeBlock>{`if ( ! defined( 'FRUITFUL_WP_CORE_VERSION' ) ) {
    add_action( 'admin_notices', static function() {
        if ( current_user_can( 'activate_plugins' ) ) {
            echo '<div class="notice notice-error"><p>';
            echo esc_html__( 'Banimal Ecosystem Connector requires the Fruitful WordPress Core plugin.',
                'banimal-ecosystem-connector' );
            echo '</p></div>';
        }
    });
    return;
}`}</CodeBlock>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>Banimal Product Service</SectionTitle>
              <CodeBlock>{`<?php
defined( 'ABSPATH' ) || exit;

final class Banimal_Product_Service {

    public function get_featured_products( $limit = 6 ) {
        $limit = max( 1, min( 24, absint( $limit ) ) );

        if ( class_exists( 'WooCommerce' ) ) {
            return $this->get_woocommerce_products( $limit );
        }

        $client = new Fruitful_WP_Core_API_Client();
        return Fruitful_WP_Core_Cache::remember(
            'banimal:featured-products:' . $limit,
            10 * MINUTE_IN_SECONDS,
            static function() use ( $client, $limit ) {
                return $client->get( '/entities/BarcodeMapping',
                    array( 'limit' => $limit ) );
            }
        );
    }

    private function get_woocommerce_products( $limit ) {
        return new WP_Query( array(
            'post_type'      => 'product',
            'post_status'    => 'publish',
            'posts_per_page' => $limit,
        ));
    }
}`}</CodeBlock>
              <p className="text-slate-400 text-xs mt-3">This example reflects the Fruitful specification's <code className="text-teal-400">BarcodeMapping</code> entity as a possible source of SKU/barcode-oriented data. Do not assume it is a complete product catalogue unless your actual schema and business rules define it that way.</p>
            </div>
          </div>
        );

      case 'forms':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>Form / Lead Workflow</SectionTitle>
              <p className="text-slate-400 text-sm mb-4">A public Elementor form should never call a generic Fruitful create endpoint directly. Create a purpose-built lead endpoint or send the form through a server-side Banimal/WordPress action.</p>
              <CodeBlock lang="text">{`Visitor completes Elementor form
        ↓
Elementor Pro Form Action
        ↓
Banimal Lead Router (WordPress server)
        ↓
Validate, sanitise, add source metadata, rate-limit
        ↓
Purpose-built Fruitful/Banimal lead endpoint
        ↓
CRM, queue, staff notification, audit log`}</CodeBlock>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>Minimum Lead Payload</SectionTitle>
              <CodeBlock lang="json">{`{
  "brand_id": "banimal",
  "lead_type": "wholesale",
  "name": "Example Customer",
  "email": "customer@example.com",
  "message": "I would like wholesale information.",
  "source": {
    "website": "https://example.com",
    "page_url": "https://example.com/wholesale/",
    "form_name": "Wholesale enquiry"
  },
  "consent": true
}`}</CodeBlock>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>Required Protections</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['CAPTCHA or anti-spam', 'Rate limits', 'Input sanitisation', 'Email validation', 'Consent checkbox', 'Server-side authentication', 'No secrets in form controls', 'Generic error messages', 'Data-retention policy'].map(item => (
                  <div key={item} className="flex items-center gap-2 p-2.5 bg-slate-900 rounded-lg text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />{item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>AI Integration Pattern</SectionTitle>
              <p className="text-slate-400 text-sm mb-4">AI should be an assistant, not an ungoverned publisher.</p>
              <CodeBlock lang="text">{`Editor chooses a structured task
        ↓
WordPress validates permissions and task inputs
        ↓
WordPress fetches only approved brand/product context
        ↓
Server sends restricted request to AI service
        ↓
AI response is schema-validated
        ↓
Editor reviews and edits draft in Elementor
        ↓
Human publishes page`}</CodeBlock>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <SectionTitle>AI Request Contract</SectionTitle>
                <CodeBlock lang="json">{`{
  "task": "hero_copy",
  "brand_id": "banimal",
  "brief": "Introduce a premium animal-care collection.",
  "constraints": {
    "locale": "en-ZA",
    "tone": ["clear", "humane", "confident"],
    "max_headline_words": 10,
    "forbidden_claims": [
      "guaranteed results",
      "medical cure",
      "unsubstantiated health claim"
    ]
  }
}`}</CodeBlock>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <SectionTitle>AI Response Contract</SectionTitle>
                <CodeBlock lang="json">{`{
  "headline": "Care made for their everyday adventure.",
  "description": "Thoughtfully selected essentials for healthier routines.",
  "cta": "Explore the collection",
  "warnings": []
}`}</CodeBlock>
              </div>
            </div>
            <div className="bg-red-950/30 border border-red-700 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-red-300">Never Allow AI to Do These Automatically</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {['Publish pages without human approval', 'Change prices, financial records, tax settings, or orders', 'Delete data', 'Send email/SMS/WhatsApp without confirmation workflow', 'Make medical, legal, financial, or regulated claims', 'Receive raw customer databases, payment data, or secrets', 'Execute arbitrary code or database queries'].map(item => (
                  <div key={item} className="flex items-start gap-2 text-xs text-red-300">
                    <span className="text-red-500 mt-0.5">✕</span>{item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'data-mapping':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>Entity → Website Display Mapping</SectionTitle>
              <p className="text-slate-400 text-sm mb-4">Treat the API specification as the source of truth for real endpoint names, required fields, and schemas—not this conceptual mapping alone.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-700">
                      <th className="pb-2 pr-4">Fruitful Entity</th>
                      <th className="pb-2 pr-4">Website Use Case</th>
                      <th className="pb-2 pr-4">Elementor Widget</th>
                      <th className="pb-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {[
                      ['Brand', 'Brand portfolio, selector, logo/tone profile', 'Brand Directory, Brand Hero', 'Use only approved public brand fields'],
                      ['DirectoryEntry', 'Store locator, partner list, service directory', 'Directory Search, Location Cards', 'Filter by region/country/category server-side'],
                      ['BarcodeMapping', 'SKU/barcode lookup/enrichment', 'Product Lookup, SKU Search', 'Avoid exposing internal supply data'],
                      ['SubscriptionBox', 'Subscription plan pages', 'Subscription Plan Cards', 'Display published/public pricing only'],
                      ['Metrics', 'Internal reporting', 'Private Admin Metrics widget', 'Do not expose operational metrics publicly'],
                      ['SageItemRaw', 'Internal source-data processing', 'None for public pages by default', 'Treat raw accounting records as restricted'],
                    ].map(([entity, useCase, widget, notes]) => (
                      <tr key={entity} className="hover:bg-slate-700/30">
                        <td className="py-2.5 pr-4 font-mono text-teal-400 text-xs">{entity}</td>
                        <td className="py-2.5 pr-4 text-slate-300">{useCase}</td>
                        <td className="py-2.5 pr-4 text-slate-400">{widget}</td>
                        <td className="py-2.5 text-xs text-slate-500">{notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>API Data Contract — Map to Public Display Object</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-red-400 text-xs font-bold mb-2">✕ Bad: widget consumes raw entity</p>
                  <CodeBlock>{`$data = $client->get( '/entities/Brand/' . $id );
// Frontend now relies on every field in a
// broad internal record.`}</CodeBlock>
                </div>
                <div>
                  <p className="text-emerald-400 text-xs font-bold mb-2">✓ Better: map to public display object</p>
                  <CodeBlock>{`function fruitful_map_brand_for_public_display( array $brand ) {
    return array(
        'id'          => sanitize_key( $brand['id'] ?? '' ),
        'name'        => sanitize_text_field( $brand['name'] ?? '' ),
        'description' => wp_kses_post( $brand['public_description'] ?? '' ),
        'website_url' => esc_url_raw( $brand['website_url'] ?? '' ),
        'logo_url'    => esc_url_raw( $brand['logo_url'] ?? '' ),
    );
}`}</CodeBlock>
                </div>
              </div>
              <div className="mt-4 space-y-1.5">
                {['You decide exactly which fields may become public', 'Internal fields do not leak accidentally', 'Your Elementor widget has a stable contract even if the database changes', 'You can transform field names without rebuilding every page'].map(item => (
                  <div key={item} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />{item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            {[
              { title: 'Credentials', items: ['Store private secrets only in host env vars or wp-config.php outside version control', 'Rotate a secret immediately if it appears in Git, logs, screenshots, tickets, chat, or browser output', 'Use separate API credentials for development, staging, and production', 'Give each website the lowest possible permission scope'] },
              { title: 'API Access', items: ['Allow public websites to use read-only endpoints only where data is explicitly public', 'Give Elementor editors narrow WordPress-authenticated routes, not direct Fruitful credentials', 'Use dedicated routes for leads, subscriptions, and other writes', 'Never expose generic update, bulk-update, delete-many, restore, or admin API functions through public Elementor controls', 'Validate response schemas before rendering remote data'] },
              { title: 'WordPress Coding', items: ['Begin PHP files with defined( "ABSPATH" ) || exit;', 'Sanitise every input before use or storage', 'Escape every output for its context', 'Use WordPress capability checks', 'Use nonces for authenticated browser actions', 'Add HTTP timeouts and safe failure behaviour', 'Do not show PHP errors, remote stack traces, or secret-bearing response bodies to visitors'] },
              { title: 'Elementor', items: ['Do not place tokens in widget controls', 'Do not put private endpoints in page controls', 'Remove sensitive custom Form Action settings in on_export()', 'Limit dynamic content to approved fields', 'Review AI-generated content before publishing'] },
              { title: 'Operations', items: ['Run backups before deployment', 'Test restores periodically', 'Maintain staging before production', 'Log integration failures without logging tokens or sensitive personal data', 'Monitor API error rates and form-action failures'] },
            ].map(section => (
              <div key={section.title} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <SectionTitle>{section.title}</SectionTitle>
                <div className="space-y-2">
                  {section.items.map(item => (
                    <div key={item} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />{item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'phases':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>Development Sequence</SectionTitle>
              <p className="text-slate-400 text-sm mb-4">Follow this exact order. Do not jump to AI or complex automation before the base system is stable.</p>
              <div className="space-y-4">
                {[
                  { phase: 1, title: 'Foundation', steps: ['Install WordPress on staging', 'Install Elementor', 'Install Elementor Pro only if custom form actions are required', 'Install the shared Fruitful WordPress Core plugin', 'Add staging-only API configuration', 'Confirm the plugin activates without PHP errors'], success: 'WordPress remains stable even when the Fruitful API is unavailable.', color: 'border-teal-700 text-teal-400' },
                  { phase: 2, title: 'Read-only Data', steps: ['Implement the shared API client', 'Add cached read-only routes for one entity (Brand)', 'Map raw data to a limited public display object', 'Create one simple Elementor widget that displays mapped data'], success: 'An editor can add a controlled Fruitful-powered widget to a page without a public visitor receiving any credential.', color: 'border-emerald-700 text-emerald-400' },
                  { phase: 3, title: 'Banimal Connector', steps: ['Install or update Banimal Ecosystem Connector', 'Make it require Fruitful WordPress Core', 'Register Banimal Elementor widgets', 'Connect existing WooCommerce bridge logic', 'Test product display and brand hero widgets'], success: 'A Banimal editor builds a page from Banimal components in Elementor.', color: 'border-blue-700 text-blue-400' },
                  { phase: 4, title: 'Forms & Workflows', steps: ['Create a dedicated lead endpoint in the Fruitful/Banimal backend', 'Add the Elementor Pro custom form action', 'Add spam protection, consent, rate limiting, logging, and notifications', 'Test failures as well as successful submits'], success: 'A lead reaches the intended system reliably and failures are observable.', color: 'border-purple-700 text-purple-400' },
                  { phase: 5, title: 'AI Assistance', steps: ['Define approved tasks and response schemas', 'Connect only server-side AI requests', 'Add AI-enabled text/code controls where Elementor supports them', 'Add human review before publish', 'Measure quality and failure modes'], success: 'AI speeds up editing without controlling business-critical outcomes.', color: 'border-amber-700 text-amber-400' },
                ].map(p => (
                  <div key={p.phase} className={`bg-slate-900 border rounded-xl p-4 ${p.color.split(' ')[0]}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-2xl font-black ${p.color.split(' ')[1]}`}>{p.phase}</span>
                      <div>
                        <p className="font-bold text-white text-sm">Phase {p.phase} — {p.title}</p>
                      </div>
                    </div>
                    <div className="space-y-1 mb-3">
                      {p.steps.map(s => (
                        <div key={s} className="flex items-start gap-2 text-xs text-slate-400">
                          <span className={`mt-0.5 ${p.color.split(' ')[1]}`}>•</span>{s}
                        </div>
                      ))}
                    </div>
                    <div className="bg-slate-800 rounded-lg p-2.5 border-l-2 border-emerald-600">
                      <p className="text-xs text-emerald-300"><strong>Success:</strong> {p.success}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'done':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <h2 className="text-xl font-black text-white">Definition of Done</h2>
              </div>
              <p className="text-slate-300 text-sm mb-4">You have a safe working integration when all statements below are true:</p>
              <div className="space-y-2.5">
                {[
                  'Fruitful WordPress Core exists and activates safely',
                  'Fruitful API credentials exist only in server configuration',
                  'A cached, read-only Fruitful data route works on staging',
                  'A WordPress REST bridge exposes only narrow, permission-checked routes',
                  'Elementor displays at least one Fruitful-powered widget',
                  'Banimal Ecosystem Connector uses the shared core rather than duplicating credentials',
                  'Banimal widgets work with Elementor and degrade safely if an optional service is unavailable',
                  'Elementor form submission uses a dedicated, validated server-side workflow',
                  'No secret is in Elementor controls, exports, frontend JavaScript, page HTML, Git, or logs',
                  'AI output is reviewed by a human before public publication',
                  'Staging tests are documented and passed',
                  'Backup and rollback procedures are tested',
                ].map(item => (
                  <div key={item} className="flex items-start gap-2.5 text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />{item}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>Final Principle</SectionTitle>
              <p className="text-slate-300 text-sm leading-relaxed">
                The purpose is not simply to connect an API to Elementor. The purpose is to build a <strong className="text-teal-400">controlled publishing system</strong> where the Fruitful app holds authoritative business data, WordPress and Elementor make that data easy to present as a website, Banimal and future brand plugins turn shared capability into brand-specific experiences, APIs connect systems safely, AI helps people create better drafts, and humans remain accountable for what goes live.
              </p>
              <p className="text-slate-400 text-xs mt-4 italic">
                Build the foundation once. Reuse it carefully. Keep the website layer simple, the backend authoritative, the credentials private, the data contracts narrow, and every high-impact action reviewable.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/Dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-bold">Dashboard</span>
            </Link>
            <div className="h-6 w-px bg-slate-700" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-400">Integration Blueprint</p>
              <h1 className="text-lg font-black text-white">Fruitful → WordPress + Elementor</h1>
            </div>
          </div>
          <a href="https://github.com/heyns1000/banimal" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-teal-400 bg-teal-900/40 border border-teal-700 px-3 py-1.5 rounded-lg hover:bg-teal-800/50 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" />heyns1000/banimal
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6">
        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 hidden md:block">
          <nav className="sticky top-24 space-y-1">
            {SECTIONS.map(s => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${active === s.id ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs">{s.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile section selector */}
        <div className="md:hidden mb-4 w-full">
          <select value={active} onChange={(e) => setActive(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2">
            {SECTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}