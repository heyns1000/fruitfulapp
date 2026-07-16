import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useCart } from '../components/cart/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Loader2, ShoppingBag, Trash2, CreditCard, Package,
  ChevronRight, ChevronLeft, MapPin, CheckCircle2, X, Globe
} from 'lucide-react';
import { toast } from 'sonner';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import CheckoutAIFAQ from '../components/checkout/CheckoutAIFAQ';

// ── i18n ────────────────────────────────────────────────────────────────────
const LANGS = {
  en: {
    name: 'English', announcement: 'Buy one, we sponsor one. Every FAA.ZONE purchase supports an artisan community.',
    backToShop: 'Back to Marketplace', heading: 'FAA.ZONE Checkout',
    slogan: 'Handcrafted | Ethical | African Heritage',
    stepSummary: 'Summary', stepShipping: 'Shipping', stepPayment: 'Payment', stepConfirm: 'Confirm',
    summaryTitle: 'Order Summary', shippingTitle: 'Delivery Details', paymentTitle: 'Payment Method', confirmTitle: 'Review & Confirm',
    email: 'Email *', fullName: 'Full Name *', address1: 'Street Address *', address2: 'Address Line 2',
    city: 'City *', province: 'Province', postal: 'Postal Code', country: 'Country',
    subtotal: 'Subtotal', shipping: 'Shipping', total: 'Total', free: 'FREE',
    placeOrder: 'Place Order', processing: 'Processing…', continue: 'Continue', back: 'Back',
    orderConfirmed: 'Order Confirmed!', thankYou: 'Thank you for supporting local artisans',
    viewOrders: 'View Orders', shopMore: 'Shop More', emptyCart: 'Your cart is empty',
    browseMarket: 'Browse Marketplace', addItems: 'Add handcrafted items to get started',
    payNote: '🔒 Payments are encrypted and secure. We never store card details.',
    planetText: 'fruchtbarer.planet.wandel',
    footerHeading: 'FAA.ZONE™', footerSlogan: '🐑 Kind Creators. Global Impact.',
    footerText: 'Every purchase on FAA.ZONE funds an artisan. Identified by Fruitful™ Treaty System data-driven insights.',
    copyright: '© 2026 FAA.ZONE™. All rights reserved.', poweredBy: 'Powered by Fruitful™ Treaty System™',
    lightMode: 'Light', darkMode: 'Dark', hyperMode: 'Hyper',
    faqHeading: 'AI Help & FAQ', faqSlogan: 'Ask anything about your order, shipping, or FAA.ZONE.',
    faqPlaceholder: 'e.g. What payment methods are accepted?',
    faqBtn: 'Get Answer ✨', faqLoading: 'Generating…', faqError: 'Could not get an answer.',
    faqPlaceholderError: 'Please enter a question.',
  },
  fr: {
    name: 'Français', announcement: '🛒 Achetez-en un, nous en sponsorisons un ! ❤️',
    backToShop: '← Retour au marché', heading: '🌐 Paiement FAA.ZONE',
    slogan: 'Artisanal | Éthique | Patrimoine Africain',
    stepSummary: 'Résumé', stepShipping: 'Livraison', stepPayment: 'Paiement', stepConfirm: 'Confirmer',
    summaryTitle: 'Récapitulatif', shippingTitle: 'Coordonnées de livraison', paymentTitle: 'Mode de paiement', confirmTitle: 'Vérifier & Confirmer',
    email: 'Email *', fullName: 'Nom complet *', address1: 'Adresse *', address2: 'Complément',
    city: 'Ville *', province: 'Province', postal: 'Code postal', country: 'Pays',
    subtotal: 'Sous-total', shipping: 'Livraison', total: 'Total', free: 'GRATUIT',
    placeOrder: 'Passer la commande', processing: 'Traitement…', continue: 'Continuer', back: 'Retour',
    orderConfirmed: 'Commande confirmée !', thankYou: 'Merci de soutenir les artisans',
    viewOrders: 'Mes commandes', shopMore: 'Continuer', emptyCart: 'Panier vide',
    browseMarket: 'Explorer le marché', addItems: 'Ajoutez des articles artisanaux',
    payNote: '🔒 Paiements chiffrés et sécurisés.',
    planetText: 'fruchtbarer.planet.wandel',
    footerHeading: 'FAA.ZONE™', footerSlogan: '🐑 Créateurs Bienveillants. Impact Mondial.',
    footerText: 'Chaque achat sur FAA.ZONE finance un artisan.',
    copyright: '© 2026 FAA.ZONE™. Tous droits réservés.', poweredBy: 'Propulsé par Fruitful™ Treaty System™',
    lightMode: 'Clair', darkMode: 'Sombre', hyperMode: 'Hyper',
    faqHeading: 'Aide IA & FAQ', faqSlogan: 'Posez votre question sur votre commande ou FAA.ZONE.',
    faqPlaceholder: 'Ex: Quels modes de paiement sont acceptés ?',
    faqBtn: 'Obtenir une réponse ✨', faqLoading: 'Génération…', faqError: 'Impossible d\'obtenir une réponse.',
    faqPlaceholderError: 'Veuillez entrer une question.',
  },
  de: {
    name: 'Deutsch', announcement: '🛒 Kaufe eines, wir sponsern eines! ❤️',
    backToShop: '← Zurück zum Marktplatz', heading: '🌐 FAA.ZONE Kasse',
    slogan: 'Handgefertigt | Ethisch | Afrikanisches Erbe',
    stepSummary: 'Übersicht', stepShipping: 'Versand', stepPayment: 'Zahlung', stepConfirm: 'Bestätigen',
    summaryTitle: 'Bestellübersicht', shippingTitle: 'Lieferdetails', paymentTitle: 'Zahlungsmethode', confirmTitle: 'Überprüfen & Bestätigen',
    email: 'E-Mail *', fullName: 'Vollständiger Name *', address1: 'Straße *', address2: 'Adresszusatz',
    city: 'Stadt *', province: 'Bundesland', postal: 'Postleitzahl', country: 'Land',
    subtotal: 'Zwischensumme', shipping: 'Versand', total: 'Gesamt', free: 'GRATIS',
    placeOrder: 'Bestellung aufgeben', processing: 'Verarbeitung…', continue: 'Weiter', back: 'Zurück',
    orderConfirmed: 'Bestellung bestätigt!', thankYou: 'Danke, dass Sie lokale Handwerker unterstützen',
    viewOrders: 'Bestellungen', shopMore: 'Weiter einkaufen', emptyCart: 'Warenkorb leer',
    browseMarket: 'Marktplatz erkunden', addItems: 'Fügen Sie handgefertigte Artikel hinzu',
    payNote: '🔒 Zahlungen sind verschlüsselt und sicher.',
    planetText: 'fruchtbarer.planet.wandel',
    footerHeading: 'FAA.ZONE™', footerSlogan: '🐑 Freundliche Schöpfer. Globale Wirkung.',
    footerText: 'Jeder Kauf bei FAA.ZONE finanziert einen Handwerker.',
    copyright: '© 2026 FAA.ZONE™. Alle Rechte vorbehalten.', poweredBy: 'Betrieben von Fruitful™ Treaty System™',
    lightMode: 'Hell', darkMode: 'Dunkel', hyperMode: 'Hyper',
    faqHeading: 'KI-Hilfe & FAQ', faqSlogan: 'Stellen Sie Fragen zu Ihrer Bestellung oder FAA.ZONE.',
    faqPlaceholder: 'z.B. Welche Zahlungsmethoden werden akzeptiert?',
    faqBtn: 'Antwort erhalten ✨', faqLoading: 'Generierung…', faqError: 'Antwort nicht verfügbar.',
    faqPlaceholderError: 'Bitte eine Frage eingeben.',
  },
  es: {
    name: 'Español', announcement: '🛒 ¡Compra uno, patrocinamos uno! ❤️',
    backToShop: '← Volver al mercado', heading: '🌐 Pago FAA.ZONE',
    slogan: 'Artesanal | Ético | Patrimonio Africano',
    stepSummary: 'Resumen', stepShipping: 'Envío', stepPayment: 'Pago', stepConfirm: 'Confirmar',
    summaryTitle: 'Resumen del pedido', shippingTitle: 'Detalles de entrega', paymentTitle: 'Método de pago', confirmTitle: 'Revisar y confirmar',
    email: 'Correo *', fullName: 'Nombre completo *', address1: 'Dirección *', address2: 'Complemento',
    city: 'Ciudad *', province: 'Provincia', postal: 'Código postal', country: 'País',
    subtotal: 'Subtotal', shipping: 'Envío', total: 'Total', free: 'GRATIS',
    placeOrder: 'Realizar pedido', processing: 'Procesando…', continue: 'Continuar', back: 'Atrás',
    orderConfirmed: '¡Pedido confirmado!', thankYou: 'Gracias por apoyar a los artesanos',
    viewOrders: 'Ver pedidos', shopMore: 'Seguir comprando', emptyCart: 'Carrito vacío',
    browseMarket: 'Explorar mercado', addItems: 'Agrega artículos artesanales para comenzar',
    payNote: '🔒 Los pagos están cifrados y seguros.',
    planetText: 'fruchtbarer.planet.wandel',
    footerHeading: 'FAA.ZONE™', footerSlogan: '🐑 Creadores Amables. Impacto Global.',
    footerText: 'Cada compra en FAA.ZONE financia a un artesano.',
    copyright: '© 2026 FAA.ZONE™. Todos los derechos reservados.', poweredBy: 'Impulsado por Fruitful™ Treaty System™',
    lightMode: 'Claro', darkMode: 'Oscuro', hyperMode: 'Hiper',
    faqHeading: 'Ayuda IA y FAQ', faqSlogan: 'Pregunta sobre tu pedido o FAA.ZONE.',
    faqPlaceholder: 'Ej: ¿Qué métodos de pago se aceptan?',
    faqBtn: 'Obtener respuesta ✨', faqLoading: 'Generando…', faqError: 'No se pudo obtener respuesta.',
    faqPlaceholderError: 'Por favor ingresa una pregunta.',
  },
  ar: {
    name: 'العربية', announcement: '🛒 اشترِ واحدة ونحن نرعى واحدة! ❤️',
    backToShop: '← العودة للسوق', heading: '🌐 الدفع - FAA.ZONE',
    slogan: 'حرفي | أخلاقي | تراث أفريقي',
    stepSummary: 'ملخص', stepShipping: 'الشحن', stepPayment: 'الدفع', stepConfirm: 'تأكيد',
    summaryTitle: 'ملخص الطلب', shippingTitle: 'تفاصيل التوصيل', paymentTitle: 'طريقة الدفع', confirmTitle: 'مراجعة وتأكيد',
    email: 'البريد *', fullName: 'الاسم الكامل *', address1: 'العنوان *', address2: 'تفاصيل إضافية',
    city: 'المدينة *', province: 'المقاطعة', postal: 'الرمز البريدي', country: 'الدولة',
    subtotal: 'المجموع الجزئي', shipping: 'الشحن', total: 'الإجمالي', free: 'مجاني',
    placeOrder: 'تأكيد الطلب', processing: 'جارٍ المعالجة…', continue: 'متابعة', back: 'رجوع',
    orderConfirmed: 'تم تأكيد الطلب!', thankYou: 'شكرًا لدعمك الحرفيين',
    viewOrders: 'عرض الطلبات', shopMore: 'مواصلة التسوق', emptyCart: 'السلة فارغة',
    browseMarket: 'استكشاف السوق', addItems: 'أضف منتجات حرفية للبدء',
    payNote: '🔒 المدفوعات مشفرة وآمنة.',
    planetText: 'fruchtbarer.planet.wandel',
    footerHeading: 'FAA.ZONE™', footerSlogan: '🐑 صانعون طيبون. تأثير عالمي.',
    footerText: 'كل عملية شراء في FAA.ZONE تمول حرفيًا.',
    copyright: '© 2026 FAA.ZONE™. جميع الحقوق محفوظة.', poweredBy: 'مدعوم من Fruitful™ Treaty System™',
    lightMode: 'فاتح', darkMode: 'داكن', hyperMode: 'هايبر',
    faqHeading: 'مساعدة الذكاء الاصطناعي', faqSlogan: 'اسأل عن طلبك أو FAA.ZONE.',
    faqPlaceholder: 'مثال: ما طرق الدفع المتاحة؟',
    faqBtn: 'احصل على إجابة ✨', faqLoading: 'جارٍ الإنشاء…', faqError: 'تعذّر الحصول على إجابة.',
    faqPlaceholderError: 'الرجاء إدخال سؤال.',
  },
};

// ── Theme style maps ─────────────────────────────────────────────────────────
// All themes retargeted onto the Fruitful™ CI (teal primary, mint/white surfaces)
// so checkout is consistent with the rest of the app in every mode.
const THEME_STYLES = {
  light: {
    bg: 'bg-background', card: 'bg-card border-border', text: 'text-foreground',
    muted: 'text-muted-foreground', input: 'bg-card border-border text-foreground placeholder:text-muted-foreground',
    stepInactive: 'bg-muted text-muted-foreground', stepActive: 'bg-primary text-primary-foreground',
    headerBg: 'bg-fruitful-teal', headerShadow: 'shadow-[0_10px_30px_rgba(13,148,136,0.30)]',
    announceBg: 'bg-fruitful-teal-deep', footerBg: 'bg-fruitful-ink',
    btn: 'bg-primary hover:bg-fruitful-teal-deep text-primary-foreground',
    btnOutline: 'border-border text-foreground hover:bg-muted',
  },
  dark: {
    bg: 'bg-fruitful-ink', card: 'bg-[#20302a] border-[#2c4038]', text: 'text-fruitful-mint',
    muted: 'text-[#8fb3a6]', input: 'bg-[#2c4038] border-[#3a5248] text-fruitful-mint placeholder:text-[#6f9184]',
    stepInactive: 'bg-[#2c4038] text-[#8fb3a6]', stepActive: 'bg-primary text-primary-foreground',
    headerBg: 'bg-fruitful-teal', headerShadow: 'shadow-[0_10px_30px_rgba(13,148,136,0.35)]',
    announceBg: 'bg-fruitful-teal-deep', footerBg: 'bg-[#12201a]',
    btn: 'bg-primary hover:bg-fruitful-teal-deep text-primary-foreground',
    btnOutline: 'border-[#2c4038] text-fruitful-mint hover:bg-[#2c4038]',
  },
  hyper: {
    bg: 'bg-fruitful-teal-deep', card: 'bg-fruitful-teal/40 border-fruitful-mint/30', text: 'text-white',
    muted: 'text-fruitful-mint', input: 'bg-fruitful-teal-deep border-fruitful-mint/30 text-white placeholder:text-fruitful-mint/70',
    stepInactive: 'bg-fruitful-teal/50 text-fruitful-mint', stepActive: 'bg-hotstack-ember text-white',
    headerBg: 'bg-hotstack-ember', headerShadow: 'shadow-[0_10px_30px_rgba(249,115,22,0.4)]',
    announceBg: 'bg-hotstack-amber', footerBg: 'bg-fruitful-ink',
    btn: 'bg-hotstack-ember hover:bg-hotstack-amber text-white',
    btnOutline: 'border-fruitful-mint/30 text-white hover:bg-fruitful-teal/50',
  },
};

export default function Checkout() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [shipping, setShipping] = useState({ name: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'South Africa' });
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderRef, setPlacedOrderRef] = useState('');
  const [showAnnounce, setShowAnnounce] = useState(true);
  const [theme, setTheme] = useState('light');
  const [lang, setLang] = useState('en');

  const t = LANGS[lang] || LANGS.en;
  const T = THEME_STYLES[theme];

  const shf = (key, val) => setShipping(s => ({ ...s, [key]: val }));

  const canProceed = {
    1: cartItems.length > 0,
    2: email && shipping.name && shipping.addressLine1 && shipping.city,
    3: true, 4: true,
  };

  const steps = [
    { id: 1, label: t.stepSummary }, { id: 2, label: t.stepShipping },
    { id: 3, label: t.stepPayment }, { id: 4, label: t.stepConfirm },
  ];

  const completeOrder = async (response) => {
    const orderNumber = `ORD-${Date.now()}`;
    // Paystack returns status 'success'; channel tells us the payment method used
    const paystackRef = typeof response === 'string' ? response : response.reference;
    const channel = typeof response === 'object' ? (response.channel || 'card') : 'card';

    await base44.entities.Order.create({
      orderNumber,
      items: cartItems.map(i => ({
        serviceId: i.id, serviceName: i.name || i.serviceName,
        productCode: i.productCode || `PROD-${i.id}`,
        quantity: i.quantity, unitPrice: i.price, imageUrl: i.imageUrl
      })),
      buyerEmail: email,
      totalAmount: getTotal(),
      currency: 'NGN', // Paystack primary currency
      status: 'confirmed',
      paystackReference: paystackRef,
      paymentStatus: 'paid',
      shippingAddress: shipping,
      statusHistory: [{ status: 'confirmed', timestamp: new Date().toISOString(), note: 'Payment verified via Paystack' }],
    });
    await base44.entities.Payment.create({
      transactionId: paystackRef,
      amount: getTotal(),
      currency: 'NGN',
      gateway: 'Paystack',
      paymentMethod: channel,   // actual channel returned by Paystack
      status: 'completed',      // we store 'completed'; Paystack calls it 'success'
      type: 'marketplace',
      customerEmail: email,
      metadata: {
        pciCompliant: true,
        tokenized: true,
        gatewayResponse: typeof response === 'object' ? response : { reference: paystackRef },
      }
    });
    clearCart();
    setPlacedOrderRef(paystackRef);
    setOrderPlaced(true);
    setIsProcessing(false);
  };

  const handlePay = async () => {
    if (!email) { toast.error('Please enter your email'); return; }
    setIsProcessing(true);
    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

    if (paystackKey && paystackKey !== 'undefined' && typeof window.PaystackPop !== 'undefined') {
      const ref = `ORD-${Date.now()}`;
      window.PaystackPop.setup({
        key: paystackKey,
        email,
        amount: Math.round(getTotal() * 100), // Paystack expects kobo (smallest unit)
        currency: 'NGN',
        ref,
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
        metadata: {
          cancel_action: window.location.href,
          custom_fields: [
            { display_name: 'Order', variable_name: 'order_ref', value: ref },
            { display_name: 'Platform', variable_name: 'platform', value: 'FAA.ZONE' },
          ]
        },
        // Paystack callback receives full response object with .reference, .status, .channel
        callback: async (response) => { await completeOrder(response); },
        onClose: () => { toast.info('Payment cancelled'); setIsProcessing(false); }
      }).openIframe();
    } else {
      // Demo / sandbox mode
      const demoRef = `DEMO-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      toast.info('Running in demo mode — simulating Paystack payment…');
      await new Promise(r => setTimeout(r, 1500));
      await completeOrder({ reference: demoRef, status: 'success', channel: 'card', demo: true });
    }
  };

  // ── Planet pulse ─────────────────────────────────────────────────────────
  const [pulseVisible, setPulseVisible] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => { setPulseVisible(v => !v); }, 1500);
    return () => clearInterval(interval);
  }, []);

  // ── Order confirmed screen ───────────────────────────────────────────────
  if (orderPlaced) return (
    <div className={`min-h-screen ${T.bg} flex items-center justify-center p-6`}>
      <div className={`${T.card} border rounded-3xl p-10 text-center max-w-md w-full`}>
        <div className="w-20 h-20 bg-fruitful-green/15 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-fruitful-green">
          <CheckCircle2 className="w-10 h-10 text-fruitful-green" />
        </div>
        <h1 className={`text-3xl font-black ${T.text} mb-2`}>{t.orderConfirmed}</h1>
        <p className={`${T.muted} mb-2`}>{t.thankYou}</p>
        <code className="text-primary text-sm bg-primary/10 px-3 py-1 rounded-lg font-semibold">{placedOrderRef}</code>
        <div className="flex gap-3 mt-8">
          <Link to={createPageUrl('OrderHistory')} className="flex-1">
            <Button className={`w-full ${T.btn}`}>{t.viewOrders}</Button>
          </Link>
          <Link to={createPageUrl('BrandMarketplace')} className="flex-1">
            <Button variant="outline" className={`w-full ${T.btnOutline}`}>{t.shopMore}</Button>
          </Link>
        </div>
      </div>
    </div>
  );

  // ── Empty cart ───────────────────────────────────────────────────────────
  if (cartItems.length === 0 && step === 1) return (
    <div className={`min-h-screen ${T.bg} flex items-center justify-center p-6`}>
      <div className={`${T.card} border rounded-3xl p-10 text-center max-w-md w-full`}>
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className={`text-2xl font-black ${T.text} mb-2`}>{t.emptyCart}</h2>
        <p className={`${T.muted} mb-6`}>{t.addItems}</p>
        <Link to={createPageUrl('BrandMarketplace')}>
          <Button className={`${T.btn} px-8`}>{t.browseMarket}</Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${T.bg} ${T.text} flex flex-col`}>

      {/* ── Announcement Bar ─────────────────────────────────────── */}
      {showAnnounce && (
        <div className={`${T.announceBg} text-white text-sm py-2.5 px-4 text-center relative flex items-center justify-center`}>
          <span>{t.announcement}</span>
          <button onClick={() => setShowAnnounce(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-lg leading-none">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Hero Header ──────────────────────────────────────────── */}
      <header className={`${T.headerBg} ${T.headerShadow} text-white py-8 px-4 text-center`}>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-md" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.15)' }}>
            {t.heading}
          </h1>
          <p className="text-white/90 text-lg mt-2">{t.slogan}</p>
          <Link to={createPageUrl('Marketplace')} className="inline-block mt-3 text-white/80 hover:text-white text-sm font-semibold hover:underline transition-colors">
            {t.backToShop}
          </Link>
        </div>
      </header>

      {/* ── Step Progress ─────────────────────────────────────────── */}
      <div className={`${T.card.split(' ')[0]} border-b ${T.card.split(' ')[1] || ''} px-4 py-5`}>
        <div className="max-w-3xl mx-auto flex items-center justify-center">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`flex flex-col items-center gap-1 cursor-pointer`} onClick={() => step > s.id && setStep(s.id)}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step === s.id ? T.stepActive : step > s.id ? 'bg-fruitful-green text-white' : T.stepInactive
                }`}>
                  {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step === s.id ? T.text : T.muted}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 border-t-2 mx-3 ${step > s.id ? 'border-fruitful-green' : 'border-border'}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className="flex-1">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">

              {/* Step 1: Order Summary */}
              {step === 1 && (
                <div>
                  <h2 className={`text-xl font-black ${T.text} mb-4`}>{t.summaryTitle}</h2>
                  <div className="space-y-3">
                    {cartItems.map(item => (
                      <div key={item.id} className={`${T.card} border rounded-2xl p-4 flex items-center gap-4`}>
                        <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {item.imageUrl ? <img src={item.imageUrl} alt={item.name || item.serviceName} className="w-full h-full object-cover" /> : <Package className="w-8 h-8 text-muted-foreground" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-bold ${T.text} truncate`}>{item.name || item.serviceName}</h3>
                          {item.productCode && <p className={`text-xs ${T.muted}`}>SKU: {item.productCode}</p>}
                          <p className="text-primary font-bold mt-1">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center hover:bg-muted-foreground/20 text-foreground">-</button>
                          <span className={`w-6 text-center font-bold ${T.text}`}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center hover:bg-muted-foreground/20 text-foreground">+</button>
                        </div>
                        <div className="text-right">
                          <p className={`font-black ${T.text} text-lg`}>${(item.price * item.quantity).toFixed(2)}</p>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400 mt-1"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Shipping */}
              {step === 2 && (
                <div>
                  <h2 className={`text-xl font-black ${T.text} mb-4`}>{t.shippingTitle}</h2>
                  <div className={`${T.card} border rounded-2xl p-6 space-y-4`}>
                    {[
                      { label: t.email, key: 'email', type: 'email', value: email, onChange: e => setEmail(e.target.value), placeholder: 'your@email.com' },
                      { label: t.fullName, key: 'name', placeholder: 'Your full name' },
                      { label: t.address1, key: 'addressLine1', placeholder: '123 Main Street' },
                      { label: t.address2, key: 'addressLine2', placeholder: 'Apt, Suite, etc. (optional)' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="text-xs text-green-400 uppercase tracking-wider mb-1 block font-bold">{f.label}</label>
                        <Input value={f.value !== undefined ? f.value : shipping[f.key]} onChange={f.onChange || (e => shf(f.key, e.target.value))} type={f.type || 'text'} placeholder={f.placeholder} className={`${T.input} border focus:border-green-500 transition-colors`} />
                      </div>
                    ))}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-green-400 uppercase tracking-wider mb-1 block font-bold">{t.city}</label>
                        <Input value={shipping.city} onChange={e => shf('city', e.target.value)} placeholder="Pretoria" className={`${T.input} border focus:border-green-500`} />
                      </div>
                      <div>
                        <label className="text-xs text-green-400 uppercase tracking-wider mb-1 block font-bold">{t.province}</label>
                        <Input value={shipping.state} onChange={e => shf('state', e.target.value)} placeholder="Gauteng" className={`${T.input} border focus:border-green-500`} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-green-400 uppercase tracking-wider mb-1 block font-bold">{t.postal}</label>
                        <Input value={shipping.postalCode} onChange={e => shf('postalCode', e.target.value)} placeholder="0001" className={`${T.input} border focus:border-green-500`} />
                      </div>
                      <div>
                        <label className="text-xs text-green-400 uppercase tracking-wider mb-1 block font-bold">{t.country}</label>
                        <Input value={shipping.country} onChange={e => shf('country', e.target.value)} className={`${T.input} border focus:border-green-500`} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
               {step === 3 && (
                 <div>
                   <h2 className={`text-xl font-black ${T.text} mb-4`}>{t.paymentTitle}</h2>
                   {!import.meta.env.VITE_PAYSTACK_PUBLIC_KEY && (
                     <div className="mb-4 p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 text-sm flex items-start gap-2">
                       <span className="text-lg shrink-0">⚠️</span>
                       <span><strong>Demo Mode:</strong> No Paystack key configured. Orders will be created instantly without real payment processing.</span>
                     </div>
                   )}
                   {[
                     { val: 'paystack', label: 'Paystack', desc: 'Card, EFT, Mobile Money', icon: '💳' },
                     { val: 'bank', label: 'Bank Transfer', desc: 'Direct bank transfer (manual)', icon: '🏦' },
                   ].map(m => (
                    <button key={m.val} onClick={() => setPaymentMethod(m.val)}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border text-left transition-all mb-3 ${paymentMethod === m.val ? 'border-primary bg-primary/10' : `${T.card} hover:border-primary/50`}`}>
                      <span className="text-2xl">{m.icon}</span>
                      <div>
                        <p className={`font-bold ${T.text}`}>{m.label}</p>
                        <p className={`${T.muted} text-sm`}>{m.desc}</p>
                      </div>
                      <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === m.val ? 'border-primary' : 'border-border'}`}>
                        {paymentMethod === m.val && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                    </button>
                  ))}
                  <div className={`${T.card} border rounded-2xl p-4 text-sm ${T.muted} flex items-start gap-3`}>
                    <span className="text-green-400 mt-0.5 shrink-0">🔒</span>
                    <p>{t.payNote}</p>
                  </div>
                </div>
              )}

              {/* Step 4: Confirm */}
              {step === 4 && (
                <div>
                  <h2 className={`text-xl font-black ${T.text} mb-4`}>{t.confirmTitle}</h2>
                  <div className={`${T.card} border rounded-2xl p-5 space-y-3`}>
                    {[
                      { label: 'Contact', value: email },
                      { label: t.stepShipping, value: `${shipping.name}, ${shipping.addressLine1}, ${shipping.city}, ${shipping.country}` },
                      { label: t.stepPayment, value: paymentMethod },
                    ].map(row => (
                      <div key={row.label} className="border-t border-border first:border-0 pt-3 first:pt-0">
                        <p className="text-xs text-primary uppercase tracking-wider font-bold mb-1">{row.label}</p>
                        <p className={`${T.muted} text-sm`}>{row.value}</p>
                      </div>
                    ))}
                    <div className="border-t border-border pt-3">
                      <p className="text-xs text-primary uppercase tracking-wider font-bold mb-2">Items ({cartItems.length})</p>
                      {cartItems.map(i => (
                        <div key={i.id} className={`flex justify-between text-sm ${T.muted}`}>
                          <span>{i.name || i.serviceName} × {i.quantity}</span>
                          <span>${(i.price * i.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Nav buttons */}
              <div className="flex gap-3">
                {step > 1 && (
                  <Button variant="outline" onClick={() => setStep(s => s - 1)} className={`${T.btnOutline} border gap-2`}>
                    <ChevronLeft className="w-4 h-4" /> {t.back}
                  </Button>
                )}
                {step < 4 ? (
                  <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed[step]} className={`flex-1 ${T.btn} font-bold gap-2 disabled:opacity-40`}>
                    {t.continue} <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button onClick={handlePay} disabled={isProcessing} className={`flex-1 ${T.btn} font-bold text-lg py-6 gap-2 disabled:opacity-40`}>
                    {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> {t.processing}</> : <><CreditCard className="w-5 h-5" /> {t.placeOrder} · ${getTotal().toFixed(2)}</>}
                  </Button>
                )}
              </div>

              {/* AI FAQ */}
              <CheckoutAIFAQ t={t} />
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className={`${T.card} border rounded-2xl p-5 sticky top-6`}>
                <h3 className={`font-bold ${T.text} mb-4`}>{t.summaryTitle}</h3>
                <div className="space-y-2 text-sm mb-4">
                  <div className={`flex justify-between ${T.muted}`}>
                    <span>{t.subtotal} ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                  <div className={`flex justify-between ${T.muted}`}>
                    <span>{t.shipping}</span>
                    <span className="text-fruitful-green font-semibold">{t.free}</span>
                  </div>
                </div>
                <div className={`border-t border-border pt-3 flex justify-between font-black text-lg`}>
                  <span className={T.text}>{t.total}</span>
                  <span className="text-primary">${getTotal().toFixed(2)}</span>
                </div>
                <div className={`mt-4 text-xs ${T.muted} text-center`}>
                  {t.footerSlogan}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Planet Pulse */}
        <p className={`text-center text-xl font-bold my-8 transition-opacity duration-700 ${pulseVisible ? 'opacity-100' : 'opacity-40'}`}
          style={{ color: theme === 'hyper' ? '#f97316' : '#0d9488' }}>
          {t.planetText}
        </p>
      </div>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className={`${T.footerBg} text-white py-10 px-6 text-center`}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-1">{t.footerHeading}</h2>
          <p className="text-fruitful-mint text-xl font-bold mb-3">{t.footerSlogan}</p>
          <p className="text-white/70 mb-6">{t.footerText}</p>
          <Link to={createPageUrl('BrandMarketplace')}>
            <button className="bg-primary hover:bg-fruitful-teal-deep text-primary-foreground font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2 transition-colors">
              {t.browseMarket} <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
          <p className="text-gray-500 text-sm mt-8">{t.copyright}</p>
          <p className="text-gray-500 text-sm">{t.poweredBy}</p>

          {/* Theme + Language controls */}
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            {['light', 'dark', 'hyper'].map(m => (
              <button key={m} onClick={() => setTheme(m)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  theme === m
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-white/20 text-white/60 hover:border-white/40'
                }`}>
                {m === 'light' ? t.lightMode : m === 'dark' ? t.darkMode : t.hyperMode}
              </button>
            ))}
            <div className="relative">
              <Globe className="w-4 h-4 text-white/60 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select value={lang} onChange={e => setLang(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-full text-sm font-medium border border-white/20 bg-white/10 text-white cursor-pointer appearance-none focus:outline-none focus:border-primary">
                {Object.entries(LANGS).map(([code, l]) => (
                  <option key={code} value={code}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
