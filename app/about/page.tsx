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
            Фотография появилась в моей жизни давно — когда-то это было простое увлечение,
            желание поймать моменты, которые иначе растворяются во времени.
          </p>
          <p>
            Сейчас это моё любимое хобби, от которого я по-настоящему кайфую. Каждая съёмка для меня —
            отдушина и чистое удовольствие, а не работа по шаблону.
          </p>
          <p>
            Снимаю на Canon R8. Люблю живой свет, настоящие эмоции и кадры, в которых человек
            остаётся собой. Для меня важнее всего, чтобы вам было легко и комфортно в кадре —
            тогда и фотографии получаются живыми.
          </p>

          <div className="pt-8 text-center">
            <a href="#contact" className="btn">Связаться со мной</a>
          </div>
        </div>
      </section>
    </div>
  )
}
