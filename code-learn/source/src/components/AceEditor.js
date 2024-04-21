import React, {useEffect, useRef} from "react";

export const AceEditor = (/** @type {AceEditorProps} */{value = "", onChange = ()=>{}, ...otherAttributes}) => {
    const editorRef = useRef(null);

    function createEditor() {
        const editor = ace.edit(editorRef.current);
        editor.setTheme("ace/theme/monokai");
        editor.session.setMode("ace/mode/javascript");
        editor.setValue(value);
        editor.clearSelection();
        editor.session.on("change", () => {
            onChange(editor.getValue());
        });
        return editor;
    }
    const [editor, setEditor] = React.useState(createEditor);

    useEffect(() => {
        setEditor(createEditor());
    }, [editorRef.current]);
    useEffect(() => {
        editor.session.on("change", () => {
            onChange(editor.getValue());
        })
    }, [onChange]);
    useEffect(() => {
        console.log("Value is ", value);
        editor.setValue(value);
        editor.clearSelection();
    }, [value]);

    return (
        <div ref={editorRef} {...otherAttributes} style={{minWidth: "20px", minHeight: "100px", ...otherAttributes.style}} className={(otherAttributes.className || "") + " " + "col-sm-12 col-lg-6"}/>
    );
};

export default AceEditor;