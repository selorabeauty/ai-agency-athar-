import Link from 'next/link';

export default function ThankYouPage() {
  return <main className="thank-you"><div><div className="brand"><span className="brand-mark">أ</span><span>أثر<span className="brand-dot">.</span></span></div><h1>وصلتنا رسالتك.</h1><p>سنراجع احتياجك ونعود إليك خلال يوم عمل بخطوة واضحة.</p><Link className="button button-primary" href="/">العودة للرئيسية</Link></div></main>;
}
