import { Link } from "wouter";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { FaceScanVisual } from "./FaceScanVisual";

const START = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/#partner`;

const why = [
  "تشتريها، تركّبها، تصلحها… ولكل فرع جهاز.",
  "الموظف الميداني ما يقدر يبصم أصلًا.",
  "البيانات تطلع ملف إكسل آخر الشهر، يعني تعرف المشكلة بعد ما خلصت.",
];
const rows: [string, string, boolean][] = [
  ["بصمة الوجه أو الإصبع من الجوال", "الشخص اللي بصم هو نفسه الموظف", false],
  ["التحقق من الموقع", "الحضور يتسجل من الفرع، مو من البيت", false],
  ["فروع وورديات متعددة", "مطعم، صالون، عيادة، متجر — كلهم على شاشة وحدة", false],
  ["تقارير لحظية", "تشوف التأخير والغياب وهو يصير، مو بعدين", false],
  ["نقاط للملتزمين", "الحضور بوقته يتحول لمكافأة", true],
];
const audience = [
  ["المطاعم والمقاهي", "ورديات صباحية ومسائية بدون لخبطة."],
  ["المحلات والفروع", "تعرف مين فتح المحل بوقته."],
  ["العيادات والصالونات", "فريق صغير، لكن كل دقيقة تفرق."],
  ["الفرق الميدانية", "حضور من موقع العمل، مو من المكتب."],
];

export function AttendanceArabic() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#EAF5FC] px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:pb-24 lg:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute -end-36 -top-40 h-[550px] w-[550px] rounded-full border-[90px] border-[#D3ECFA]/60" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.13fr_.87fr] lg:gap-16">
          <div className="max-w-[690px]">
            <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#B6DAF1] bg-[#F6FBFE] px-4 py-2 text-xs font-bold tracking-wide text-[#1267A2] sm:text-sm"><span className="h-2 w-2 rounded-full bg-[#2196F3]" />خدمة الحضور والانصراف</p>
            <h1 data-testid="text-attendance-heading" className="font-heading text-[2.75rem] font-black leading-[1.2] tracking-tight text-[#142D4A] sm:text-[4rem] lg:text-[4.6rem]">
              الحضور من الجوال… وما فيه مجال لـ"<span className="text-[#1689DC]">بصمة عن صاحبي</span>".
            </h1>
            <p className="mt-7 max-w-[580px] text-base font-medium leading-[1.9] text-[#4D657A] sm:text-lg">الموظف يبصم بوجهه أو بصمته من جواله، ونظامي يتأكد إنه فعلًا في الفرع.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={START} data-testid="link-attendance-hero-try" className="inline-flex items-center justify-center gap-3 rounded-full bg-[#1689DC] px-7 py-4 text-sm font-bold text-white shadow-[0_14px_25px_-15px_rgba(22,137,220,.7)] transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1689DC] sm:text-base">جرّب مجانًا<ArrowLeft size={18} aria-hidden="true" /></a>
            </div>
          </div>
          <FaceScanVisual label="شاشة حضور الفريق في تطبيق نظامي" />
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-3xl font-heading text-3xl font-black leading-snug text-[#142D4A] sm:text-5xl">ليش أجهزة البصمة صارت من الماضي؟</h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[28px] border border-[#DCE7F0] bg-[#DCE7F0] md:grid-cols-3">
            {why.map((text, i) => <article key={text} data-testid={`card-attendance-why-${i}`} className="bg-[#FCFDFE] p-6 sm:p-8">
              <span className="mb-7 block font-mono text-xs font-bold text-[#1689DC]">0{i + 1} /</span>
              <p className="font-heading text-xl font-black leading-relaxed text-[#173451]">{text}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-20 bg-[#153957] px-5 py-20 text-[#F0F8FC] sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-3xl font-heading text-3xl font-black leading-snug sm:text-5xl">نظامي يشتغل كذا</h2>
          <ol className="mt-12 space-y-3">
            {rows.map(([feature, meaning, rewards], i) => {
              const inner = <>
                <span className="font-mono text-2xl font-semibold text-[#82CDF6]">0{i + 1}</span>
                <h3 className="font-heading text-xl font-black">{feature}</h3>
                <p className="flex items-center justify-between gap-3 text-sm leading-7 text-[#BBD1E0] sm:text-base">{meaning}{rewards && <ArrowUpRight size={18} className="shrink-0 text-[#8ABCD9]" aria-hidden="true" />}</p>
              </>;
              const cls = "grid gap-2 rounded-2xl border border-[#41627A] bg-[#1C4565] p-6 transition-transform hover:-translate-y-1 sm:p-7 md:grid-cols-[4rem_1fr_1.2fr] md:items-center md:gap-6";
              return <li key={feature}>{rewards
                ? <Link href="/services/employee-rewards" data-testid="link-attendance-rewards-row" className={`${cls} hover:border-[#8CD1F8]`}>{inner}</Link>
                : <div data-testid={`row-attendance-how-${i}`} className={cls}>{inner}</div>}</li>;
            })}
          </ol>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-3xl font-heading text-3xl font-black leading-snug text-[#142D4A] sm:text-5xl">لمين هالخدمة؟</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {audience.map(([title, line], i) => <article key={title} data-testid={`card-attendance-audience-${i}`} className={`rounded-[26px] border p-7 sm:p-8 ${i === 0 ? "border-[#ACD8F4] bg-[#E6F4FD]" : "border-[#DCE7F0] bg-[#FCFDFE]"}`}>
              <h3 className="font-heading text-xl font-black text-[#1689DC]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#597086]">{line}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className="bg-[#1689DC] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-heading text-3xl font-black leading-snug text-white sm:text-5xl">كل الأنظمة تعطيك سجل حضور. نظامي يغيّر الحضور نفسه.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#DDF3FE] sm:text-lg">لأن الموظف اللي يعرف إن التزامه مشاهَد ومكافَأ، يجي بدري.</p>
          <a href={START} data-testid="link-attendance-final-start" className="mt-9 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#F8FCFE] px-7 py-4 text-sm font-black text-[#153957] transition-transform hover:-translate-y-0.5 sm:w-auto">ابدأ مجانًا — أول يوم حضور بكرة<ArrowLeft size={17} aria-hidden="true" /></a>
        </div>
      </section>
    </>
  );
}
