import Image from "next/image";
import { FaRegComment } from "react-icons/fa";
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
  {
    imgSrc: "",
    title: "Learn Language",
    text: "Well being and spiritual coach",
    timesUsed: "1.1m",
    slug: "life-coach",
  },
  {
    imgSrc: imgUrl,
    title: "Life Coach",
    text: "Well being and spiritual coach",
    timesUsed: "1.1m",
    slug: "life-coach",
  },
];

type GridCardsProps = {
  type: "medium" | "small";
  title?: string;
};

type CardData = {
  imgSrc: string;
  title: string;
  text: string;
  timesUsed: string;
  slug: string;
};

type CardProps = {
  data: CardData;
};

export default function GridCards({ type, title }: GridCardsProps) {
  return (
    <div className="py-6">
      <h3 className="mb-3 font-medium">{title}</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cardList.map((card, i) =>
          type === "medium" ? (
            <MediumCard key={`mc-${i}`} data={card} />
          ) : (
            <SmallCard key={`sc-${i}`} data={card} />
          ),
        )}
      </div>
    </div>
  );
}

function MediumCard({ data }: CardProps) {
  return (
    <Link href={data.slug ? data.slug : "/"}>
      <div className="flex h-36 gap-4 rounded-xl border border-slate-200/10 bg-slate-950 bg-opacity-60 p-3 opacity-95 hover:bg-slate-900">
        <div className="relative w-1/3">
          {data.imgSrc ? (
            <Image
              alt=""
              src={data.imgSrc}
              fill
              className="absoulute rounded-md object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-md bg-primary/80 text-4xl">
              {data.title[0]}
            </div>
          )}
        </div>
        <div className="flex w-2/3 flex-col justify-between">
          <div>
            <p className="mb-2 line-clamp-1 text-sm font-medium">
              {data.title}
            </p>
            <p className="line-clamp-3 text-xs font-light text-slate-400">
              {data?.text}
            </p>
          </div>
          {data.timesUsed && (
            <div className="flex items-center justify-start gap-1 text-slate-400">
              <FaRegComment className="text-sm" />{" "}
              <p className="text-xs">{data.timesUsed}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function SmallCard({ data }: CardProps) {
  return (
    <Link href={data.slug ? data.slug : "/"}>
      <div className="flex h-20 items-center justify-start gap-4 rounded-xl border border-slate-200/10 bg-slate-950 bg-opacity-60 p-3 opacity-95 hover:bg-slate-900">
        <div className="relative size-14">
          {data.imgSrc ? (
            <Image
              alt=""
              src={imgUrl}
              fill
              className="absoulute rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/80 text-4xl">
              {data.title[0]}
            </div>
          )}
        </div>
        <div className="flex w-2/3 flex-col justify-between text-sm">
          <div>
            <p className="mb-2 line-clamp-1 font-medium">{data.title}</p>
            <p className="line-clamp-1 font-light text-slate-400">
              {data?.text}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
