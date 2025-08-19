import { Button } from "@/components/ui/button";
import { shareOnFacebook, shareOnTwitter, shareOnLinkedIn, copyToClipboard } from "@/lib/share-utils";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const { toast } = useToast();

  const handleCopyLink = async () => {
    try {
      await copyToClipboard(url);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the link manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        size="sm"
        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
        onClick={() => shareOnFacebook(url)}
        data-testid="button-share-facebook"
      >
        <i className="fab fa-facebook-f"></i>
        <span>Facebook</span>
      </Button>
      
      <Button
        size="sm"
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center space-x-2"
        onClick={() => window.open(`https://instagram.com`, '_blank')}
        data-testid="button-share-instagram"
      >
        <i className="fab fa-instagram"></i>
        <span>Instagram</span>
      </Button>
      
      <Button
        size="sm"
        className="bg-blue-400 hover:bg-blue-500 text-white flex items-center space-x-2"
        onClick={() => shareOnTwitter(url, title)}
        data-testid="button-share-twitter"
      >
        <i className="fab fa-twitter"></i>
        <span>Twitter</span>
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        className="border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center space-x-2"
        onClick={handleCopyLink}
        data-testid="button-copy-link"
      >
        <i className="fas fa-link"></i>
        <span>Copy Link</span>
      </Button>
    </div>
  );
}