import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const QuillEditor = ({ onChange, content, toolbarOptions }) => {
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        if (!editorRef.current) return;

        quillRef.current = new Quill(editorRef.current, {
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions,
                clipboard: { matchVisual: false },
            },
        });

        if (content) {
            quillRef.current.root.innerHTML = content;
        }

        const handleChange = () => {
            const editorContent = quillRef.current.root.innerHTML;
            onChange?.(editorContent);
        };

        quillRef.current.on('text-change', handleChange);

        quillRef.current.clipboard.addMatcher(Node.ELEMENT_NODE, (delta) => {
            delta.ops.forEach(op => {
                if (op.attributes) {
                    delete op.attributes.color;
                    delete op.attributes.background;
                }
            });
            return delta;
        });

        const editorElement = quillRef.current.root;
        editorElement.style.color = 'white';

        return () => {
            quillRef.current.off('text-change', handleChange);
        };
    }, []);

    useEffect(() => {
        if (quillRef.current && content !== undefined) {
            const currentContent = quillRef.current.root.innerHTML;
            if (content !== currentContent) {
                quillRef.current.root.innerHTML = content;
            }
        }
    }, [content]);

    return (
        <div>
            <div ref={editorRef} style={{ border: '1px solid #ccc' }}></div>
        </div>
    );
};

export default QuillEditor;
