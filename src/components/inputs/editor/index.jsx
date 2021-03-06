import { useEffect, useRef, useContext } from "react";
import { useTheme } from "@mui/styles";
import CodeMirror from "codemirror";
import "codemirror/keymap/sublime";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/eclipse.css";
import "codemirror/theme/darcula.css";
import "codemirror/mode/python/python";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/clike/clike";
import "codemirror/mode/go/go";
import "codemirror/mode/rust/rust";
import "codemirror/mode/toml/toml";
import "codemirror/mode/octave/octave";
import "codemirror/mode/yaml/yaml";
import "codemirror/mode/shell/shell";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/edit/matchtags";
import "codemirror/addon/fold/brace-fold";
import "codemirror/addon/fold/indent-fold";
import "codemirror/addon/fold/xml-fold";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/fold/foldgutter.css";
import { getDatabase, off, onValue, ref } from "firebase/database";
import { FirebaseContext } from "../../../contexts/firebaseContext";
import { RepoContext } from "../../../contexts/repoContext";
import { LoginContext, loggedIn } from "../../../contexts/loginContext";

const Editor = ({ sharedStringHelper }) => {
  const theme = useTheme();
  const { fileContent, setFileContent } = useContext(RepoContext);
  const { app } = useContext(FirebaseContext);
  const { user } = useContext(LoginContext);

  const editorRef = useRef(null);

  const getStringText = (lines) => lines.join("\n");
  const isEmpty = (list) =>
    !list || !list.length || (list.length === 1 && list.every((v) => !v));

  const isEqualArrays = (array1, array2) =>
    array1.length === array2.length &&
    array1.every((value, index) => value === array2[index]);

  const updateSharedString = (instance, changeObj) => {
    const from = instance.indexFromPos(changeObj.from);
    const to = instance.indexFromPos(changeObj.to);

    switch (changeObj.origin) {
      case "+input":
      case "paste":
        if (isEmpty(changeObj.removed)) {
          sharedStringHelper.insertText(getStringText(changeObj.text), from);
        } else {
          sharedStringHelper.replaceText(
            getStringText(changeObj.text),
            from,
            to
          );
        }
        break;
      case "+delete":
      case "cut":
        // Move the to pointer to the original position before deletion.
        sharedStringHelper.removeText(
          from,
          to + getStringText(changeObj.removed).length
        );
        break;
      case "undo":
      case "redo":
        // Undo generates a first event where nothing needs to be done.
        if (isEqualArrays(changeObj.removed, changeObj.text)) break;
        // The second event for undo is the important one.
        // Undo/Redo could be an insertion or a deletion.
        if (isEmpty(changeObj.removed)) {
          sharedStringHelper.insertText(getStringText(changeObj.text), from);
        } else {
          // Move the to pointer to the original position before deletion.
          sharedStringHelper.removeText(
            from,
            to + getStringText(changeObj.removed).length
          );
        }
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
        mode: "python",
        autoCloseBrackets: true,
        matchBrackets: true,
        autoCloseTags: true,
        matchTags: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      }
    );
    editorComponent.on("change", handleChange);
    editorComponent.setValue(sharedStringHelper.getText());
    editorComponent.setSize("100%", "100%");
    editorRef.current = editorComponent;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    editorRef.current.setOption(
      "theme",
      theme.palette.mode === "light" ? "eclipse" : "darcula"
    );
  }, [theme]);

  useEffect(() => {
    const db = getDatabase(app);
    const modeRef = ref(db, `sessions${window.location.pathname}/mode`);
    onValue(modeRef, (snapshot) => {
      editorRef.current.setOption("mode", snapshot.val() || "python");
    });

    return () => off(modeRef);
  }, [app]);

  const handleChange = (instance, changeObj) => {
    if (changeObj.origin === "setValue") return;

    const newText = instance.getValue();
    setFileContent({ content: newText, refresh: false });

    updateSharedString(instance, changeObj);
  };

  useEffect(() => {
    if (fileContent.refresh && loggedIn()) {
      const text = sharedStringHelper.getText();
      editorRef.current.setValue(fileContent.content);
      if (!!fileContent.content) {
        sharedStringHelper.replaceText(fileContent.content, 0, text.length);
      } else if (text.length === 0) {
        return;
      } else {
        sharedStringHelper.removeText(0, text.length);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileContent]);

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

      setFileContent({ content: newText, refresh: false });
    };

    sharedStringHelper.on("textChanged", handleTextChanged);
    return () => {
      sharedStringHelper.off("textChanged", handleTextChanged);
    };
  }, [sharedStringHelper, setFileContent]);

  useEffect(() => {
    if (!!user.id && !loggedIn()) {
      const db = getDatabase(app);
      const membersRef = ref(
        db,
        `participants${window.location.pathname}/${user.id}/write`
      );
      onValue(membersRef, (snapshot) => {
        const data = snapshot.val();
        editorRef.current.setOption("readOnly", data ? false : "nocursor");
      });
    }
  }, [app, user.id]);
  return (
    <div>
      <textarea id="code" />
    </div>
  );
};

export default Editor;
