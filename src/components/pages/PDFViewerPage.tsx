import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, Download, X, FileText, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

// ── Types ────────────────────────────────────────
interface PDFFile {
    id: string;
    name: string;
    size: number;
    url: string;
    file: File;
    uploadedAt: Date;
}

// ── Helpers ──────────────────────────────────────
function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ── Nav bar (same style as AboutMePage) ──────────
const PDFNavInfo = () => (
    <div className="fixed top-0 left-0 w-full z-[100] p-6 md:p-10 flex justify-between items-center pointer-events-none">
        <Link to="/" className="pointer-events-auto flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full border border-red-600/40 flex items-center justify-center group-hover:border-red-500 transition-colors">
                <ArrowLeft size={14} className="text-red-500" />
            </div>
            <span className="font-mono text-[11px] tracking-[0.2em] text-white/40 uppercase group-hover:text-white/80 transition-colors">BACK HOME</span>
        </Link>
        <div className="flex flex-col items-end text-right">
            <span className="font-sans font-bold text-[10px] tracking-[0.2em] text-red-500 uppercase">PDF VAULT</span>
            <span className="font-mono text-[9px] text-white/30 tracking-widest uppercase">Document Manager</span>
        </div>
    </div>
);

// ── Drop Zone ────────────────────────────────────
const DropZone = ({ onFiles }: { onFiles: (files: File[]) => void }) => {
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
        if (files.length) onFiles(files);
    }, [onFiles]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length) onFiles(files);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className="relative cursor-pointer group"
        >
            <input ref={inputRef} type="file" accept="application/pdf" multiple className="hidden" onChange={handleInput} />

            {/* Outer glow */}
            <motion.div
                animate={{ opacity: dragging ? 1 : 0 }}
                className="absolute -inset-1 rounded-3xl pointer-events-none"
                style={{ background: 'linear-gradient(135deg,#ff2800,#ff6b35)', filter: 'blur(16px)', opacity: 0.35 }}
            />

            <div
                className="relative rounded-3xl border-2 transition-all duration-500 flex flex-col items-center justify-center gap-6 py-20 px-8 text-center overflow-hidden"
                style={{
                    borderColor: dragging ? 'rgba(255,40,0,0.7)' : 'rgba(255,255,255,0.07)',
                    background: dragging ? 'rgba(255,40,0,0.04)' : 'rgba(5,5,5,0.85)',
                    backdropFilter: 'blur(32px)',
                }}
            >
                {/* Animated background grid */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,40,0,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,40,0,0.8) 1px,transparent 1px)`,
                        backgroundSize: '40px 40px',
                    }}
                />

                {/* Upload icon */}
                <motion.div
                    animate={{ y: dragging ? -8 : 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="relative"
                >
                    <div className="w-20 h-20 rounded-2xl border border-red-500/30 flex items-center justify-center"
                        style={{ background: 'rgba(255,40,0,0.08)' }}>
                        <Upload size={32} className="text-red-500" />
                    </div>
                    {dragging && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.4, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1.2 }}
                            className="absolute inset-0 rounded-2xl border border-red-500"
                        />
                    )}
                </motion.div>

                <div>
                    <p className="text-xl font-bold text-white tracking-tight mb-2">
                        {dragging ? 'Drop your PDFs here' : 'Drag & Drop PDFs'}
                    </p>
                    <p className="text-sm text-white/35 font-mono">or <span className="text-red-400 underline underline-offset-2">click to browse</span> · PDF only</p>
                </div>

                <div className="flex items-center gap-6 text-[10px] font-mono uppercase tracking-widest text-white/20">
                    <span>Multiple files supported</span>
                    <span className="w-1 h-1 rounded-full bg-red-500/40" />
                    <span>Instant preview</span>
                    <span className="w-1 h-1 rounded-full bg-red-500/40" />
                    <span>One-click download</span>
                </div>
            </div>
        </motion.div>
    );
};

// ── PDF Card ─────────────────────────────────────
const PDFCard = ({
    pdf,
    active,
    onSelect,
    onRemove,
}: {
    pdf: PDFFile;
    active: boolean;
    onSelect: () => void;
    onRemove: () => void;
}) => {
    const download = (e: React.MouseEvent) => {
        e.stopPropagation();
        const a = document.createElement('a');
        a.href = pdf.url;
        a.download = pdf.name;
        a.click();
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.35 }}
            onClick={onSelect}
            className="relative rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden group"
            style={{
                borderColor: active ? 'rgba(255,40,0,0.6)' : 'rgba(255,255,255,0.06)',
                background: active ? 'rgba(255,40,0,0.06)' : 'rgba(5,5,5,0.8)',
                boxShadow: active ? '0 0 20px rgba(255,40,0,0.15)' : 'none',
            }}
        >
            {active && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-500 rounded-full" />}

            <div className="p-4 flex items-center gap-3">
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: active ? 'rgba(255,40,0,0.15)' : 'rgba(255,255,255,0.04)' }}>
                    <FileText size={16} className={active ? 'text-red-400' : 'text-white/30'} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate leading-tight">{pdf.name}</p>
                    <p className="text-[10px] font-mono text-white/30 mt-0.5">{formatBytes(pdf.size)}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={download}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors"
                        title="Download"
                    >
                        <Download size={12} className="text-red-400" />
                    </button>
                    <button
                        onClick={e => { e.stopPropagation(); onRemove(); }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                        title="Remove"
                    >
                        <X size={12} className="text-white/40" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// ── PDF Viewer Panel ─────────────────────────────
const PDFViewer = ({ pdf }: { pdf: PDFFile }) => {
    const [zoom, setZoom] = useState(100);
    const [rotation, setRotation] = useState(0);

    const download = () => {
        const a = document.createElement('a');
        a.href = pdf.url;
        a.download = pdf.name;
        a.click();
    };

    return (
        <motion.div
            key={pdf.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col h-full rounded-2xl overflow-hidden border border-white/[0.06]"
            style={{ background: 'rgba(4,4,4,0.95)' }}
        >
            {/* Toolbar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05] shrink-0">
                {/* File name */}
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'rgba(255,40,0,0.15)' }}>
                        <FileText size={12} className="text-red-400" />
                    </div>
                    <span className="text-sm font-semibold text-white/80 truncate max-w-[200px]">{pdf.name}</span>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1">
                    <button onClick={() => setZoom(z => Math.max(50, z - 10))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all">
                        <ZoomOut size={14} />
                    </button>
                    <span className="text-[11px] font-mono text-white/30 w-12 text-center">{zoom}%</span>
                    <button onClick={() => setZoom(z => Math.min(200, z + 10))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all">
                        <ZoomIn size={14} />
                    </button>
                    <div className="w-px h-5 bg-white/10 mx-1" />
                    <button onClick={() => setRotation(r => (r + 90) % 360)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all">
                        <RotateCw size={14} />
                    </button>
                    <div className="w-px h-5 bg-white/10 mx-1" />
                    <button onClick={download}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold text-white transition-all"
                        style={{ background: 'linear-gradient(135deg,#ff2800,#ff5533)', boxShadow: '0 0 16px rgba(255,40,0,0.35)' }}>
                        <Download size={12} />
                        Download
                    </button>
                </div>
            </div>

            {/* PDF iframe embed */}
            <div className="flex-1 relative overflow-hidden bg-[#111]">
                <div
                    className="w-full h-full transition-transform duration-300 origin-center"
                    style={{ transform: `scale(${zoom / 100}) rotate(${rotation}deg)` }}
                >
                    <iframe
                        src={`${pdf.url}#toolbar=0&navpanes=0&scrollbar=1`}
                        className="w-full h-full border-none"
                        title={pdf.name}
                    />
                </div>

                {/* Scan-line overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(transparent 50%,rgba(0,0,0,0.5) 50%)',
                        backgroundSize: '100% 3px',
                    }}
                />
            </div>

            {/* Size/name footer */}
            <div className="flex items-center justify-between px-5 py-2 border-t border-white/[0.04] shrink-0"
                style={{ background: 'rgba(255,40,0,0.04)' }}>
                <span className="text-[10px] font-mono text-red-400/60 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Live Preview
                </span>
                <span className="text-[10px] font-mono text-white/25">{formatBytes(pdf.size)}</span>
            </div>
        </motion.div>
    );
};

// ── Empty State ───────────────────────────────────
const EmptyViewer = () => (
    <div className="flex flex-col items-center justify-center h-full gap-6 rounded-2xl border border-white/[0.04]"
        style={{ background: 'rgba(5,5,5,0.6)', backdropFilter: 'blur(20px)', minHeight: '500px' }}>
        <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            <FileText size={28} className="text-white/15" />
        </div>
        <div className="text-center">
            <p className="text-white/20 font-semibold text-sm mb-1">No document selected</p>
            <p className="text-white/10 text-xs font-mono">Upload a PDF or select one from the list</p>
        </div>
    </div>
);

// ── Main Page ─────────────────────────────────────
export default function PDFViewerPage() {
    const [pdfs, setPdfs] = useState<PDFFile[]>([]);
    const [activePdfId, setActivePdfId] = useState<string | null>(null);

    const activePdf = pdfs.find(p => p.id === activePdfId) ?? null;

    const handleFiles = (files: File[]) => {
        const newPdfs: PDFFile[] = files.map(file => ({
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            name: file.name,
            size: file.size,
            url: URL.createObjectURL(file),
            file,
            uploadedAt: new Date(),
        }));
        setPdfs(prev => {
            const updated = [...prev, ...newPdfs];
            setActivePdfId(newPdfs[newPdfs.length - 1].id);
            return updated;
        });
    };

    const removePdf = (id: string) => {
        setPdfs(prev => {
            const updated = prev.filter(p => p.id !== id);
            if (activePdfId === id) {
                setActivePdfId(updated.length > 0 ? updated[updated.length - 1].id : null);
            }
            URL.revokeObjectURL(prev.find(p => p.id === id)?.url ?? '');
            return updated;
        });
    };

    const downloadAll = () => {
        pdfs.forEach((pdf, i) => {
            setTimeout(() => {
                const a = document.createElement('a');
                a.href = pdf.url;
                a.download = pdf.name;
                a.click();
            }, i * 300);
        });
    };

    return (
        <div className="min-h-screen bg-[#080808] text-white relative overflow-x-hidden selection:bg-red-600 selection:text-white">
            <PDFNavInfo />

            {/* Background ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-red-600/5 blur-[160px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full bg-red-900/5 blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,40,0,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,40,0,0.5) 1px,transparent 1px)`,
                        backgroundSize: '80px 80px',
                    }}
                />
            </div>

            <main className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-10 pt-32 pb-20">

                {/* ── Hero Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-14"
                >
                    <div className="flex items-start justify-between flex-wrap gap-6">
                        <div>
                            <p className="text-[10px] font-mono tracking-[0.3em] text-red-500 uppercase mb-4">Document System · v1.0</p>
                            <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tighter leading-[0.85] uppercase">
                                PDF{' '}
                                <span
                                    className="text-transparent"
                                    style={{ WebkitTextStroke: '2px rgba(255,40,0,0.8)' }}
                                >
                                    VAULT
                                </span>
                            </h1>
                            <p className="mt-5 text-base text-white/35 font-mono max-w-md">
                                Upload, preview, and download your PDFs. All files are kept locally in your browser — never uploaded to a server.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-4 mt-2">
                            {[
                                { label: 'Files', value: pdfs.length },
                                { label: 'Total Size', value: pdfs.length ? formatBytes(pdfs.reduce((s, p) => s + p.size, 0)) : '0 B' },
                            ].map(stat => (
                                <div key={stat.label} className="rounded-2xl border border-white/[0.06] px-6 py-4 text-right"
                                    style={{ background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(20px)' }}>
                                    <p className="text-2xl md:text-3xl font-black text-white">{stat.value}</p>
                                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mt-10 h-px w-full" style={{ background: 'linear-gradient(90deg,rgba(255,40,0,0.4),rgba(255,255,255,0.05),transparent)' }} />
                </motion.div>

                {/* ── Drop Zone ── */}
                <div className="mb-8">
                    <DropZone onFiles={handleFiles} />
                </div>

                {/* ── Files + Viewer ── */}
                {pdfs.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6"
                    >
                        {/* Left: file list */}
                        <div className="flex flex-col gap-3">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
                                    {pdfs.length} document{pdfs.length !== 1 ? 's' : ''}
                                </span>
                                {pdfs.length > 1 && (
                                    <button
                                        onClick={downloadAll}
                                        className="flex items-center gap-1.5 text-[11px] font-mono text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        <Download size={10} />
                                        Download all
                                    </button>
                                )}
                            </div>

                            <AnimatePresence mode="popLayout">
                                {pdfs.map(pdf => (
                                    <PDFCard
                                        key={pdf.id}
                                        pdf={pdf}
                                        active={activePdfId === pdf.id}
                                        onSelect={() => setActivePdfId(pdf.id)}
                                        onRemove={() => removePdf(pdf.id)}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Right: viewer */}
                        <div style={{ minHeight: '600px' }}>
                            <AnimatePresence mode="wait">
                                {activePdf ? (
                                    <PDFViewer key={activePdf.id} pdf={activePdf} />
                                ) : (
                                    <EmptyViewer key="empty" />
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}

                {/* ── Privacy note ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-12 flex items-center justify-center gap-2"
                >
                    <div className="w-1 h-1 rounded-full bg-red-500/40" />
                    <p className="text-[11px] font-mono text-white/20 tracking-widest uppercase">
                        Files are processed entirely in your browser · Zero server uploads · Zero data retention
                    </p>
                    <div className="w-1 h-1 rounded-full bg-red-500/40" />
                </motion.div>
            </main>
        </div>
    );
}
