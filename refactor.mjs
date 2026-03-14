import fs from 'fs';

let code = fs.readFileSync('src/components/pages/AboutMePage.tsx', 'utf-8');
const lines = code.split('\n');
// Extract the lines from index 100 to 303 (lines 101 to 304)
const contentLines = lines.slice(100, 304);
const contentStr = contentLines.join('\n');

const topPart = lines.slice(0, 100).join('\n');

let newCode = topPart + `
            <div className="w-full flex flex-col items-center relative z-10">
                <div ref={contentRef} className="w-full flex flex-col items-center">
                    <AboutContent />
                </div>
                {/* Seamless Loop Duplicate */}
                <div className="w-full flex flex-col items-center" aria-hidden="true">
                    <AboutContent />
                </div>
            </div>
        </div>
    );
}

const AboutContent = () => (
    <>
${contentStr}
    </>
);
`;

newCode = newCode.replace(
  `import React, { useRef } from 'react';`,
  `import React, { useRef, useEffect } from 'react';`
);

const scrollLogic = `    const yImg = useTransform(scrollYProgress, [0, 1], [0, 200]);

    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!contentRef.current) return;
            const contentHeight = contentRef.current.offsetHeight;
            
            // Seamless jump
            if (window.scrollY >= contentHeight) {
                window.scrollTo({ top: window.scrollY - contentHeight, behavior: 'auto' });
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);`;

newCode = newCode.replace(
  `    const yImg = useTransform(scrollYProgress, [0, 1], [0, 200]);`,
  scrollLogic
);

fs.writeFileSync('src/components/pages/AboutMePage.tsx', newCode);
console.log("Refactored successfully");
