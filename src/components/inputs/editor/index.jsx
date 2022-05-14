import CodeMirror from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { autocompletion } from '@codemirror/autocomplete'
import { useRepo } from '../../../contexts/repoContext'
import { useEffect, useRef, useState } from 'react'

const Editor = (props) => {
    const sharedStringHelper = props.sharedStringHelper;
    const { setContent } = useRepo()
    const textareaRef = useRef(null);
    const selectionStartRef = useRef(0);
    const selectionEndRef = useRef(0);

    const [text, setText] = useState(sharedStringHelper.getText());

    /**
     * There's been a local change to the textarea content (e.g. user did some typing)
     * This means the most-recent state (text and selection) is in the textarea, and we need to
     * 1. Store the text and selection state in React
     * 2. Store the text state in the SharedString
     */
    const handleChange = (value) => {
        // First get and stash the new textarea state
        if (!textareaRef.current) {
            throw new Error("Handling change without current textarea ref?");
        }
        const textareaElement = textareaRef.current;
        const newText = textareaElement.value;
        // After a change to the textarea content we assume the selection is gone (just a caret)
        // This is a bad assumption (e.g. performing undo will select the re-added content).
        const newCaretPosition = textareaElement.selectionStart;
        
        // Next get and stash the old React state
        const oldText = text;
        const oldSelectionStart = selectionStartRef.current;
        const oldSelectionEnd = selectionEndRef.current;
        
        // Next update the React state with the values from the textarea
        storeSelectionInReact();
        setText(newText);
        setContent(newText);
        
        console.log(textareaElement, newText, newCaretPosition, oldText, oldSelectionStart, oldSelectionEnd)
        // Finally update the SharedString with the values after deducing what type of change it was.
        // If the caret moves to the right of the prior left bound of the selection, we assume an insert occurred
        // This is also a bad assumption, in the undo case.
        const isTextInserted = newCaretPosition - oldSelectionStart > 0;
        if (isTextInserted) {
        const insertedText = newText.substring(oldSelectionStart, newCaretPosition);
        const isTextReplaced = oldSelectionEnd - oldSelectionStart > 0;
        if (!isTextReplaced) {
            sharedStringHelper.insertText(insertedText, oldSelectionStart);
        } else {
            sharedStringHelper.replaceText(insertedText, oldSelectionStart, oldSelectionEnd);
        }
        } else {
            // Text was removed
            const charactersDeleted = oldText.length - newText.length;
            sharedStringHelper.removeText(newCaretPosition, newCaretPosition + charactersDeleted);
        }
    };
    /**
     * Take the current selection from the DOM textarea and store it in our React ref.
     */
    const storeSelectionInReact = () => {
        console.log('storeSelectionInReact')
        if (!textareaRef.current) {
        throw new Error("Trying to remember selection without current textarea ref?");
        }
        const textareaElement = textareaRef.current;

        const textareaSelectionStart = textareaElement.selectionStart;
        const textareaSelectionEnd = textareaElement.selectionEnd;
        selectionStartRef.current = textareaSelectionStart;
        selectionEndRef.current = textareaSelectionEnd;
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
            setText(newText);
            setContent(newText);
        };

        sharedStringHelper.on("textChanged", handleTextChanged);
        return () => {
        sharedStringHelper.off("textChanged", handleTextChanged);
        };
    }, [sharedStringHelper, setContent]);

    return (
        //<CodeMirror
        <textarea
            rows={20}
            cols={50}
            height="70vh"
            extensions={[python(), autocompletion()]}
            onChange={handleChange}
            theme='dark'
            value={text}
            ref={textareaRef}
            onBeforeInput={storeSelectionInReact}
            onKeyDown={storeSelectionInReact}
            onClick={storeSelectionInReact}
            onContextMenu={storeSelectionInReact}
        />
    )
}
export default Editor