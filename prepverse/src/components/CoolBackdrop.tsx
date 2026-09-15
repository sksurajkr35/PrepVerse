import React from 'react';

export const CoolBackdrop: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Subtle modern grid pattern for aesthetic depth */}
      <div className="absolute inset-0 cool-grid-bg opacity-60" />

      {/* Ambient Cool Glow 1: Mint / Seafoam / Sage */}
      <div className="absolute -top-32 -left-32 w-[38rem] h-[38rem] rounded-full bg-gradient-to-br from-teal-200/35 via-emerald-100/25 to-transparent dark:from-teal-800/20 dark:via-emerald-950/20 dark:to-transparent blur-3xl animate-cool-float-1" />

      {/* Ambient Cool Glow 2: Glacial Cyan / Ice Blue */}
      <div className="absolute top-1/4 -right-28 w-[42rem] h-[42rem] rounded-full bg-gradient-to-bl from-cyan-200/40 via-sky-100/30 to-transparent dark:from-cyan-900/25 dark:via-sky-950/25 dark:to-transparent blur-3xl animate-cool-float-2" />

      {/* Ambient Cool Glow 3: Cool Sky / Pale Lavender Breeze */}
      <div className="absolute -bottom-36 left-1/3 w-[44rem] h-[44rem] rounded-full bg-gradient-to-tr from-sky-200/30 via-indigo-100/20 to-teal-100/25 dark:from-sky-900/20 dark:via-indigo-950/20 dark:to-teal-950/20 blur-3xl animate-cool-float-3" />

      {/* Ambient Radial Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-slate-200/30 dark:to-slate-950/50" />
    </div>
  );
};
export default CoolBackdrop;
