import React from "react";
import moleImg from "@/app/assets/images/mole.png";
import Image from "next/image";

interface HoleProps extends React.HTMLAttributes<HTMLDivElement> {
  isMoleVisible: boolean;
}

export const Hole: React.FC<HoleProps> = ({ isMoleVisible, ...props }) => {
  return (
    <div data-testid="hole" className="hole" {...props}>
      {isMoleVisible && (
        <Image
          data-testid="mole"
          src={moleImg}
          alt="Mole"
          width={50}
          height={50}
        />
      )}
    </div>
  );
};
