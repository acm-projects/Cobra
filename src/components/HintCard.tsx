import React, { useState, Dispatch, SetStateAction } from 'react';
import { motion } from 'framer-motion';

interface HintCardProps {
    title: any;
    hint: string;
    description?: string;
    type: "conceptual" | "code";
    };

const HintLine = ({ line, index }: { line: string; index: number }) => {
    return (
        <span key={index} className="line">
            {line}
        </span>
    );
}

const HintCard: React.FC<HintCardProps> = ({ title, hint, type, description }) => {

    if(type === "conceptual"){
        const hints = hint.split("\n");
        const hintCards = hints.map((hint, index) => {
            return <HintLine line={hint} index={index} />;
        });
        console.log(hints);
        
        return (
        <motion.div
                        className="hint-card hint-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        whileHover={{
                        y: -5,
                        boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                        borderColor: "rgba(139, 92, 246, 0.5)",
                        }}
                    >
                        <div className="hint-icon">
                        <i className="fas fa-code"></i>
                        </div>
                        <div className="hint-badge">Basic</div>
                        <h3>Three Conceptual Hints</h3>
                        <div className="hint-content">
                        <p>
                            Get an idea of how to approach the problem.
                            All concepts. No code.
                        </p>
                        <div className="hint-code-snippet blurred">
                            <pre>
                            <code>
                                {hintCards}
                            </code>
                            </pre>
                            <div className="code-reveal-controls">
                            <button
                                className="code-reveal-btn"
                                onClick={(e) => {
                                const codeSnippet =
                                    e.currentTarget.closest(".hint-code-snippet");
                                if (codeSnippet) {
                                    const codeLines =
                                    codeSnippet.querySelectorAll(
                                        "code > span.line"
                                    );
                                    const visibleLines =
                                    codeSnippet.querySelectorAll(
                                        "code > span.line.visible"
                                    );

                                    // If no lines are visible yet or we've revealed all lines, start over
                                    if (
                                    visibleLines.length === 0 
                                    ) {                                        
                                        // Hide all lines first by removing the visible class
                                        codeLines.forEach((line) =>
                                            line.classList.remove("visible")
                                        );

                                        // Show only the first two lines
                                        if (codeLines.length > 0)
                                            codeLines[0].classList.add("visible");
                                        if (codeLines.length > 1)
                                            codeLines[1].classList.add("visible");

                                        // Remove the blur when we start revealing
                                        codeSnippet.classList.remove("blurred");
                                        e.currentTarget.innerHTML =
                                            '<i class="fas fa-arrow-down"></i> Reveal Next';
                                    } else if (visibleLines.length === codeLines.length) {
                                        codeSnippet.classList.add("blurred");
                                        codeLines.forEach((line) =>
                                            line.classList.remove("visible")
                                        );
                                        e.currentTarget.innerHTML =
                                        '<i class="fas fa-arrow-down"></i> Reveal Hints';
                                    } else {
                                    // Reveal next two lines
                                    const nextLineIndex = visibleLines.length;
                                    if (nextLineIndex < codeLines.length)
                                        codeLines[nextLineIndex].classList.add(
                                        "visible"
                                        );
                                    if (nextLineIndex + 1 < codeLines.length)
                                        codeLines[nextLineIndex + 1].classList.add(
                                        "visible"
                                        );

                                    // If we've revealed all lines, update button text
                                    if (
                                        visibleLines.length + 2 >=
                                        codeLines.length
                                    ) {
                                        e.currentTarget.innerHTML =
                                        '<i class="fas fa-redo"></i> Reset';
                                    }
                                    }
                                }
                                }}
                            >
                                <i className="fas fa-eye"></i> Reveal Step-by-Step
                            </button>
                            </div>
                        </div>
                        </div>
                    </motion.div>
    );} else {
        const hints = hint.split("\n");
        const hintCards = hints.map((hint, index) => {
            return <HintLine line={hint} index={index} />;
        });
        console.log(hints);
        return (
        <motion.div
            className="hint-card hint-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{
            y: -5,
            boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            borderColor: "rgba(139, 92, 246, 0.5)",
            }}
        >
            <div className="hint-icon">
            <i className="fas fa-code"></i>
            </div>
            <div className="hint-badge">Basic</div>
            <h3>{title}</h3>
            <div className="hint-content">
            <p>
                {description}
            </p>
            <div className="hint-code-snippet blurred">
                <pre>
                <code>
                    {hintCards}
                </code>
                </pre>
                <div className="code-reveal-controls">
                <button
                    className="code-reveal-btn"
                    onClick={(e) => {
                    const codeSnippet =
                        e.currentTarget.closest(".hint-code-snippet");
                    if (codeSnippet) {
                        const codeLines =
                        codeSnippet.querySelectorAll(
                            "code > span.line"
                        );
                        const visibleLines =
                        codeSnippet.querySelectorAll(
                            "code > span.line.visible"
                        );

                        // If no lines are visible yet or we've revealed all lines, start over
                        if (
                        visibleLines.length === 0 
                        ) {                                        
                            // Hide all lines first by removing the visible class
                            codeLines.forEach((line) =>
                                line.classList.remove("visible")
                            );

                            // Show only the first two lines
                            if (codeLines.length > 0)
                                codeLines[0].classList.add("visible");
                            if (codeLines.length > 1)
                                codeLines[1].classList.add("visible");

                            // Remove the blur when we start revealing
                            codeSnippet.classList.remove("blurred");
                            e.currentTarget.innerHTML =
                                '<i class="fas fa-arrow-down"></i> Reveal Next';
                        } else if (visibleLines.length === codeLines.length) {
                            codeSnippet.classList.add("blurred");
                            codeLines.forEach((line) =>
                                line.classList.remove("visible")
                            );
                            e.currentTarget.innerHTML =
                            '<i class="fas fa-arrow-down"></i> Reveal Hints';
                        } else {
                        // Reveal next two lines
                        const nextLineIndex = visibleLines.length;
                        if (nextLineIndex < codeLines.length)
                            codeLines[nextLineIndex].classList.add(
                            "visible"
                            );
                        if (nextLineIndex + 1 < codeLines.length)
                            codeLines[nextLineIndex + 1].classList.add(
                            "visible"
                            );

                        // If we've revealed all lines, update button text
                        if (
                            visibleLines.length + 2 >=
                            codeLines.length
                        ) {
                            e.currentTarget.innerHTML =
                            '<i class="fas fa-redo"></i> Reset';
                        }
                        }
                    }
                    }}
                >
                    <i className="fas fa-eye"></i> Reveal Step-by-Step
                </button>
                </div>
            </div>
            </div>
        </motion.div>
        );
    }
}

export default HintCard;