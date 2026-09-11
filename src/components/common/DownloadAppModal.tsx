import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useApp } from '../../context/AppContext';
import {
  Smartphone,
  Download,
  Share2,
  Check,
  ExternalLink,
  X,
  FileCode2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface DownloadAppModalProps {
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { currentLanguage } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'mobile' | 'code'>('mobile');

  const appUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Tarang Entertainment App',
        text: 'Download and play Tarang app on your phone:',
        url: appUrl,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/20">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black font-hindi flex items-center gap-1.5">
                {currentLanguage === 'hi' ? 'तरंग ऐप डाउनलोड करें' : 'Download Tarang App'}
                <span className="px-1.5 py-0.2 rounded bg-white/20 text-[9px] font-bold">APK / PWA</span>
              </h2>
              <p className="text-[11px] text-orange-100 font-hindi">
                {currentLanguage === 'hi' ? 'फोन में असली ऐप की तरह चलाएं' : 'Install on Android & iOS'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-zinc-800 text-xs font-bold bg-zinc-900/60">
          <button
            onClick={() => setActiveTab('mobile')}
            className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'mobile'
                ? 'text-orange-400 border-b-2 border-orange-400 bg-orange-500/10'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{currentLanguage === 'hi' ? 'फोन में इंस्टॉल करें' : 'Install on Phone'}</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'code'
                ? 'text-orange-400 border-b-2 border-orange-400 bg-orange-500/10'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>{currentLanguage === 'hi' ? 'सोर्स कोड (ZIP)' : 'Download Code (ZIP)'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 no-scrollbar">
          {activeTab === 'mobile' ? (
            <>
              {/* Direct Install Button if supported by browser */}
              {isInstallable && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white font-hindi">
                      {currentLanguage === 'hi' ? 'सीधा 1-टैप इंस्टॉल उपलब्ध है!' : '1-Click Direct Install Ready'}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Fast
                    </span>
                  </div>
                  <button
                    onClick={async () => {
                      const success = await install();
                      if (success) onClose();
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-extrabold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>{currentLanguage === 'hi' ? 'अभी फोन में इंस्टॉल करें' : 'Install App Now'}</span>
                  </button>
                </div>
              )}

              {/* Already Installed badge */}
              {isInstalled && (
                <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>यह ऐप पहले से आपके डिवाइस में इंस्टॉल्ड है!</span>
                </div>
              )}

              {/* Step-by-Step Guide for Android */}
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2.5">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <span className="text-base">🤖</span>
                  <span className="font-hindi">Android फोन (Chrome / Brave Browser) पर कैसे डाउनलोड करें:</span>
                </div>
                <ol className="space-y-2 text-[11px] text-zinc-300 font-hindi pl-2">
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">1</span>
                    <span>ब्राउज़र के ऊपर दाएं कोने में <strong>3 डॉट्स (⋮)</strong> पर टैप करें।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">2</span>
                    <span>मेनू में <strong>"Install app"</strong> या <strong>"Add to Home screen" (होम स्क्रीन में जोड़ें)</strong> पर क्लिक करें।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">3</span>
                    <span>बस! ऐप का आइकन आपकी मोबाइल स्क्रीन पर आ जाएगा और यह ऑफलाइन भी चलेगा।</span>
                  </li>
                </ol>
              </div>

              {/* Step-by-Step Guide for iPhone / Safari */}
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2.5">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <span className="text-base">🍎</span>
                  <span className="font-hindi">iPhone / iPad (Safari) पर कैसे जोड़ें:</span>
                </div>
                <ol className="space-y-2 text-[11px] text-zinc-300 font-hindi pl-2">
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">1</span>
                    <span>नीचे दिए गए <strong>Share बटन (⎕↑)</strong> पर टैप करें।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">2</span>
                    <span>नीचे स्क्रॉल करें और <strong>"Add to Home Screen" (+)</strong> चुनें।</span>
                  </li>
                </ol>
              </div>

              {/* Mobile Link Sharing */}
              <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
                <p className="text-[11px] text-zinc-400 font-hindi">
                  अपने फोन पर खोलने के लिए इस लिंक को WhatsApp या मैसेज पर भेजें:
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={appUrl}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-black border border-zinc-700 text-xs text-zinc-300 truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-xl bg-orange-500 text-black text-xs font-bold hover:bg-orange-600 transition-all flex items-center gap-1 flex-shrink-0"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'कॉपी हुआ' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Source Code ZIP Export Guide */
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2.5">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <FileCode2 className="w-4 h-4 text-orange-400" />
                  <span className="font-hindi">पूरा प्रोजेक्ट कोड (ZIP) कैसे डाउनलोड करें:</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-hindi">
                  अगर आप इस ऐप का पूरा सोर्स कोड अपने कंप्यूटर/लैपटॉप में डाउनलोड करना चाहते हैं:
                </p>
                <ol className="space-y-2 text-[11px] text-zinc-300 font-hindi pl-2">
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">1</span>
                    <span>AI Studio स्क्रीन के ऊपर दाएं कोने में <strong>Settings (⚙️)</strong> आइकन पर क्लिक करें।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">2</span>
                    <span>वहां <strong>"Export as ZIP"</strong> या <strong>"Export to GitHub"</strong> बटन चुनें।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">3</span>
                    <span>आपकी पूरी React + Vite + TypeScript प्रोजेक्ट फाइलें .zip फॉर्मेट में डाउनलोड हो जाएंगी।</span>
                  </li>
                </ol>
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200">
                💡 <strong>टिप:</strong> कोड को अपने कंप्यूटर में चलाने के लिए बस <code className="bg-black/50 px-1 py-0.5 rounded text-amber-300">npm install</code> और फिर <code className="bg-black/50 px-1 py-0.5 rounded text-amber-300">npm run dev</code> चलाएं।
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
