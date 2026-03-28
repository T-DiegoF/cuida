import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 text-center animate-fade-up">
      {/* Logo */}
      <Link href="/" aria-label="Cuida — voltar ao início" className="mb-10">
        <Logo size="lg" />
      </Link>

      {/* Illustration */}
      <svg
        width="140"
        height="120"
        viewBox="0 0 140 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-8 opacity-80"
        aria-hidden="true"
      >
        {/* Ground */}
        <ellipse cx="70" cy="108" rx="55" ry="8" fill="#D6E8E3" />
        {/* Body */}
        <rect x="42" y="50" width="56" height="52" rx="12" fill="#E6F4F1" />
        {/* Head */}
        <circle cx="70" cy="38" r="22" fill="#E6F4F1" />
        {/* Eyes — searching */}
        <circle cx="62" cy="36" r="4" fill="#1A6B5A" />
        <circle cx="78" cy="36" r="4" fill="#1A6B5A" />
        <circle cx="63.5" cy="34.5" r="1.5" fill="white" />
        <circle cx="79.5" cy="34.5" r="1.5" fill="white" />
        {/* Eyebrows — raised in surprise */}
        <path d="M58 29 Q62 26 66 29" stroke="#1A6B5A" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M74 29 Q78 26 82 29" stroke="#1A6B5A" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Mouth — O shape */}
        <ellipse cx="70" cy="46" rx="4" ry="3" fill="#2D9E87" opacity="0.6" />
        {/* Arms */}
        <path d="M42 65 Q28 60 26 72 Q24 82 36 82" stroke="#1A6B5A" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M98 65 Q112 60 114 72 Q116 82 104 82" stroke="#1A6B5A" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* Question marks */}
        <text x="18" y="52" fill="#F4845F" fontSize="18" fontWeight="bold" opacity="0.8">?</text>
        <text x="106" y="52" fill="#F4845F" fontSize="18" fontWeight="bold" opacity="0.8">?</text>
        {/* Cross on chest */}
        <line x1="70" y1="65" x2="70" y2="85" stroke="#2D9E87" strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1="75" x2="80" y2="75" stroke="#2D9E87" strokeWidth="3" strokeLinecap="round" />
        {/* Feet */}
        <rect x="53" y="98" width="14" height="8" rx="4" fill="#1A6B5A" opacity="0.3" />
        <rect x="73" y="98" width="14" height="8" rx="4" fill="#1A6B5A" opacity="0.3" />
      </svg>

      {/* Copy */}
      <h1
        className="text-3xl md:text-4xl font-semibold text-text-main mb-3"
        style={{ fontFamily: "Fraunces, serif", letterSpacing: "-0.01em" }}
      >
        Ops! Essa página foi embora.
      </h1>
      <p className="text-text-muted text-base max-w-sm mb-8 leading-relaxed">
        Parece que a página que você está buscando não existe ou foi movida.
        Mas não se preocupe — o Cuida ainda está aqui para ajudar.
      </p>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="
            inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white
            bg-primary hover:bg-primary-light
            transition-all duration-200 active:scale-95
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
          "
          aria-label="Voltar para a página inicial"
        >
          Voltar para o início →
        </Link>
        <Link
          href="/campaigns"
          className="
            inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-primary
            border border-[#D6E8E3] hover:border-primary hover:bg-[#E6F4F1]
            transition-all duration-200
          "
          aria-label="Ver campanhas ativas"
        >
          Ver campanhas
        </Link>
      </div>
    </div>
  );
}
