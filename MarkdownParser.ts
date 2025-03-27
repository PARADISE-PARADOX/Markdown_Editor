enum TagType {
  Paragraph,
  Header1,
  Header2,
  Header3,
  HorizontalRule,
}

class HtmlHandler {
  public TextChangeHandler(id: string, output: string): void {
    let markdown = <HTMLTextAreaElement>document.getElementById(id);
    let markdownOutput = <HTMLLabelElement>document.getElementById(output);
    if (markdown) {
      markdown.onkeyup = (e) => {
        if (markdown.value) {
          markdownOutput.innerHTML = markdown.value;
        } else {
          markdownOutput.innerHTML = "<p></p>";
        }
      };
    }
  }
}

// 将枚举类型的TagType转换为HTML标签
class TagTypeToHtml {
  private readonly tagType: Map<TagType, string> = new Map<TagType, string>();
  constructor() {
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
  private GetTag(tagType: TagType, openingTagPattern: string): string {
    let tag = this.tagType.get(tagType);
    if (tag) {
      return `${openingTagPattern}${tag}>`;
    }
    return `${openingTagPattern}p>`;
  }

  public OpeningTag(tagType: TagType): string {
    return this.GetTag(tagType, "<");
  }

  public ClosingTag(tagType: TagType): string {
    return this.GetTag(tagType, "</");
  }
}

interface IMarkdownDocument {
  //该方法用于向文档中添加内容，参数为字符串数组，每个字符串代表一行内容。
  Add(...content: string[]): void;

  //该方法用于获取文档的内容，返回值为字符串。
  Get(): string;
}

class MarkdownDocument implements IMarkdownDocument {
  private content: string = "";

  //将字符串数组合并成一个字符串
  Add(...content: string[]): void {
    content.forEach((element) => {
      this.content += element;
    });
  }
  Get(): string {
    return this.content;
  }
}

//当前处理的行
class ParseElement {
  CurrentLine: string = "";
}

//使用访问者模式

// 访问者接口：定义对 Markdown 元素的操作方法，用于将解析元素转换为目标文档内容
interface IVisitor {
  //token表示正在处理的markdown元素对象，markdownDocument表示目标文档对象
  Visit(token: ParseElement, markdownDocument: IMarkdownDocument): void;
}

// 访问处理方法：根据元素类型处理 ParseElement 并更新 Markdown 文档
interface IVisitable {
  Accept(
    visitor: IVisitor,
    token: ParseElement,
    markdownDocument: IMarkdownDocument
  ): void;
}

abstract class VisitorBase implements IVisitor {
  constructor(
    private readonly tagType: TagType,
    private readonly TagTypeToHtml: TagTypeToHtml
  ) {}
  Visit(token: ParseElement, markdownDocument: IMarkdownDocument): void {
    markdownDocument.Add(
      this.TagTypeToHtml.OpeningTag(this.tagType),
      token.CurrentLine,
      this.TagTypeToHtml.ClosingTag(this.tagType)
    );
  }
}

class Header1Visitor extends VisitorBase {
  constructor() {
    super(TagType.Header1, new TagTypeToHtml());
  }
}

class Header2Visitor extends VisitorBase {
  constructor() {
    super(TagType.Header2, new TagTypeToHtml());
  }
}

class Header3Visitor extends VisitorBase {
  constructor() {
    super(TagType.Header3, new TagTypeToHtml());
  }
}

class ParagraphVisitor extends VisitorBase {
  constructor() {
    super(TagType.Paragraph, new TagTypeToHtml());
  }
}

class HorizontalRuleVisitor extends VisitorBase {
  constructor() {
    super(TagType.HorizontalRule, new TagTypeToHtml());
  }
}

abstract class Handler<T> {
  protected next: Handler<T> | null = null;
  public SetNext(next: Handler<T>): void {
    this.next = next;
  }
  public HandleRequest(request: T): void {
    if (!this.CanHandle(request)) {
      if (this.next) {
        this.next.HandleRequest(request);
      }
      return;
    }
  }
  protected abstract CanHandle(request: T): boolean;
}
