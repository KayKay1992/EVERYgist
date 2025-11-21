import React from "react";
import { LuCopy, LuCheck, LuCode, LuQuote } from "react-icons/lu";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";

const MarkdownContent = ({ content }) => {
  if (!content) return <p>No content available.</p>;
  return (
    <article className="max-w-none">
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          children={content}
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";
              const isInline = !className;

              return !isInline ? (
                <CodeBlock
                  code={String(children).replace(/\n$/, "")}
                  language={language}
                />
              ) : (
                <code
                  className="px-2 py-1 rounded-md text-sm bg-linear-to-r from-purple-50 to-pink-50 text-purple-700 font-mono border border-purple-200"
                  {...props}
                >
                  {children}
                </code>
              );
            },

            p({ children }) {
              return (
                <p className="mb-6 leading-relaxed text-[17px] text-gray-700 tracking-wide">
                  {children}
                </p>
              );
            },

            strong({ children }) {
              return (
                <strong className="font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {children}
                </strong>
              );
            },

            em({ children }) {
              return (
                <em className="italic text-purple-700 font-medium">
                  {children}
                </em>
              );
            },

            ul({ children }) {
              return <ul className="space-y-3 mb-8 ml-6">{children}</ul>;
            },

            ol({ children }) {
              return (
                <ol className="space-y-3 mb-8 ml-6 list-decimal">{children}</ol>
              );
            },

            li({ children }) {
              return (
                <li className="text-gray-700 leading-relaxed pl-2 relative before:content-[''] before:absolute before:-left-5 before:top-3 before:w-2 before:h-2 before:bg-linear-to-r before:from-purple-500 before:to-pink-500 before:rounded-full">
                  {children}
                </li>
              );
            },

            blockquote({ children }) {
              return (
                <div className="relative my-8 pl-6 pr-6 py-1">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-purple-500 via-pink-500 to-rose-500 rounded-full"></div>
                  <LuQuote
                    className="absolute -left-1 -top-3 text-purple-400 opacity-20"
                    size={40}
                  />
                  <blockquote className="italic text-gray-600 text-lg font-serif leading-relaxed">
                    {children}
                  </blockquote>
                </div>
              );
            },

            h1({ children }) {
              return (
                <h1 className="text-4xl font-extrabold mt-12 mb-6 bg-linear-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent leading-tight">
                  {children}
                </h1>
              );
            },

            h2({ children }) {
              return (
                <div className="mt-12 mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {children}
                  </h2>
                  <div className="w-20 h-1 bg-linear-to-r from-purple-500 to-pink-500 rounded-full"></div>
                </div>
              );
            },

            h3({ children }) {
              return (
                <h3 className="text-2xl font-bold mt-10 mb-4 text-gray-900 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-linear-to-b from-purple-500 to-pink-500 rounded-full"></span>
                  {children}
                </h3>
              );
            },

            h4({ children }) {
              return (
                <h4 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
                  {children}
                </h4>
              );
            },

            a({ href, children }) {
              return (
                <a
                  href={href}
                  className="text-purple-600 hover:text-pink-600 underline decoration-purple-300 hover:decoration-pink-400 decoration-2 underline-offset-4 transition-all duration-200 font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              );
            },

            table({ children }) {
              return (
                <div className="my-8 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full table-auto border-collapse">
                    {children}
                  </table>
                </div>
              );
            },
            thead({ children }) {
              return (
                <thead className="bg-linear-to-r from-purple-50 to-pink-50">
                  {children}
                </thead>
              );
            },
            tbody({ children }) {
              return <tbody className="bg-white">{children}</tbody>;
            },
            tr({ children }) {
              return (
                <tr className="border-b border-gray-100 hover:bg-purple-50/30 transition-colors">
                  {children}
                </tr>
              );
            },
            th({ children }) {
              return (
                <th className="text-left px-6 py-4 font-bold text-gray-900 text-sm uppercase tracking-wider">
                  {children}
                </th>
              );
            },
            td({ children }) {
              return <td className="px-6 py-4 text-gray-700">{children}</td>;
            },
            hr() {
              return (
                <div className="my-12 flex items-center justify-center">
                  <div className="grow h-px bg-linear-to-r from-transparent via-purple-300 to-transparent"></div>
                  <div className="mx-4 flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                  </div>
                  <div className="grow h-px bg-linear-to-r from-transparent via-pink-300 to-transparent"></div>
                </div>
              );
            },
            img({ src, alt }) {
              return (
                <div className="my-8 rounded-xl overflow-hidden shadow-lg border border-gray-200">
                  <img src={src} alt={alt} className="w-full h-auto" />
                </div>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </article>
  );
};

export default MarkdownContent;

//   const CodeBlock

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-8 rounded-xl overflow-hidden border border-gray-800 shadow-2xl group">
      {/* Header with gradient */}
      <div className="flex items-center justify-between px-5 py-3 bg-linear-to-r from-gray-800 via-gray-850 to-gray-900 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"></span>
            <span className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></span>
          </div>
          {language && (
            <>
              <div className="w-px h-4 bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <LuCode size={14} className="text-purple-400" />
                <span className="text-gray-300 text-xs font-semibold uppercase tracking-wider">
                  {language}
                </span>
              </div>
            </>
          )}
        </div>

        <button
          onClick={copyCode}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-700 focus:outline-none transition-all duration-200 border border-gray-600 hover:border-gray-500"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <LuCheck size={14} className="text-green-400" />
              <span className="text-xs font-medium text-green-400">
                Copied!
              </span>
            </>
          ) : (
            <>
              <LuCopy size={14} />
              <span className="text-xs font-medium">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content with subtle gradient background */}
      <div className="relative bg-linear-to-br from-gray-900 via-gray-900 to-gray-950">
        <pre className="p-5 overflow-x-auto">
          <code className="text-[15px] leading-relaxed text-gray-100 font-mono">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
