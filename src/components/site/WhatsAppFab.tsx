import { whatsappLink } from "@/lib/brand";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink("Hi Western Rathi! I'd like to know more about your collection.")}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat on WhatsApp"
      className="fixed right-4 bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-[var(--shadow-lift)] transition-transform duration-300 hover:scale-105 active:scale-95 sm:right-6 sm:bottom-6"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-whatsapp/40" />
      <svg viewBox="0 0 32 32" className="relative h-7 w-7 fill-current" aria-hidden="true">
        <path d="M16.001 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.257.594 4.46 1.723 6.4L3.2 28.8l6.56-1.706a12.74 12.74 0 0 0 6.24 1.62h.006c7.055 0 12.795-5.74 12.795-12.8 0-3.42-1.332-6.635-3.75-9.052A12.71 12.71 0 0 0 16.001 3.2Zm0 23.04h-.005a10.63 10.63 0 0 1-5.42-1.485l-.389-.23-4.03 1.048 1.076-3.93-.253-.403a10.6 10.6 0 0 1-1.626-5.663c0-5.867 4.776-10.64 10.65-10.64 2.844 0 5.517 1.11 7.526 3.12a10.57 10.57 0 0 1 3.116 7.526c0 5.868-4.775 10.657-10.645 10.657Zm5.84-7.977c-.32-.16-1.893-.934-2.186-1.04-.293-.107-.507-.16-.72.16s-.826 1.04-1.013 1.253c-.187.214-.373.24-.693.08-.32-.16-1.351-.498-2.573-1.588-.951-.848-1.593-1.895-1.78-2.215-.186-.32-.02-.493.14-.652.144-.144.32-.373.48-.56.16-.187.213-.32.32-.533.107-.214.053-.4-.027-.56-.08-.16-.72-1.736-.986-2.376-.26-.624-.524-.54-.72-.55l-.613-.01c-.213 0-.56.08-.853.4-.293.32-1.12 1.094-1.12 2.67s1.147 3.098 1.307 3.311c.16.214 2.257 3.446 5.467 4.833.764.33 1.36.527 1.825.674.767.244 1.464.21 2.016.128.615-.092 1.893-.774 2.16-1.522.267-.747.267-1.387.187-1.52-.08-.134-.293-.214-.613-.374Z" />
      </svg>
    </a>
  );
}
