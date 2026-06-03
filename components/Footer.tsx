export default function Footer() {
  return (
    <footer id="contact" className="border-t border-gray-100 py-20 text-center">
      <div className="container-narrow">
        <h2 className="signature text-5xl text-black mb-2">Victoria Ustyuzhanina</h2>
        <p className="overline mb-10">photographer</p>

        <div className="space-y-2 text-gray-600 text-[15px]">
          <p>
            <a href="tel:+79270687535" className="hover:text-black transition">+7 927 068-75-35</a>
          </p>
          <p>Волгоград</p>
        </div>

        <div className="flex items-center justify-center gap-6 mt-10 text-gray-500">
          <a href="https://vk.com/nikatarova" className="hover:text-black transition" target="_blank" rel="noreferrer">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12.79 16.5h1.04s.31-.03.47-.21c.15-.16.15-.46.15-.46s-.02-1.4.63-1.6c.64-.2 1.46 1.36 2.33 1.96.66.46 1.16.36 1.16.36l2.33-.03s1.22-.08.64-1.04c-.05-.08-.34-.71-1.74-2.01-1.47-1.36-1.27-1.14.5-3.49 1.07-1.43 1.5-2.31 1.37-2.68-.13-.36-.92-.27-.92-.27l-2.62.02s-.2-.03-.34.06c-.14.09-.23.28-.23.28s-.42 1.11-.97 2.06c-1.18 1.99-1.65 2.1-1.84 1.97-.45-.29-.34-1.17-.34-1.79 0-1.95.3-2.76-.58-2.97-.29-.07-.5-.12-1.25-.12-.96 0-1.77 0-2.23.22-.31.15-.54.49-.4.51.17.02.55.1.76.38.26.36.25 1.16.25 1.16s.15 2.21-.35 2.49c-.35.19-.82-.2-1.87-2.02-.54-.93-.94-1.96-.94-1.96s-.08-.19-.22-.29c-.17-.12-.4-.16-.4-.16l-2.49.02s-.37.01-.51.17c-.12.14-.01.44-.01.44s1.95 4.56 4.16 6.86c2.02 2.11 4.32 1.97 4.32 1.97z"/></svg>
          </a>
          <a href="https://t.me/viktoriia_taranova" className="hover:text-black transition" target="_blank" rel="noreferrer">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M21.94 4.93c-.27-.23-.7-.26-1.2-.07h-.01C20.2 5.06 4.6 11.36 3.97 11.62c-.12.04-1.13.44-1.03 1.28.09.76.9 1.07 1 1.11l3.97 1.36c.26.86 1.23 4.02 1.44 4.71.13.43.35 1 .73 1.12.34.13.67.01.88-.16l2.43-2.25 3.92 3.05.09.05c.27.12.52.18.76.18.18 0 .35-.04.51-.11.55-.24.77-.79.79-.85L23 5.79c.16-.74-.06-1.39-.66-.86zM10.5 14.5l-1.07 4.07-.5-3.5 8.07-6.07-6.5 5.5z"/></svg>
          </a>
          <a href="https://instagram.com/nikatarova" className="hover:text-black transition" target="_blank" rel="noreferrer">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
        </div>

        <p className="text-xs text-gray-400 mt-12 tracking-wide">© 2026 ИП Устюжанина В.А. Все права защищены.</p>
      </div>
    </footer>
  )
}
