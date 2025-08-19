export const shareOnFacebook = (url: string) => {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(facebookUrl, '_blank', 'width=600,height=400');
};

export const shareOnTwitter = (url: string, text?: string) => {
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text || '')}`;
  window.open(twitterUrl, '_blank', 'width=600,height=400');
};

export const shareOnLinkedIn = (url: string, title?: string, summary?: string) => {
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title || '')}&summary=${encodeURIComponent(summary || '')}`;
  window.open(linkedInUrl, '_blank', 'width=600,height=400');
};

export const copyToClipboard = async (text: string): Promise<void> => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers or non-HTTPS contexts
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'absolute';
    textarea.style.left = '-99999999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
};

export const generateShareMessage = (title: string, businessName?: string) => {
  return `Check out this amazing pet care transformation: ${title}${businessName ? ` by ${businessName}` : ''} via PetFolio`;
};
