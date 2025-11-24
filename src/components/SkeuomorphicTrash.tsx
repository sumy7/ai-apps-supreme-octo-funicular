import React from 'react';

interface SkeuomorphicTrashProps {
  isOpen: boolean;
}

export const SkeuomorphicTrash: React.FC<SkeuomorphicTrashProps> = ({ isOpen }) => {
  return (
    <div className="relative w-20 h-24 select-none">
      {/* Lid */}
      <div 
        className={`
          absolute top-0 left-0 w-full z-20 transition-transform duration-300 ease-out origin-[10%_50%]
          ${isOpen ? '-rotate-[110deg] translate-y-[-10px]' : 'rotate-0'}
        `}
      >
        {/* Handle */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-neutral-400 rounded-t-md border-x border-t border-neutral-500 shadow-sm"></div>
        
        {/* Lid Main Shape */}
        <div className="w-full h-4 bg-neutral-300 rounded-[50%] border border-neutral-400 shadow-md relative overflow-hidden">
           {/* Shine */}
           <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent"></div>
        </div>
      </div>

      {/* Bin Body Container */}
      <div className="absolute top-2 w-full h-full z-10">
        {/* Dark Opening (Visible when open) */}
        <div className="absolute top-0 left-[5%] w-[90%] h-4 bg-neutral-800 rounded-[50%] shadow-[inset_0_5px_5px_rgba(0,0,0,0.5)]"></div>
        
        {/* Cylinder Body */}
        <div className="absolute top-2 w-full h-[calc(100%-8px)] bg-neutral-200 rounded-b-xl border-x border-b border-neutral-400 shadow-xl overflow-hidden">
           {/* Metallic Gradient Overlay */}
           <div className="absolute inset-0 bg-gradient-to-r from-neutral-400 via-neutral-100 to-neutral-400 opacity-80"></div>
           
           {/* Vertical Ribs for texture */}
           <div className="absolute inset-0 flex justify-evenly px-3 opacity-10">
             <div className="w-0.5 h-full bg-black"></div>
             <div className="w-0.5 h-full bg-black"></div>
             <div className="w-0.5 h-full bg-black"></div>
           </div>
           
           {/* Recycle Icon */}
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-40">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-800">
               <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.88l-1.36-2.12a2 2 0 0 1 0-2.12l1.36-2.12a1.83 1.83 0 0 1 1.57-.88H9.43" />
               <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.84l2.89-4.63a2 2 0 0 0 0-2.12l-2.89-4.63a1.83 1.83 0 0 0-1.556-.84H12" />
               <path d="M7 19l-1.8-3" />
               <path d="M11 19l1.8-3" />
             </svg>
           </div>
        </div>
      </div>
    </div>
  );
};
