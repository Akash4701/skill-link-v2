import { EditorParser, EditorRenderer } from "@mobtakr/editorjs-parser";
import styles from "./PostContent.module.css";

const PostContent = (props: { content: string }) => {
  const content = JSON.parse(props.content);
  const parser = new EditorParser(content.blocks);

  const parsedBlocks = parser.parse();
  return (
    <>
      <EditorRenderer parsedBlocks={parsedBlocks} styles={styles} />
    </>
  );
};

export default PostContent;
