const fs = require('fs');

const content = fs.readFileSync('src/components/HolographicUI.tsx', 'utf-8');

const startStr = "            {/* 1. DISCOVERY TIMELINE PANEL CONTROLS */}";
const endStr = "            {/* 3. ATOMIC EXPLORER PANEL CONTROLS */}";

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

if (startIdx === -1 || endIdx === -1) {
  console.log("Could not find boundaries", {startIdx, endIdx});
  process.exit(1);
}

const extractedBlock = content.substring(startIdx, endIdx);

let newContent = content.substring(0, startIdx) + content.substring(endIdx);

const rightPanel = `
        {/* =======================================================
            UNIVERSAL KNOWLEDGE ZONE FOR TIMELINE / MOLECULAR / BOND LAB
            ======================================================= */}
        {!selectedElement && isObsEntered && (appMode === 'timeline' || appMode === 'bond_lab' || appMode === 'molecular') && (
          <div className="absolute right-4 md:right-12 bottom-20 md:bottom-auto md:top-1/2 md:-translate-y-1/2 max-w-[280px] w-full sm:max-w-[340px] md:w-96 pointer-events-auto animate-fade-in-right z-40 bg-[#040814]/90 backdrop-blur-3xl border border-[#00FFF0]/20 p-5 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col gap-4 max-h-[85vh] overflow-y-auto custom-scrollbar select-none">
` + extractedBlock + `
          </div>
        )}
`;

const drawerEndMarker = "        {/* COMPARE SELECTOR MODAL */}";
const insertIdx = newContent.indexOf(drawerEndMarker);

if (insertIdx === -1) {
  console.log("Could not find insertion marker");
  process.exit(1);
}

newContent = newContent.substring(0, insertIdx) + rightPanel + "\n" + newContent.substring(insertIdx);

fs.writeFileSync('src/components/HolographicUI.tsx', newContent);
console.log("Successfully reorganized layout");
