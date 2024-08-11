import Image from "next/image";
import Link from "next/link";

const imgUrl =
  "https://images.unsplash.com/photo-1722941600615-636dace50933?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const cardList = [
  {
    imgSrc: imgUrl,
    title: "Life Coach",
    text: "Well being and spiritual coach",
    timesUsed: "1.1m",
    slug: "life-coach",
  },
  {
    imgSrc: "",
    title: "Life Coach",
    text: "Well being and spiritual coach Well being and spiritual coach Well being and spiritual coach Well being and spiritual coach Well being and spiritual coach Well being and spiritual coach Well being and spiritual coach",
    timesUsed: "1.1m",
    slug: "life-coach",
  },
];

function Hero() {
  return (
    <section className="relative my-8 hidden h-64 w-full rounded-2xl lg:block">
      <Image
        alt=""
        src={imgUrl}
        fill
        className="absoulute z-0 rounded-2xl object-cover opacity-80"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950" />
      <div className="relative flex h-full justify-end gap-3 p-3">
        <div className="mr-auto self-start rounded-xl bg-white/20 p-6 backdrop-blur-sm">
          <p className="text-slat-400">Do you wanna talk?</p>
          <h1 className="text-3xl font-semibold">Find Chat Right For You</h1>
        </div>

        {cardList.map((card, i) => (
          <Link
            key={`card-${i}`}
            className="h-full w-1/4"
            href={card.slug ? card.slug : "/"}
          >
            <div className="relative flex h-full items-start justify-start gap-4 rounded-xl border border-slate-200/10 bg-slate-950 bg-opacity-60 p-4 opacity-95 hover:bg-slate-900">
              <div className="relative size-14">
                {card.imgSrc ? (
                  <Image
                    alt=""
                    src={imgUrl}
                    fill
                    className="absoulute rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/80 text-4xl">
                    {card.title[0]}
                  </div>
                )}
              </div>
              <div className="w-2/3">
                <p className="mb-3 line-clamp-1 font-medium">{card.title}</p>
                <p className="line-clamp-4 font-light text-slate-400">
                  {card?.text}
                </p>
              </div>
              <div className="absolute bottom-4 left-4 text-slate-400">
                <p>Answer...</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Hero;
