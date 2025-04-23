import React, { useState, Dispatch, SetStateAction } from 'react';
import { motion } from 'framer-motion';

interface ResourceCardProps {
    title: any;
    link: string;
    description: string;
    difficulty: string;
    type: "Article" | "Video";
    };

const ResourceCard: React.FC<ResourceCardProps> = ({ title, link, description, difficulty, type }) => {
        
    return(
            <motion.div
                className="resource-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{
                    y: -5,
                    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                    borderColor: "rgba(139, 92, 246, 0.5)",
                }}
                >
                <div className="resource-icon">
                    <i className="fas fa-file-alt"></i>
                </div>
                <div className="resource-badge">Guide</div>
                <h3>{title}</h3>
                <p>
                    {description}
                </p>
                <div className="resource-meta">
                    <div className="resource-type">
                    <i className="fas fa-book"></i> {type}
                    </div>
                    <div className="resource-level">
                    <i className="fas fa-chart-line"></i> {difficulty}
                    </div>
                </div>
                <motion.button
                    className="resource-action"
                    whileHover={{
                    backgroundColor: "rgba(139, 92, 246, 0.2)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {window.open(link, "_blank");}}
                >
                    <i className="fas fa-external-link-alt"></i> View Resource
                </motion.button>
                </motion.div>
);}

export default ResourceCard;