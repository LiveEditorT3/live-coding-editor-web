import { useRepoContext } from "../../../contexts/repoContext";
import { useEffect, useRef } from "react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/python/python";
import "codemirror/theme/eclipse.css";
import "codemirror/theme/colorforth.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/clike/clike";
import "codemirror/mode/go/go";
import "codemirror/keymap/sublime";
import { useFluidContext } from "../../../contexts/fluidContext";
import { useFirebaseContext } from "../../../contexts/firebaseContext";
import { getDatabase, onValue, ref } from "firebase/database";
import useUser from "../../../hooks/user/useUser";
import { loggedIn } from "../../../hooks/login";
import { useTheme } from "@mui/styles";

const Editor = ({ sharedStringHelper }) => {
  const theme = useTheme();
  const { mode, fileContent, setContent } = useRepoContext();
  const { app } = useFirebaseContext();
  const { sharedMap } = useFluidContext();
  const { id } = useUser();

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
      }
    );
    editorComponent.on("change", handleChange);
    editorComponent.setValue(sharedStringHelper.getText());
    editorComponent.setSize("100%", "100%");
    editorRef.current = editorComponent;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    editorRef.current.setOption("mode", mode);
  }, [mode]);

  useEffect(() => {
    editorRef.current.setOption(
      "theme",
      theme.palette.mode === "light" ? "eclipse" : "colorforth"
    );
  }, [theme]);

  useEffect(() => {
    if (sharedMap !== undefined) {
      const syncView = () =>
        editorRef.current.setOption("mode", sharedMap.get("mode") || "python");

      syncView();
      sharedMap.on("valueChanged", syncView);
      // turn off listener when component is unmounted
      return () => {
        sharedMap.off("valueChanged", syncView);
      };
    }
  }, [sharedMap]);

  const handleChange = (instance, changeObj) => {
    if (changeObj.origin === "setValue") return;

    const newText = instance.getValue();
    setContent(newText);

    updateSharedString(instance, changeObj);
  };

  useEffect(() => {
    if (fileContent.refresh) {
      const text = sharedStringHelper.getText();
      editorRef.current.setValue(fileContent.content);
      if (!!fileContent.content)
        sharedStringHelper.replaceText(fileContent.content, 0, text.length);
      else sharedStringHelper.removeText(0, text.length);
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

      setContent(newText);
    };

    sharedStringHelper.on("textChanged", handleTextChanged);
    return () => {
      sharedStringHelper.off("textChanged", handleTextChanged);
    };
  }, [sharedStringHelper, setContent]);

  useEffect(() => {
    if (!!id && !loggedIn()) {
      const db = getDatabase(app);
      const membersRef = ref(
        db,
        `sessions${window.location.pathname}/${id}/write`
      );
      onValue(membersRef, (snapshot) => {
        const data = snapshot.val();
        editorRef.current.setOption("readOnly", data ? false : "nocursor");
      });
    }
  }, [app, id]);
  return (
    <div>
      <textarea id="code" />
    </div>
  );
};

export default Editor;
