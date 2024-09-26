import { FaFacebook, FaTwitter } from "react-icons/fa";

const url = process.env.PRODUCTION_BASE_URL!;
const text = "Free Online AI Therapist Chatbot";

function ShareButtons() {
  const shareUrl = encodeURIComponent(url);
  const shareText = encodeURIComponent(text);

  return (
    <div className="flex items-center justify-start gap-3 py-2">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary"
        aria-label="Share on Facebook"
      >
        <FaFacebook className="size-6" />
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary"
        aria-label="Share on Twitter"
      >
        <FaTwitter className="size-6" />
      </a>
    </div>
  );
}

export default ShareButtons;
