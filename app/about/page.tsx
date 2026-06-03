export default function AboutPage() {
  return (
    <div>
      <section className="py-20">
        <div className="container-narrow text-center">
          <p className="overline mb-6">Обо мне</p>
          <h1 className="section-title text-5xl md:text-6xl mb-12">Привет! Меня зовут Вика</h1>
        </div>
      </section>

      <section className="mb-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://picsum.photos/seed/about-portrait/1600/1000"
          alt="Портрет фотографа"
          className="w-full h-[60vh] object-cover bw"
        />
      </section>

      <section className="pb-24">
        <div className="container-narrow space-y-6 text-[17px] leading-relaxed text-gray-600">
          <p>
            Я фотограф в стиле живой фотографии — Lifestyle. Снимаю в Волгограде, Москве
            и Санкт-Петербурге. В профессиональной фотографии с 2019 года, и за это время
            успела попробовать много направлений: вместе с внутренними переменами менялись
            и мои предпочтения, видение, обработка, глубина вовлечённости в процесс.
          </p>
          <p>
            В данный момент не причисляю себя к какому-то конкретному жанру — я люблю фиксировать
            ЖИЗНЬ, и не важно, кто у меня в кадре: семья, один герой, пара, танцор или музыкальная группа.
          </p>
          <p>
            Главная ценность — живые эмоции, настоящие неподдельные чувства, моменты жизни,
            которые я ловлю и сохраняю вместе с Вами.
          </p>
          <p>
            Для меня всегда в приоритете человек, а пространство вокруг только дополняет картинку —
            по этой причине я фотографирую не во всех студиях и очень щепетильно отношусь к свету на локации.
          </p>
          <p>
            Вы попали не просто на сайт — это дом для моих работ. Ознакомившись с ними, Вы можете
            понять, какой результат получите после нашей встречи.
          </p>

          <div className="pt-8 text-center">
            <a href="#contact" className="btn">Связаться со мной</a>
          </div>
        </div>
      </section>
    </div>
  )
}
