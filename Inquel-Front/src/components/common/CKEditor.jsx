import React from "react";
import CKEditor from "ckeditor4-react";

export default class CKeditor extends React.Component {
    constructor() {
        super();
        CKEditor.editorUrl =
            "https://cdn.ckeditor.com/4.16.0/full-all/ckeditor.js";
    }

    render() {
        return (
            <CKEditor
                data={this.props.data}
                onChange={this.props.onChange}
                config={{
                    extraPlugins: "mathjax",
                    mathJaxLib:
                        "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML",
                    removePlugins: "exportpdf",
                    toolbar: [
                        {
                            name: "document",
                            groups: ["mode", "document", "doctools"],
                            items: ["Source", "-", "Preview", "Templates"],
                        },
                        {
                            name: "clipboard",
                            groups: ["clipboard", "undo"],
                            items: [
                                "Cut",
                                "Copy",
                                "Paste",
                                "PasteText",
                                "-",
                                "Undo",
                                "Redo",
                            ],
                        },
                        {
                            name: "editing",
                            groups: ["find", "selection", "spellchecker"],
                            items: [
                                "Find",
                                "Replace",
                                "SelectAll",
                                "Scayt",
                                "Language",
                                "-",
                                "CopyFormatting",
                                "RemoveFormat",
                            ],
                        },
                        { name: "links", items: ["Link", "Unlink"] },
                        {
                            name: "insert",
                            items: [
                                "Image",
                                "Flash",
                                "Table",
                                "HorizontalRule",
                                "Smiley",
                                "SpecialChar",
                                "PageBreak",
                                "Iframe",
                                "-",
                                "Mathjax",
                                "Maximize",
                            ],
                        },
                        "/",
                        {
                            name: "basicstyles",
                            groups: ["basicstyles", "cleanup"],
                            items: [
                                "Bold",
                                "Italic",
                                "Underline",
                                "Strike",
                                "Subscript",
                                "Superscript",
                            ],
                        },
                        {
                            name: "paragraph",
                            groups: [
                                "list",
                                "indent",
                                "blocks",
                                "align",
                                "bidi",
                            ],
                            items: [
                                "NumberedList",
                                "BulletedList",
                                "-",
                                "Outdent",
                                "Indent",
                                "-",
                                "Blockquote",
                                "-",
                                "JustifyLeft",
                                "JustifyCenter",
                                "JustifyRight",
                                "JustifyBlock",
                                "-",
                                "BidiLtr",
                                "BidiRtl",
                            ],
                        },
                        {
                            name: "styles",
                            items: ["Styles", "Format", "Font", "FontSize"],
                        },
                        { name: "colors", items: ["TextColor", "BGColor"] },
                    ],
                }}
            />
        );
    }
}

export class OptionEditor extends React.Component {
    render() {
        return (
            <CKEditor
                data={this.props.data}
                onChange={this.props.onChange}
                type="inline"
                config={{
                    editorplaceholder: "Enter options here...",
                    extraPlugins: "mathjax",
                    mathJaxLib:
                        "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML",
                    removePlugins: "exportpdf",
                    toolbar: [["Image", "Mathjax", "Maximize"]],
                }}
            />
        );
    }
}
