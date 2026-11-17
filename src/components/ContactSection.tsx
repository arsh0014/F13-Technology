import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, Mail, MapPin, Phone } from 'lucide-react';
import { BUDGET_OPTIONS, SERVICES } from '../data/siteContent';
import { gsap } from '../utils/gsapSetup';
import {
  hasFormErrors,
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
} from '../utils/validation';
import { MagneticButton } from './MagneticButton';
import { KineticText } from './motion/KineticLink';
import { SplitText } from './motion/SplitText';

interface ContactSectionProps {
  preselectedService: string;
  preselectedContextNote: string;
}

const INITIAL_VALUES: ContactFormValues = {
  fullName: '',
  businessEmail: '',
  companyName: '',
  serviceInterestedIn: '',
  projectBudget: '',
  projectDescription: '',
};

export function ContactSection({
  preselectedService,
  preselectedContextNote,
}: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pitchRef = useRef<HTMLParagraphElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const infoListRef = useRef<HTMLDivElement>(null);
  const formPanelRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submittedRecord, setSubmittedRecord] = useState<ContactFormValues | null>(null);

  useEffect(() => {
    const infoList = infoListRef.current;
    if (!infoList || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      if (pitchRef.current) {
        gsap.fromTo(
          pitchRef.current,
          { y: 16 },
          {
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: pitchRef.current,
              start: 'top 99%',
              end: 'bottom 2%',
              toggleActions: 'play none play none',
            },
          },
        );
      }

      if (ruleRef.current) {
        gsap.fromTo(
          ruleRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.65,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: infoList,
              start: 'top 99%',
              end: 'bottom 2%',
              toggleActions: 'play none play none',
            },
          },
        );
      }

      const items = infoList.querySelectorAll('[data-contact-item]');
      gsap.fromTo(
        items,
        { x: -12 },
        {
          x: 0,
          duration: 0.48,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: infoList,
            start: 'top 99%',
            end: 'bottom 2%',
            toggleActions: 'play none play none',
          },
        },
      );

      if (formPanelRef.current) {
        gsap.fromTo(
          formPanelRef.current,
          { y: 18 },
          {
            y: 0,
            duration: 0.52,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formPanelRef.current,
              start: 'top 99%',
              end: 'bottom 2%',
              toggleActions: 'play none play none',
            },
          },
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (preselectedService) {
      setValues((prev) => ({
        ...prev,
        serviceInterestedIn: preselectedService,
        projectDescription:
          preselectedContextNote && !prev.projectDescription
            ? preselectedContextNote
            : prev.projectDescription,
      }));
      setSubmittedRecord(null);
    }
  }, [preselectedService, preselectedContextNote]);

  const focusForm = (defaultMode?: string) => {
    setSubmittedRecord(null);
    if (defaultMode && !values.serviceInterestedIn) {
      setValues((prev) => ({ ...prev, serviceInterestedIn: defaultMode }));
    }
    window.setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100);
  };

  const handleFieldChange = (field: keyof ContactFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateContactForm(values);
    if (hasFormErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmittedRecord({ ...values });
  };

  const handleReset = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setSubmittedRecord(null);
    window.setTimeout(() => {
      nameInputRef.current?.focus();
    }, 60);
  };

  return (
    <section
      id="contact"
      data-nav-theme="light"
      ref={sectionRef}
      className="scroll-mt-12 py-20 sm:py-28 lg:py-36 bg-white text-[#0A0A0A] border-t border-[#0A0A0A]/10"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Minimal Editorial Pitch & Studio Coordinates */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#008774]">
                / Let&apos;s Talk
              </div>
              <SplitText
                as="h2"
                text="Have a challenge worth solving"
                accentSuffix="?"
                mode="words"
                className="font-display font-semibold tracking-[-0.04em] text-[#0A0A0A] leading-[0.98]"
                style={{ fontSize: 'clamp(2.5rem, 4.8vw, 4.2rem)' }}
              />
              <p
                ref={pitchRef}
                className="text-sm sm:text-base text-[#525252] leading-relaxed max-w-md will-change-transform"
              >
                Let&apos;s explore what&apos;s possible when the right architecture meets the
                right digital craft.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={() => focusForm('IT Consulting & Digital Transformation')}
                className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#0A0A0A] pb-1 border-b border-[#0A0A0A] hover:text-[#008774] hover:border-[#008774] transition-colors cursor-pointer"
              >
                <KineticText>START A PROJECT</KineticText>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => focusForm('General Advisory Conversation')}
                className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#525252] pb-1 border-b border-[#0A0A0A]/25 hover:text-[#0A0A0A] hover:border-[#0A0A0A] transition-colors cursor-pointer"
              >
                <KineticText>GENERAL INQUIRY</KineticText>
              </button>
            </div>

            <div ref={infoListRef} className="relative pt-8 space-y-5 text-sm">
              <div
                ref={ruleRef}
                aria-hidden="true"
                className="absolute top-0 inset-x-0 h-[1px] bg-[#0A0A0A]/12 origin-left"
              />
              <div data-contact-item className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#008774] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-[11px] uppercase tracking-[0.07em] text-[#737373]">
                    Direct Mail
                  </div>
                  <a
                    href="mailto:hello@arkon.studio"
                    className="font-medium text-[#0A0A0A] hover:text-[#008774] transition-colors"
                  >
                    hello@arkon.studio
                  </a>
                </div>
              </div>

              <div data-contact-item className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#008774] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-[11px] uppercase tracking-[0.07em] text-[#737373]">
                    Telephone
                  </div>
                  <span className="font-medium text-[#0A0A0A] font-mono tabular-nums">
                    +1 (555) 014-8900
                  </span>
                </div>
              </div>

              <div data-contact-item className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#008774] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-[11px] uppercase tracking-[0.07em] text-[#737373]">
                    Studios
                  </div>
                  <span className="font-medium text-[#0A0A0A]">
                    Zurich · London · New York
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Validated Architectural Form */}
          <div
            ref={formPanelRef}
            className="lg:col-span-7 bg-[#F6F6F4] border border-[#0A0A0A]/10 rounded-2xl p-6 sm:p-10 lg:p-12 will-change-transform"
          >
            {submittedRecord ? (
              <div role="status" aria-live="polite" className="space-y-6 py-4">
                <div className="flex items-center gap-3 text-[#008774]">
                  <CheckCircle2 className="w-7 h-7 shrink-0" aria-hidden="true" />
                  <span className="font-display text-2xl font-semibold text-[#0A0A0A]">
                    Inquiry Received
                  </span>
                </div>
                <p className="text-base text-[#525252] leading-relaxed">
                  Thank you, <strong className="text-[#0A0A0A]">{submittedRecord.fullName}</strong>.
                  Your inquiry regarding{' '}
                  <strong className="text-[#0A0A0A]">{submittedRecord.serviceInterestedIn}</strong>{' '}
                  has been logged for review. A principal partner will reply to{' '}
                  <span className="font-medium text-[#0A0A0A]">{submittedRecord.businessEmail}</span>{' '}
                  within one business day.
                </p>

                <div className="bg-white border border-[#0A0A0A]/10 rounded-xl p-5 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-[#525252]">Company</span>
                    <span className="font-medium text-[#0A0A0A]">
                      {submittedRecord.companyName || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#525252]">Estimated Budget</span>
                    <span className="font-medium text-[#0A0A0A] tabular-nums">
                      {submittedRecord.projectBudget}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="group px-6 py-3 rounded-full bg-[#0A0A0A] text-white text-xs font-semibold uppercase tracking-[0.08em] hover:bg-[#00C2A8] hover:text-[#050505] transition-colors cursor-pointer"
                >
                  <KineticText>Send Another Inquiry</KineticText>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="contact-full-name"
                      className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#0A0A0A] mb-2"
                    >
                      Full Name <span className="text-[#008774]">*</span>
                    </label>
                    <div className="relative group">
                      <input
                        ref={nameInputRef}
                        id="contact-full-name"
                        name="fullName"
                        type="text"
                        required
                        value={values.fullName}
                        onChange={(e) => handleFieldChange('fullName', e.target.value)}
                        placeholder="Alex Rivera"
                        aria-invalid={Boolean(errors.fullName)}
                        aria-describedby={errors.fullName ? 'error-fullName' : undefined}
                        className="w-full px-4 py-3 bg-white border border-[#0A0A0A]/15 rounded-lg text-sm text-[#0A0A0A] placeholder:text-[#737373] focus:outline-none focus:border-[#00C2A8]"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-0 inset-x-2 h-[2px] bg-[#00C2A8] scale-x-0 group-focus-within:scale-x-100 origin-left transition-transform duration-300 ease-out"
                      />
                    </div>
                    {errors.fullName && (
                      <p id="error-fullName" className="mt-1.5 text-xs text-red-700 font-medium">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#0A0A0A] mb-2"
                    >
                      Business Email <span className="text-[#008774]">*</span>
                    </label>
                    <div className="relative group">
                      <input
                        id="contact-email"
                        name="businessEmail"
                        type="email"
                        required
                        value={values.businessEmail}
                        onChange={(e) => handleFieldChange('businessEmail', e.target.value)}
                        placeholder="alex@company.com"
                        aria-invalid={Boolean(errors.businessEmail)}
                        aria-describedby={errors.businessEmail ? 'error-businessEmail' : undefined}
                        className="w-full px-4 py-3 bg-white border border-[#0A0A0A]/15 rounded-lg text-sm text-[#0A0A0A] placeholder:text-[#737373] focus:outline-none focus:border-[#00C2A8]"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-0 inset-x-2 h-[2px] bg-[#00C2A8] scale-x-0 group-focus-within:scale-x-100 origin-left transition-transform duration-300 ease-out"
                      />
                    </div>
                    {errors.businessEmail && (
                      <p id="error-businessEmail" className="mt-1.5 text-xs text-red-700 font-medium">
                        {errors.businessEmail}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="contact-company"
                      className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#0A0A0A] mb-2"
                    >
                      Company Name
                    </label>
                    <div className="relative group">
                      <input
                        id="contact-company"
                        name="companyName"
                        type="text"
                        value={values.companyName}
                        onChange={(e) => handleFieldChange('companyName', e.target.value)}
                        placeholder="Organization Inc."
                        className="w-full px-4 py-3 bg-white border border-[#0A0A0A]/15 rounded-lg text-sm text-[#0A0A0A] placeholder:text-[#737373] focus:outline-none focus:border-[#00C2A8]"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-0 inset-x-2 h-[2px] bg-[#00C2A8] scale-x-0 group-focus-within:scale-x-100 origin-left transition-transform duration-300 ease-out"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-budget"
                      className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#0A0A0A] mb-2"
                    >
                      Project Budget <span className="text-[#008774]">*</span>
                    </label>
                    <div className="relative group">
                      <select
                        id="contact-budget"
                        name="projectBudget"
                        required
                        value={values.projectBudget}
                        onChange={(e) => handleFieldChange('projectBudget', e.target.value)}
                        aria-invalid={Boolean(errors.projectBudget)}
                        aria-describedby={errors.projectBudget ? 'error-projectBudget' : undefined}
                        className="w-full px-4 py-3 bg-white border border-[#0A0A0A]/15 rounded-lg text-sm text-[#0A0A0A] focus:outline-none focus:border-[#00C2A8]"
                      >
                        <option value="">Select estimated range</option>
                        {BUDGET_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-0 inset-x-2 h-[2px] bg-[#00C2A8] scale-x-0 group-focus-within:scale-x-100 origin-left transition-transform duration-300 ease-out"
                      />
                    </div>
                    {errors.projectBudget && (
                      <p id="error-projectBudget" className="mt-1.5 text-xs text-red-700 font-medium">
                        {errors.projectBudget}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-service"
                    className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#0A0A0A] mb-2"
                  >
                    Service Interested In <span className="text-[#008774]">*</span>
                  </label>
                  <div className="relative group">
                    <select
                      id="contact-service"
                      name="serviceInterestedIn"
                      required
                      value={values.serviceInterestedIn}
                      onChange={(e) => handleFieldChange('serviceInterestedIn', e.target.value)}
                      aria-invalid={Boolean(errors.serviceInterestedIn)}
                      aria-describedby={
                        errors.serviceInterestedIn ? 'error-serviceInterestedIn' : undefined
                      }
                      className="w-full px-4 py-3 bg-white border border-[#0A0A0A]/15 rounded-lg text-sm text-[#0A0A0A] focus:outline-none focus:border-[#00C2A8]"
                    >
                      <option value="">Select a capability area</option>
                      <option value="General Advisory Conversation">
                        General Advisory Conversation
                      </option>
                      {SERVICES.map((svc) => (
                        <option key={svc.id} value={svc.title}>
                          {svc.index}. {svc.title}
                        </option>
                      ))}
                    </select>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-0 inset-x-2 h-[2px] bg-[#00C2A8] scale-x-0 group-focus-within:scale-x-100 origin-left transition-transform duration-300 ease-out"
                    />
                  </div>
                  {errors.serviceInterestedIn && (
                    <p
                      id="error-serviceInterestedIn"
                      className="mt-1.5 text-xs text-red-700 font-medium"
                    >
                      {errors.serviceInterestedIn}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-description"
                    className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#0A0A0A] mb-2"
                  >
                    Project Description <span className="text-[#008774]">*</span>
                  </label>
                  <div className="relative group">
                    <textarea
                      id="contact-description"
                      name="projectDescription"
                      rows={4}
                      required
                      value={values.projectDescription}
                      onChange={(e) => handleFieldChange('projectDescription', e.target.value)}
                      placeholder="Share your goals, timeline, and the technical or business challenge you want to solve..."
                      aria-invalid={Boolean(errors.projectDescription)}
                      aria-describedby={
                        errors.projectDescription ? 'error-projectDescription' : undefined
                      }
                      className="w-full px-4 py-3 bg-white border border-[#0A0A0A]/15 rounded-lg text-sm text-[#0A0A0A] placeholder:text-[#737373] focus:outline-none focus:border-[#00C2A8]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-0 inset-x-2 h-[2px] bg-[#00C2A8] scale-x-0 group-focus-within:scale-x-100 origin-left transition-transform duration-300 ease-out"
                    />
                  </div>
                  {errors.projectDescription && (
                    <p
                      id="error-projectDescription"
                      className="mt-1.5 text-xs text-red-700 font-medium"
                    >
                      {errors.projectDescription}
                    </p>
                  )}
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-[#525252]">
                    Direct response within 1 business day · NDA available upon request
                  </span>
                  <MagneticButton
                    type="submit"
                    className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0A0A0A] text-white text-xs font-semibold uppercase tracking-[0.08em] hover:bg-[#00C2A8] hover:text-[#050505] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <KineticText>Send Project Inquiry</KineticText>
                    <ArrowRight
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </MagneticButton>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
