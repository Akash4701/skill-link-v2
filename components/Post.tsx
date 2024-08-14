import { useEffect, useState } from "react";
import axios from "axios";
import "./reset.css";
import Image from "next/image";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import React from "react";
import DOMPurify from "dompurify";

import { useToast } from "@/components/ui/use-toast";
import LinkTool from "@/components/LinkTool"; // Update the import path as needed

interface PartiPostProps {
  id: string;
}

interface Block {
  type: string;
  data: any;
}

interface Post {
  title: string;
  content: {
    blocks: Block[];
  };
}

const PartiPost = ({ id }: PartiPostProps) => {
  const { toast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get<Post>(`/api/post/getAPost/${id}`);
        setPost(response.data);
      } catch (err) {
        setError("Error fetching post");
        console.error("Fetch error:", err);
      }
    };

    fetchPost();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          description: "Copied to clipboard",
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          description: "Failed to copy",
          variant: "destructive",
        });
      });
  };

  const renderBlock = (block: Block, index: number) => {
    switch (block.type) {
      case "header":
        return React.createElement(`h${block.data.level}`, { key: index }, block.data.text);
      case "embed":
        return (
          <div key={index}>
            <iframe
              width="560"
              height="315"
              src={block.data.embed}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        );
      case "paragraph":
        const cleanText = DOMPurify.sanitize(block.data.text, { ALLOWED_TAGS: [] });
        return <p key={index} dangerouslySetInnerHTML={{ __html: cleanText }} />;
      case "delimiter":
        return <hr key={index} />;
      case "image":
        return (
          <div className="min-w-[15rem] h-[25rem] mb-2 relative" key={index}>
            <Image alt={block.data.caption} className="object-contain w-[15rem] border-2" fill src={block.data.file.url} />
          </div>
        );
      case "list":
        const ListTag = block.data.style === "ordered" ? "ol" : "ul";
        return (
          <ListTag key={index}>
            {block.data.items.map((item: any, itemIndex: number) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ListTag>
        );
      case "code":
        return (
          <div key={index} className="relative">
            <SyntaxHighlighter
              language={"javascript"}
              style={coldarkDark}
              customStyle={{ borderRadius: "5px" }}
            >
              {block.data.code}
            </SyntaxHighlighter>
            <button
              onClick={() => copyToClipboard(block.data.code)}
              className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white rounded"
            >
              Copy
            </button>
          </div>
        );
      case "table":
        return (
          <table key={index}>
            <tbody>
              {block.data.content.map((row: any, rowIndex: number) => (
                <tr key={rowIndex}>
                  {row.cells.map((cell: any, cellIndex: number) =>
                    rowIndex === 0 ? (
                      <th key={cellIndex}>{cell.text}</th>
                    ) : (
                      <td key={cellIndex}>{cell.text}</td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "blockquote":
        return <blockquote key={index}>{block.data.text}</blockquote>;
      case "linkTool":
        return (
          <div key={index}>
            <LinkTool
              url={block.data.link}
              title={block.data.meta.title}
              description={block.data.meta.description}
              onCopy={copyToClipboard}
            />
          </div>
        );
      default:
        console.log("Unknown block type", block.type);
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {post && post.title && (
        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      )}
      <div className="flex items-center justify-center m-9 p-9 ml-12 mr-12 pl-10 pr-10 mt-[-30px]">
        <div>
          {post?.content.blocks.map((block, index) => renderBlock(block, index))}
        </div>
      </div>
    </div>
  );
};

export default PartiPost;
