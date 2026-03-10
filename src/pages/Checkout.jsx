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
    name: 'English', announcement: '🛒 Buy one, we sponsor one! ❤️ Every FAA.ZONE purchase supports an artisan community.',
    backToShop: '← Back to Marketplace', heading: '🌐 FAA.ZONE Checkout',
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
const THEME_STYLES = {
  dark: {
    bg: 'bg-[#1a1a1c]', card: 'bg-[#2a2a2e] border-[#3a3a3e]', text: 'text-[#f5f5f7]',
    muted: 'text-[#a0a0a5]', input: 'bg-[#3a3a3e] border-[#4a4a4e] text-[#f5f5f7] placeholder:text-[#666]',
    stepInactive: 'bg-[#4A5568] text-[#a0a0a5]', stepActive: 'bg-[#0071e3] text-white',
    headerBg: 'bg-[#4CAF50]', headerShadow: 'shadow-[0_10px_30px_rgba(76,175,80,0.35)]',
    announceBg: 'bg-[#4CAF50]', footerBg: 'bg-[#1a1a1a]',
    btn: 'bg-[#0071e3] hover:bg-[#0060c0] text-white',
    btnOutline: 'border-[#3a3a3e] text-[#f5f5f7] hover:bg-[#3a3a3e]',
  },
  light: {
    bg: 'bg-[#f5f5f7]', card: 'bg-white border-[#e8e8ed]', text: 'text-[#1d1d1f]',
    muted: 'text-[#6e6e73]', input: 'bg-white border-[#d2d2d7] text-[#1d1d1f] placeholder:text-[#b0b0b5]',
    stepInactive: 'bg-gray-200 text-gray-500', stepActive: 'bg-[#0071e3] text-white',
    headerBg: 'bg-[#4CAF50]', headerShadow: 'shadow-[0_10px_30px_rgba(76,175,80,0.35)]',
    announceBg: 'bg-[#4CAF50]', footerBg: 'bg-gray-900',
    btn: 'bg-[#0071e3] hover:bg-[#0060c0] text-white',
    btnOutline: 'border-gray-300 text-gray-700 hover:bg-gray-100',
  },
  hyper: {
    bg: 'bg-[#000033]', card: 'bg-[#110044] border-[#330066]', text: 'text-[#FFCCFF]',
    muted: 'text-[#AA44AA]', input: 'bg-[#000022] border-[#330066] text-[#FFCCFF] placeholder:text-[#AA44AA]',
    stepInactive: 'bg-[#330066] text-[#FFCCFF]', stepActive: 'bg-[#FF00FF] text-white',
    headerBg: 'bg-[#FF00FF]', headerShadow: 'shadow-[0_10px_30px_rgba(255,0,255,0.4)]',
    announceBg: 'bg-[#CC00CC]', footerBg: 'bg-[#110044]',
    btn: 'bg-[#8A2BE2] hover:bg-[#7b27cb] text-white',
    btnOutline: 'border-[#330066] text-[#FFCCFF] hover:bg-[#220055]',
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
  const [theme, setTheme] = useState('dark');
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

  const handlePay = async () => {
    if (!email) { toast.error('Please enter your email'); return; }
    setIsProcessing(true);
    const orderNumber = `ORD-${Date.now()}`;
    try {
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email, amount: getTotal() * 100, currency: 'NGN', ref: orderNumber,
        callback: async (response) => {
          await base44.entities.Order.create({
            orderNumber,
            items: cartItems.map(i => ({ serviceId: i.id, serviceName: i.name || i.serviceName, productCode: i.productCode || `PROD-${i.id}`, quantity: i.quantity, unitPrice: i.price, imageUrl: i.imageUrl })),
            buyerEmail: email, totalAmount: getTotal(), currency: 'NGN',
            status: 'confirmed', paystackReference: response.reference, paymentStatus: 'paid', shippingAddress: shipping
          });
          await base44.entities.Payment.create({ transactionId: response.reference, amount: getTotal(), currency: 'NGN', gateway: 'Paystack', paymentMethod: 'card', status: 'completed', type: 'marketplace', customerEmail: email });
          clearCart(); setPlacedOrderRef(response.reference); setOrderPlaced(true); setIsProcessing(false);
        },
        onClose: () => { toast.info('Payment cancelled'); setIsProcessing(false); }
      });
      handler.openIframe();
    } catch (e) { toast.error('Failed to initialize payment'); setIsProcessing(false); }
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
        <div className="w-20 h-20 bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>
        <h1 className={`text-3xl font-black ${T.text} mb-2`}>{t.orderConfirmed}</h1>
        <p className={`${T.muted} mb-2`}>{t.thankYou}</p>
        <code className="text-orange-400 text-sm bg-black/20 px-3 py-1 rounded-lg">{placedOrderRef}</code>
        <div className="flex gap-3 mt-8">
          <Link to={createPageUrl('OrderHistory')} className="flex-1">
            <Button className={`w-full ${T.btn}`}>{t.viewOrders}</Button>
          </Link>
          <Link to={createPageUrl('Marketplace')} className="flex-1">
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
        <ShoppingBag className="w-16 h-16 text-stone-600 mx-auto mb-4" />
        <h2 className={`text-2xl font-black ${T.text} mb-2`}>{t.emptyCart}</h2>
        <p className={`${T.muted} mb-6`}>{t.addItems}</p>
        <Link to={createPageUrl('Marketplace')}>
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
                  step === s.id ? T.stepActive : step > s.id ? 'bg-green-600 text-white' : T.stepInactive
                }`}>
                  {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step === s.id ? T.text : T.muted}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 border-t-2 mx-3 ${step > s.id ? 'border-green-600' : 'border-[#4A5568]'}`} />}
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
                        <div className="w-20 h-20 bg-stone-800 rounded-xl overflow-hidden flex-shrink-0">
                          {item.imageUrl ? <img src={item.imageUrl} alt={item.name || item.serviceName} className="w-full h-full object-cover" /> : <Package className="w-8 h-8 text-stone-600 m-auto mt-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-bold ${T.text} truncate`}>{item.name || item.serviceName}</h3>
                          {item.productCode && <p className={`text-xs ${T.muted}`}>SKU: {item.productCode}</p>}
                          <p className="text-orange-400 font-bold mt-1">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 bg-stone-800/60 rounded-lg flex items-center justify-center hover:bg-stone-700 text-white">-</button>
                          <span className={`w-6 text-center font-bold ${T.text}`}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 bg-stone-800/60 rounded-lg flex items-center justify-center hover:bg-stone-700 text-white">+</button>
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
                  {[
                    { val: 'paystack', label: 'Paystack', desc: 'Card, EFT, Mobile Money', icon: '💳' },
                    { val: 'bank', label: 'Bank Transfer', desc: 'Direct bank transfer (manual)', icon: '🏦' },
                  ].map(m => (
                    <button key={m.val} onClick={() => setPaymentMethod(m.val)}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border text-left transition-all mb-3 ${paymentMethod === m.val ? 'border-green-500 bg-green-500/10' : `${T.card} hover:border-green-700`}`}>
                      <span className="text-2xl">{m.icon}</span>
                      <div>
                        <p className={`font-bold ${T.text}`}>{m.label}</p>
                        <p className={`${T.muted} text-sm`}>{m.desc}</p>
                      </div>
                      <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === m.val ? 'border-green-500' : 'border-stone-600'}`}>
                        {paymentMethod === m.val && <div className="w-2.5 h-2.5 rounded-full bg-green-500" />}
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
                      <div key={row.label} className="border-t border-[#3a3a3e] first:border-0 pt-3 first:pt-0">
                        <p className="text-xs text-green-400 uppercase tracking-wider font-bold mb-1">{row.label}</p>
                        <p className={`${T.muted} text-sm`}>{row.value}</p>
                      </div>
                    ))}
                    <div className="border-t border-[#3a3a3e] pt-3">
                      <p className="text-xs text-green-400 uppercase tracking-wider font-bold mb-2">Items ({cartItems.length})</p>
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
                    <span className="text-green-400">{t.free}</span>
                  </div>
                </div>
                <div className={`border-t border-[#3a3a3e] pt-3 flex justify-between font-black text-lg`}>
                  <span className={T.text}>{t.total}</span>
                  <span className="text-orange-400">${getTotal().toFixed(2)}</span>
                </div>
                <div className={`mt-4 text-xs ${T.muted} text-center`}>
                  🌍 {t.footerSlogan}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Planet Pulse */}
        <p className={`text-center text-xl font-bold my-8 transition-opacity duration-700 ${pulseVisible ? 'opacity-100' : 'opacity-40'}`}
          style={{ color: theme === 'hyper' ? '#FF00FF' : theme === 'light' ? '#7B68EE' : '#7B68EE' }}>
          {t.planetText}
        </p>
      </div>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className={`${T.footerBg} text-white py-10 px-6 text-center`}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-1">{t.footerHeading}</h2>
          <p className="text-blue-400 text-xl font-bold mb-3">{t.footerSlogan}</p>
          <p className="text-gray-300 mb-6">{t.footerText}</p>
          <Link to={createPageUrl('Marketplace')}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2 transition-colors">
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
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-700 text-gray-400 hover:border-gray-500'
                }`}>
                {m === 'light' ? t.lightMode : m === 'dark' ? t.darkMode : t.hyperMode}
              </button>
            ))}
            <div className="relative">
              <Globe className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select value={lang} onChange={e => setLang(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-full text-sm font-medium border border-gray-700 bg-gray-900 text-gray-300 cursor-pointer appearance-none focus:outline-none focus:border-blue-500">
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