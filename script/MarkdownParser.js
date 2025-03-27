"use strict";
var TagType;
(function (TagType) {
    TagType[TagType["Paragraph"] = 0] = "Paragraph";
    TagType[TagType["Header1"] = 1] = "Header1";
    TagType[TagType["Header2"] = 2] = "Header2";
    TagType[TagType["Header3"] = 3] = "Header3";
    TagType[TagType["HorizontalRule"] = 4] = "HorizontalRule";
})(TagType || (TagType = {}));
class HtmlHandler {
    TextChangeHandler(id, output) {
        let markdown = document.getElementById(id);
        let markdownOutput = document.getElementById(output);
        if (markdown) {
            markdown.onkeyup = (e) => {
                if (markdown.value) {
                    markdownOutput.innerHTML = markdown.value;
                }
                else {
                    markdownOutput.innerHTML = "<p></p >";
                }
            };
        }
    }
}
class TagTypeToHtml {
    constructor() {
        this.tagType = new Map();
        this.tagType.set(TagType.Paragraph, "p");
        this.tagType.set(TagType.Header1, "h1");
        this.tagType.set(TagType.Header2, "h2");
        this.tagType.set(TagType.Header3, "h3");
        this.tagType.set(TagType.HorizontalRule, "hr");
    }
    //获取开标签和闭标签
    //   public OpeningTag(tagType: TagType): string {
    //     let tag = this.tagType.get(tagType);
    //     if (tag) {
    //       return `<${tag}>`;
    //     }
    //     return `<p>`;
    //   }
    //   public ClosingTag(tagType:TagType):string{
    //     let tag = this.tagType.get(tagType);
    //     if(tag){
    //       return `</${tag}>`;
    //     }
    //     return `</p>`;
    //   }
    //获取标签，通过方法获取开闭标签
    GetTag(tagType, openingTagPattern) {
        let tag = this.tagType.get(tagType);
        if (tag) {
            return `${openingTagPattern}${tag}>`;
        }
        return `${openingTagPattern}p>`;
    }
    OpeningTag(tagType) {
        return this.GetTag(tagType, "<");
    }
    ClosingTag(tagType) {
        return this.GetTag(tagType, "</");
    }
}
//# sourceMappingURL=MarkdownParser.js.map