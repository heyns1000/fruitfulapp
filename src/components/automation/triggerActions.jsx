export const TRIGGERS = [
  {
    category: 'Collaboration Suite',
    color: 'violet',
    items: [
      { id: 'collab_approved', label: 'Co-branded product approved', icon: '✅' },
      { id: 'collab_proposal_created', label: 'New collaboration proposal created', icon: '📝' },
      { id: 'collab_milestone_reached', label: 'Project milestone reached', icon: '🎯' },
      { id: 'negotiation_terms_agreed', label: 'Negotiation terms agreed', icon: '🤝' },
    ]
  },
  {
    category: 'Marketplace',
    color: 'blue',
    items: [
      { id: 'order_placed', label: 'New order placed', icon: '🛒' },
      { id: 'service_listed', label: 'New service listed', icon: '📦' },
      { id: 'order_delivered', label: 'Order delivered', icon: '🚚' },
      { id: 'review_received', label: 'Customer review received', icon: '⭐' },
    ]
  },
  {
    category: 'Brand & Ecosystem',
    color: 'teal',
    items: [
      { id: 'brand_onboarded', label: 'New brand onboarded to ecosystem', icon: '🌱' },
      { id: 'compatibility_score_high', label: 'High compatibility score detected', icon: '⚡' },
      { id: 'intelligence_report_ready', label: 'Monthly intelligence report generated', icon: '📊' },
      { id: 'sector_trend_spike', label: 'Sector trend spike detected', icon: '📈' },
    ]
  },
  {
    category: 'Loyalty & Subscriptions',
    color: 'amber',
    items: [
      { id: 'loyalty_tier_upgrade', label: 'Customer loyalty tier upgraded', icon: '🏆' },
      { id: 'points_threshold', label: 'Loyalty points threshold reached', icon: '💎' },
      { id: 'subscription_renewed', label: 'Subscription renewed', icon: '🔄' },
      { id: 'subscription_cancelled', label: 'Subscription cancelled', icon: '❌' },
    ]
  },
];

export const ACTIONS = [
  {
    category: 'Marketing',
    color: 'pink',
    items: [
      { id: 'launch_campaign', label: 'Launch marketing campaign', icon: '🚀' },
      { id: 'generate_content', label: 'Generate AI marketing content', icon: '✍️' },
      { id: 'send_newsletter', label: 'Send newsletter to subscribers', icon: '📧' },
      { id: 'post_social', label: 'Schedule social media post', icon: '📱' },
    ]
  },
  {
    category: 'Collaboration',
    color: 'violet',
    items: [
      { id: 'create_proposal', label: 'Create collaboration proposal', icon: '📋' },
      { id: 'notify_partner', label: 'Notify partner brand', icon: '🔔' },
      { id: 'open_negotiation', label: 'Open negotiation session', icon: '⚖️' },
      { id: 'schedule_meeting', label: 'Schedule joint venture meeting', icon: '📅' },
    ]
  },
  {
    category: 'Analytics & Reporting',
    color: 'blue',
    items: [
      { id: 'generate_report', label: 'Generate intelligence report', icon: '📊' },
      { id: 'flag_opportunity', label: 'Flag as high-priority opportunity', icon: '🚩' },
      { id: 'update_dashboard', label: 'Update dashboard metrics', icon: '📉' },
    ]
  },
  {
    category: 'Loyalty & Engagement',
    color: 'amber',
    items: [
      { id: 'award_points', label: 'Award loyalty points', icon: '🎁' },
      { id: 'unlock_offer', label: 'Unlock exclusive reward offer', icon: '🔓' },
      { id: 'send_voucher', label: 'Send discount voucher', icon: '🎟️' },
    ]
  },
];

export const CATEGORY_COLORS = {
  violet: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-800', badge: 'bg-violet-100 text-violet-700' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', badge: 'bg-blue-100 text-blue-700' },
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-800', badge: 'bg-teal-100 text-teal-700' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', badge: 'bg-amber-100 text-amber-700' },
  pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-800', badge: 'bg-pink-100 text-pink-700' },
};