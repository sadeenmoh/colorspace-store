import React, { useState } from 'react';
import { Sparkles, ArrowLeft, RotateCcw, MessageCircle, ShoppingBag, Check } from 'lucide-react';
import { SHADES, Shade, WHATSAPP_NUMBER, Language } from '../utils/storeLogic';

interface Props {
  lang: Language;
  onAddToCart?: (shadeId: number) => void;
}

type Skin = 'fair' | 'medium' | 'deep' | null;
type Current = 'black' | 'darkbrown' | 'brown' | 'blonde' | 'dyed' | null;
type Goal = 'natural' | 'lighter' | 'ash' | 'warm' | 'bold' | null;

const QUESTIONS = {
  ar: [
    { title: 'شو لون بشرتك؟', subtitle: 'عشان نعرف الدرجات اللي بتليق عليكي' },
    { title: 'شعرك هلأ شو لونه؟', subtitle: 'عشان نعرف إذا الدرجة رح تطلع عليكي زي الصورة' },
    { title: 'شو النتيجة اللي بدك إياها؟', subtitle: 'طبيعي؟ أفتح؟ رمادي؟ دافي؟' },
    { title: 'عندك شيب وبدك تغطية كاملة؟', subtitle: 'بعض الدرجات بتغطي الشيب أحسن من غيرها' },
  ],
  en: [
    { title: 'What is your skin tone?', subtitle: 'So we pick shades that flatter you' },
    { title: 'What is your current hair color?', subtitle: 'So we know how the shade will show up' },
    { title: 'What result do you want?', subtitle: 'Natural? Lighter? Ash? Warm?' },
    { title: 'Do you have grey hair to cover?', subtitle: 'Some shades cover grey better' },
  ],
};

const OPTIONS = {
  ar: [
    [
      { id: 'fair', label: 'فاتحة', emoji: '🤍' },
      { id: 'medium', label: 'حنطية', emoji: '🧡' },
      { id: 'deep', label: 'سمراء', emoji: '🤎' },
    ],
    [
      { id: 'black', label: 'أسود', emoji: '⬛' },
      { id: 'darkbrown', label: 'بني غامق', emoji: '🟫' },
      { id: 'brown', label: 'بني', emoji: '🤎' },
      { id: 'blonde', label: 'أشقر', emoji: '👱‍♀️' },
      { id: 'dyed', label: 'مصبوغ / أحمر', emoji: '❤️' },
    ],
    [
      { id: 'natural', label: 'طبيعي وأنيق', emoji: '✨' },
      { id: 'lighter', label: 'أفتح من شعري', emoji: '☀️' },
      { id: 'ash', label: 'رمادي بارد - بدون أورانج', emoji: '❄️' },
      { id: 'warm', label: 'دافي - كراميل وعسل', emoji: '🍯' },
      { id: 'bold', label: 'جريء - أحمر ونحاسي', emoji: '🔥' },
    ],
    [
      { id: 'yes', label: 'أي، بدي تغطية كاملة', emoji: '✅' },
      { id: 'no', label: 'لا، ما عندي شيب', emoji: '💁‍♀️' },
    ],
  ],
  en: [
    [
      { id: 'fair', label: 'Fair', emoji: '🤍' },
      { id: 'medium', label: 'Medium / Olive', emoji: '🧡' },
      { id: 'deep', label: 'Deep', emoji: '🤎' },
    ],
    [
      { id: 'black', label: 'Black', emoji: '⬛' },
      { id: 'darkbrown', label: 'Dark Brown', emoji: '🟫' },
      { id: 'brown', label: 'Brown', emoji: '🤎' },
      { id: 'blonde', label: 'Blonde', emoji: '👱‍♀️' },
      { id: 'dyed', label: 'Dyed / Red', emoji: '❤️' },
    ],
    [
      { id: 'natural', label: 'Natural & Elegant', emoji: '✨' },
      { id: 'lighter', label: 'Lighter than now', emoji: '☀️' },
      { id: 'ash', label: 'Cool Ash - No Orange', emoji: '❄️' },
      { id: 'warm', label: 'Warm - Caramel & Honey', emoji: '🍯' },
      { id: 'bold', label: 'Bold - Red & Copper', emoji: '🔥' },
    ],
    [
      { id: 'yes', label: 'Yes, full grey coverage', emoji: '✅' },
      { id: 'no', label: 'No grey hair', emoji: '💁‍♀️' },
    ],
  ],
};

function scoreShade(shade: Shade, skin: Skin, current: Current, goal: Goal, grey: string | null): { shade: Shade; score: number; reason: string } {
  let score = 0;
  let reason = '';
  const isEn = false;
  // Goal based scoring
  if (goal === 'ash' && ['7.1', '8.1', '7.11', '8.11', '0.1', '0.02'].includes(shade.code)) { score += 50; reason = 'رمادي بارد بيحيّد الأورانج'; }
  if (goal === 'warm' && ['8.73', '8.3', '7.33', '8.37', '8.45'].includes(shade.code)) { score += 50; reason = 'درجة دافية بتعطي إشراقة ذهبية'; }
  if (goal === 'natural' && ['4.0', '5.0', '3.0', '6.0'].includes(shade.code)) { score += 50; reason = 'درجة طبيعية وأنيقة لليوم'; }
  if (goal === 'lighter' && ['7.0', '8.0', '10.0', '8.3'].includes(shade.code)) { score += 50; reason = 'بتفتّح شعرك بدرجتين بدون سحب لون'; }
  if (goal === 'bold' && ['7.66', '5.65', '8.45', '8.37'].includes(shade.code)) { score += 50; reason = 'درجة جريئة بتبين وشخصيتها قوية'; }
  // Skin
  if (skin === 'fair' && ['7.1', '8.1', '8.73', '7.0'].includes(shade.code)) score += 20;
  if (skin === 'medium' && ['8.73', '8.3', '4.0', '6.7', '7.33'].includes(shade.code)) score += 20;
  if (skin === 'deep' && ['1.0', '3.0', '4.0', '6.7', '7.66'].includes(shade.code)) score += 20;
  // Current hair - avoid impossible jumps
  if (current === 'black' && ['10.0', '0.1', '0.02'].includes(shade.code)) score -= 40;
  if (current === 'black' && ['1.0', '3.0', '4.0', '1.1'].includes(shade.code)) score += 15;
  // Grey coverage - darker covers better
  if (grey === 'yes' && ['1.0', '3.0', '4.0', '5.0', '6.0', '7.0'].includes(shade.code)) score += 20;
  // Best sellers boost
  if (shade.badge === 'best_seller') score += 10;
  if (shade.badge === 'out_of_stock') score -= 100;
  return { shade, score, reason: reason || shade.descAr || '' };
}

export const ShadeAIAdvisor: React.FC<Props> = ({ lang, onAddToCart }) => {
  const isEn = lang === 'en';
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [skin, setSkin] = useState<Skin>(null);
  const [current, setCurrent] = useState<Current>(null);
  const [goal, setGoal] = useState<Goal>(null);
  const [grey, setGrey] = useState<string | null>(null);
  const [added, setAdded] = useState<number | null>(null);

  const reset = () => { setStep(0); setSkin(null); setCurrent(null); setGoal(null); setGrey(null); setAdded(null); };

  const pick = (value: any) => {
    if (step === 0) setSkin(value);
    if (step === 1) setCurrent(value);
    if (step === 2) setGoal(value);
    if (step === 3) { setGrey(value); }
    if (step < 3) setStep(step + 1);
  };

  const results = (step === 3 && grey)
    ? SHADES.map(s => scoreShade(s, skin, current, goal, grey)).sort((a, b) => b.score - a.score).slice(0, 3)
    : [];

  const t = (ar: string, en: string) => (isEn ? en : ar);

  return (
    <>
      {/* Floating button */}
      <button onClick={() => { setOpen(true); reset(); }} className="fixed bottom-24 end-6 z-30 h-14 px-5 rounded-full bg-gradient-to-l from-[#7A0A1C] to-[#B8860B] text-white font-bold text-sm inline-flex items-center gap-2 shadow-2xl hover:scale-105 transition-transform">
        <Sparkles className="w-5 h-5" />
        <span>{t('مساعد الذكاء الاصطناعي - اختاري صبغتك', 'AI Assistant - Find Your Shade')}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setOpen(false)}>
          <div className="bg-white w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-l from-[#7A0A1C] to-[#B8860B] flex items-center justify-center text-white"><Sparkles className="w-5 h-5" /></span>
                  <div>
                    <p className="font-bold text-sm">{t('مساعد سبيس كولور', 'Space Color AI')}</p>
                    <p className="text-xs text-stone-500">{t('بساعدك تختاري أنسب درجة إلك', 'Helping you find your perfect shade')}</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="text-stone-400 text-xl px-2">✕</button>
              </div>

              {/* Progress */}
              <div className="flex gap-1.5 mb-5">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-[#7A0A1C]' : 'bg-stone-200'}`} />
                ))}
              </div>

              {step < 3 || !grey ? (
                <>
                  <h3 className="font-bold text-lg mb-1">{QUESTIONS[isEn ? 'en' : 'ar'][step].title}</h3>
                  <p className="text-sm text-stone-500 mb-4">{QUESTIONS[isEn ? 'en' : 'ar'][step].subtitle}</p>
                  <div className="grid gap-2">
                    {OPTIONS[isEn ? 'en' : 'ar'][step].map((opt: any) => (
                      <button key={opt.id} onClick={() => pick(opt.id)} className="w-full text-right flex items-center gap-3 p-3.5 rounded-2xl border border-stone-200 hover:border-[#7A0A1C] hover:bg-[#FFF8F0] transition-all font-bold text-sm">
                        <span className="text-xl">{opt.emoji}</span><span>{opt.label}</span><ArrowLeft className="w-4 h-4 mr-auto text-stone-300" />
                      </button>
                    ))}
                  </div>
                  {step > 0 && <button onClick={() => setStep(step - 1)} className="mt-4 text-xs text-stone-500 underline">{t('رجوع', 'Back')}</button>}
                </>
              ) : (
                <>
                  <h3 className="font-bold text-lg mb-1">{t('هي أنسب 3 درجات إلك ✨', 'Your Top 3 Shades ✨')}</h3>
                  <p className="text-sm text-stone-500 mb-4">{t('بناءً على بشرتك وشعرك واللوك اللي بدك إياه', 'Based on your skin, hair & desired look')}</p>
                  <div className="space-y-3">
                    {results.map((r, idx) => (
                      <div key={r.shade.id} className={`p-4 rounded-2xl border ${idx === 0 ? 'border-[#7A0A1C] bg-[#FFF8F0] shadow-md' : 'border-stone-200'}`}>
                        <div className="flex items-center gap-3">
                          <span className="w-12 h-12 rounded-full border shadow-inner shrink-0" style={{ background: r.shade.hex }} />
                          <div className="flex-1">
                            <p className="font-bold text-sm">{idx === 0 ? '⭐ ' : ''}{isEn ? r.shade.nameEn : r.shade.nameAr} • {r.shade.code}</p>
                            <p className="text-xs text-stone-500 leading-relaxed">{r.reason}</p>
                            <p className="text-xs font-bold text-[#7A0A1C] mt-1">2.5 {t('د.أ', 'JOD')}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => { onAddToCart?.(r.shade.id); setAdded(r.shade.id); }} className="flex-1 h-9 rounded-xl bg-[#7A0A1C] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5">
                            {added === r.shade.id ? <><Check className="w-4 h-4" /> {t('تمت الإضافة!', 'Added!')}</> : <><ShoppingBag className="w-4 h-4" /> {t('أضيفيها للسلة', 'Add to Cart')}</>}
                          </button>
                          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t(`مرحباً، المساعد الذكي نصحني بدرجة ${r.shade.code} (${r.shade.nameAr})، بدي أستفسر عنها`, `Hello, AI suggested shade ${r.shade.code} (${r.shade.nameEn}), I want to ask about it`))}`} target="_blank" rel="noreferrer" className="h-9 px-3 rounded-xl bg-[#25D366] text-white text-xs font-bold inline-flex items-center gap-1.5"><MessageCircle className="w-4 h-4" /> {t('واتساب', 'WhatsApp')}</a>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={reset} className="mt-4 w-full h-10 rounded-xl border border-stone-200 text-sm font-bold inline-flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4" /> {t('جربي مرة ثانية', 'Try Again')}</button>
                  <p className="text-[11px] text-stone-400 text-center mt-3">{t('هاد اقتراح ذكي من خبرتنا، وإذا بدك تأكيد ابعتلنا صورتك على واتساب', 'Smart suggestion based on our expertise - send us your photo on WhatsApp for confirmation')}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};