"use client";

import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Download, Mail, Phone, Linkedin, Globe, MapPin } from "lucide-react";

export interface CVData {
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        linkedin?: string;
        portfolio?: string;
    };
    professionalSummary: string;
    workExperience: {
        role: string;
        company: string;
        period: string;
        achievements: string[];
    }[];
    education: {
        degree: string;
        school: string;
        year: string;
    }[];
    skills: string[];
}

interface CVPreviewProps {
    data: CVData;
    showPhoto?: boolean;
}

export function CVPreview({ data, showPhoto = false }: CVPreviewProps) {
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `${data.personalInfo.fullName.replace(/\s+/g, "_")}_CV`,
    });

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end">
                <button
                    onClick={() => handlePrint()}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition"
                >
                    <Download size={16} />
                    Download PDF
                </button>
            </div>

            <div className="overflow-auto border border-gray-200 rounded-lg shadow-lg bg-gray-50 p-8">
                <div
                    ref={componentRef}
                    className="bg-white mx-auto text-slate-800"
                    style={{
                        width: "210mm",
                        minHeight: "297mm",
                        padding: "15mm",
                        boxSizing: "border-box",
                        fontFamily: "Inter, sans-serif",
                    }}
                >
                    {/* Header Section */}
                    <div className="flex flex-col border-b-2 border-slate-800 pb-6 mb-6">
                        <h1 className="text-4xl font-bold uppercase tracking-wide text-slate-900 mb-2">
                            {data.personalInfo.fullName}
                        </h1>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-600 mt-2">
                            <div className="flex items-center gap-1">
                                <Mail size={14} />
                                <span>{data.personalInfo.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Phone size={14} />
                                <span>{data.personalInfo.phone}</span>
                            </div>
                            {data.personalInfo.linkedin && (
                                <div className="flex items-center gap-1">
                                    <Linkedin size={14} />
                                    <span>{data.personalInfo.linkedin}</span>
                                </div>
                            )}
                            {data.personalInfo.portfolio && (
                                <div className="flex items-center gap-1">
                                    <Globe size={14} />
                                    <span>{data.personalInfo.portfolio}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-8">
                        {/* Left Column (Skills & Education) */}
                        <div className="col-span-4 flex flex-col gap-6">

                            {/* Education */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-gray-200 pb-1">
                                    Education
                                </h3>
                                <div className="flex flex-col gap-4">
                                    {data.education.map((edu, idx) => (
                                        <div key={idx}>
                                            <h4 className="font-bold text-slate-800">{edu.school}</h4>
                                            <p className="text-sm text-slate-600">{edu.degree}</p>
                                            <p className="text-xs text-slate-500 italic">{edu.year}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Skills */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-gray-200 pb-1">
                                    Expertise
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {data.skills.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-block px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right Column (Summary & Experience) */}
                        <div className="col-span-8 flex flex-col gap-8">
                            {/* Summary */}
                            <section>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">Professional Summary</h3>
                                <p className="text-sm text-slate-600 leading-relaxed text-justify">
                                    {data.professionalSummary}
                                </p>
                            </section>

                            {/* Work Experience */}
                            <section>
                                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b-2 border-slate-100 pb-2">
                                    Work Experience
                                </h3>
                                <div className="flex flex-col gap-6">
                                    {data.workExperience.map((exp, idx) => (
                                        <div key={idx}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h4 className="font-bold text-slate-800 text-base">{exp.role}</h4>
                                                <span className="text-sm font-semibold text-slate-500">{exp.period}</span>
                                            </div>
                                            <div className="text-sm font-medium text-slate-700 mb-2">{exp.company}</div>
                                            <ul className="list-disc list-outside ml-4 flex flex-col gap-1">
                                                {exp.achievements.map((achievement, aIdx) => (
                                                    <li key={aIdx} className="text-sm text-slate-600 leading-snug">
                                                        {achievement}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
