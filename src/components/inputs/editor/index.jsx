import CodeMirror from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { autocompletion } from '@codemirror/autocomplete'
import { useRepo } from '../../../contexts/repoContext'

const Editor = () => {
    const { setContent } = useRepo()
    return (
        <CodeMirror
            height="70vh"
            extensions={[python(), autocompletion()]}
            onChange={(value, viewUpdate) => setContent(value)}
            theme='dark'
        />
    )
}
export default Editor