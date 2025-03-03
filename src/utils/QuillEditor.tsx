import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const QuillEditor = ({ onChange, content }) => {
    const editorRef = useRef(null);
    const quillInstance = useRef(null);

    useEffect(() => {
        if (editorRef.current && !quillInstance.current) {
            quillInstance.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                    ],
                },
            });

            if (content) {
                quillInstance.current.root.innerHTML = content;
            }

            quillInstance.current.on('text-change', () => {
                if (quillInstance.current) {
                    const content =  quillInstance.current.root.innerHTML;
                    if (onChange) {
                        onChange(content);
                    }
                }
            });

        }
        return () => {
            if (quillInstance.current) {
                quillInstance.current.off('text-change');
            }
        };
    }, [onChange, content]);

    useEffect(() => {
        if (quillInstance.current && content !== quillInstance.current.root.innerHTML) {
            quillInstance.current.root.innerHTML = content || "";
        }
    }, [content]);

    return (
        <div >
            <div ref={editorRef}></div>
        </div>
    );
};

export default QuillEditor;
