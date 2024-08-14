// components/LinkTool.tsx
import React from "react";
import { useToast } from "@/components/ui/use-toast";

interface LinkToolProps {
  url: string;
  title: string;
  description: string;
  onCopy: (url: string) => void;
}

const LinkTool = ({ url, title, description, onCopy }: LinkToolProps) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
      .then(() => {
        toast({
          description: "Link copied to clipboard",
        });
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        toast({
          description: "Failed to copy link",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="p-4 mb-4 border rounded-lg bg-[#00011c] relative">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block mb-2"
      >
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </a>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white rounded"
      >
        Copy Link
      </button>
    </div>
  );
};

export default LinkTool;
