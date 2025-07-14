import React from 'react';
import { Input } from 'antd';
import ReactMarkdown from 'react-markdown';

const { TextArea } = Input;

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value = '', onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };
  
  return (
    <div className="markdown-editor">
      <TextArea 
        value={value} 
        onChange={handleChange} 
        rows={6}
        placeholder="支持Markdown格式"
      />
      {value && (
        <div className="markdown-preview">
          <div className="preview-header">预览</div>
          <div className="preview-content">
            <ReactMarkdown>{value}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;