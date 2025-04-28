import React from "react";
import { motion } from 'framer-motion';

interface ErrorCardProps {
        title: string;
        error: string;
        userCode?: string;
        solution: string;
        solutionCode?: string;
}


export const ErrorCard: React.FC<ErrorCardProps> = ({ title, error, userCode, solution, solutionCode }) => {
    return (
        <motion.div className="error-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="error-header">
            <div className="error-header-left">
                <i className="fas fa-exclamation-circle error-icon"></i>
                <div className="error-title">
                    {title}
                </div>
            </div>
            <div className="error-severity high">High</div>
            </div>
            <div className="error-details">
            <div className="error-location"></div>
            <div className="error-description">
                <p>
                    {error}
                </p>
            </div>
            <div className="error-code">
                <pre>
                        <code>
                        {userCode}
                        </code>
                    </pre>
            </div>
            <div className="error-fix">
                <h4>{solution}</h4>
                <div className="error-fix-code">
                    <pre>
                        <code>
                            {solutionCode}
                        </code>
                        </pre>
                </div>
            </div>
            </div>
        </motion.div>
    );
}


interface ErrorPageProps {
    errorCards: ErrorCardProps[];
    numberOfErrors: number;
    resolvedErrors: number;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ errorCards, numberOfErrors, resolvedErrors }) => {
        return(
            <div className="errors-container">
            <div className="search-container">
                <i className="fas fa-search search-icon"></i>
                <input
                type="text"
                placeholder="Search errors..."
                className="search-input"
                />
            </div>

            <div className="error-filters">
                <button className="error-filter-btn active">All Errors</button>
                <button className="error-filter-btn">Active</button>
                <button className="error-filter-btn">Resolved</button>
                <button className="error-filter-btn">Syntax</button>
                <button className="error-filter-btn">Logic</button>
                <button className="error-filter-btn">Runtime</button>
            </div>

            <div className="error-summary">
                <div className="error-stat">
                <span className="error-number">{numberOfErrors}</span>
                <span className="error-label">Active Errors</span>
                </div>
                <div className="error-stat">
                <span className="error-number">{resolvedErrors}</span>
                <span className="error-label">Resolved Today</span>
                </div>
                <div className="error-stat">
                <span className="error-number">{(resolvedErrors/(numberOfErrors+resolvedErrors)).toFixed(2)}%</span>
                <span className="error-label">Resolution Rate</span>
                </div>
            </div>

            <div className="error-list">
                {errorCards.map((error, index) => (
                    <ErrorCard
                        key={index}
                        title={error.title}
                        error={error.error}
                        userCode={error.userCode}
                        solution={error.solution}
                        solutionCode={error.solutionCode} 
                        />
                ))}
            </div>
            </div>
);}