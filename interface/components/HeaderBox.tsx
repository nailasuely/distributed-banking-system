// components/HeaderBox.tsx
import React from 'react';

interface HeaderBoxProps {
  type?: "title" | "greeting";
  title: string;
  subtext: string;
  // Remova o prop 'user' daqui
}

const HeaderBox: React.FC<HeaderBoxProps> = ({ type = "title", title, subtext }: HeaderBoxProps) => {
  return (
    <div className="header-box">
      <h1 className="header-box-title">
        {title}
        {type === 'greeting' && (
          <span className="text-bankGradient">
            {/* Remova a parte que depende de 'user' */}
          </span>
        )}
      </h1>
      <p className="header-box-subtext">{subtext}</p>
    </div>
  );
};

export default HeaderBox;
