import {Position} from "unist";

export const Text = "TextNode"
export const Punctuation = "PunctuationNode"
export const Paragraph= "ParagraphNode"
export const Sentence= "SentenceNode"
export const Word= "WordNode"
export const WhiteSpace= "WhiteSpaceNode"

export interface SentenceNode extends Node{
  index: {
    punctuation
  }
  isFull: boolean
  children: any[]
  position: Position
}