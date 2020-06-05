import { doc, Parser, Printer, SupportLanguage } from "prettier";
import { parsers as htmlParsers } from "prettier/parser-html";

const htmlParser = htmlParsers.html;
const uniqueID = "prettier-go-template-aefce456-67bb-4fbf-93fe-3d026c24bb1d";

const openingBrackets = "{{";
const closingBrackets = "}}";

const openingBracketsRegex = new RegExp(openingBrackets, "g");
const closingBracketsRegex = new RegExp(closingBrackets, "g");

const openingBracketsReplacement = `<!--${uniqueID}`;
const closingBracketsReplacement = `${uniqueID}-->`;

export const parsers = {
  "go-template": <Parser>{
    ...htmlParser,
    astFormat: "go-template",
    preprocess: text => {
      let result = text;

      result = result.replace(openingBracketsRegex, openingBracketsReplacement);
      result = result.replace(closingBracketsRegex, closingBracketsReplacement);

      return result;
    }
  }
};

export const languages: SupportLanguage[] = [
  {
    name: "GoTemplate",
    parsers: ["go-template"],
    extensions: [
      ".go.html",
      ".gohtml",
      ".gotmpl",
      ".go.tmpl",
      ".tmpl",
      ".tpl",
      ".html.tmpl",
      ".html.tpl"
    ],
    vscodeLanguageIds: ["gotemplate", "gohtml"],
    aceMode: "html"
  }
];

export const printers = {
  "go-template": <Printer>{
    print: () => {
      return "";
    },
    embed: (_, __, textToDoc, options) => {
      const htmlDoc = textToDoc(options.originalText, {
        parser: "html"
      });

      const mappedDoc = doc.utils.mapDoc(htmlDoc, docLeaf => {
        if (typeof docLeaf !== "string") {
          return docLeaf;
        }

        let result = docLeaf;

        result = result.replace(openingBracketsReplacement, openingBrackets);
        result = result.replace(closingBracketsReplacement, closingBrackets);

        return result;
      });

      return mappedDoc;
    }
  }
};
