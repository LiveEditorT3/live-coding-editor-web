import { useRepo } from "../../../contexts/repoContext";
import { useEffect, useRef } from "react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/python/python";
import "codemirror/theme/material-ocean.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/clike/clike";
import "codemirror/mode/go/go";
import "codemirror/keymap/sublime";

const Editor = (props) => {
  const sharedStringHelper = props.sharedStringHelper;
  const { mode, setContent } = useRepo();
  const editorRef = useRef(null);

  const getStringText = (lines) => lines.join("\n");

  const updateSharedString = (instance, changeObj) => {
    const from = instance.indexFromPos(changeObj.from);
    const to = instance.indexFromPos(changeObj.to);

    switch (changeObj.origin) {
      case "+input":
      case "undo":
      case "paste":
        sharedStringHelper.insertText(getStringText(changeObj.text), from);
        break;
      case "+delete":
      case "cut":
        // Move the to pointer to the original position before deletion.
        sharedStringHelper.removeText(
          from,
          to + getStringText(changeObj.removed).length
        );
        break;
      case "replace":
        sharedStringHelper.replaceText(getStringText(changeObj.text), from, to);
        break;
      default:
        throw Error(`Unexpected origin of change event: ${changeObj.origin}`);
    }
  };

  useEffect(() => {
    if (!!editorRef.current) return;
    const editorComponent = CodeMirror.fromTextArea(
      document.getElementById("code"),
      {
        lineNumbers: true,
        keyMap: "sublime",
        theme: "material-ocean",
        mode: "python",
      }
    );
    editorComponent.on("change", handleChange);
    editorComponent.setValue(sharedStringHelper.getText());
    editorRef.current = editorComponent;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    editorRef.current.setOption("mode", mode);
  }, [mode]);

  const handleChange = (instance, changeObj) => {
    if (changeObj.origin === "setValue") return;

    const newText = instance.getValue();
    setContent(newText);

    updateSharedString(instance, changeObj);
  };

  useEffect(() => {
    /**
     * There's been a change to the SharedString's data.  This means the most recent state of the text
     * is in the SharedString, and we need to
     * 1. Store the text state in React
     * 2. If the change came from a remote source, it may have moved our selection.  Compute it, update
     *    the textarea, and store it in React
     */

    const handleTextChanged = (event) => {
      const newText = sharedStringHelper.getText();
      const cursorPosition = editorRef.current.getCursor();
      editorRef.current.setValue(newText);
      editorRef.current.setCursor(cursorPosition);

      setContent(newText);
    };

    sharedStringHelper.on("textChanged", handleTextChanged);
    return () => {
      sharedStringHelper.off("textChanged", handleTextChanged);
    };
  }, [sharedStringHelper, setContent]);

  return (
    <div>
      <textarea id="code" />
    </div>
  );
};

export default Editor;
