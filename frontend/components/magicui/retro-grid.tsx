import { cn } from "@/lib/utils";
import Image from "next/image";

interface RetroGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Additional CSS classes to apply to the grid container
   */
  className?: string;
  /**
   * Rotation angle of the grid in degrees
   * @default 65
   */
  angle?: number;
  /**
   * Grid cell size in pixels
   * @default 60
   */
  cellSize?: number;
  /**
   * Grid opacity value between 0 and 1
   * @default 0.5
   */
  opacity?: number;
  /**
   * Grid line color in light mode
   * @default "gray"
   */
  lineColor?: string;
  /**
   * Grid line color in dark mode
   * @default "gray"
   */
  darkLineColor?: string;
}

export function RetroGrid({
  className,
  angle = 70,
  cellSize = 50,
  opacity = 0.15,
  lineColor = "#545454",
  ...props
}: RetroGridProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden w-full h-full",
        className,
      )}
      style={{
        perspective: "200px",
        opacity,
      }}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{ transform: `rotateX(${angle}deg)` }}
      >
        <div
          className="animate-grid"
          style={{
            backgroundImage: `
                  linear-gradient(to right, ${lineColor} 1px, transparent 1px),
                  linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)
                `,
            backgroundRepeat: "repeat",
            backgroundSize: `${cellSize}px ${cellSize}px`,
            height: "300vh",
            width: "600vw",
            transformOrigin: "100% 0 0",
            marginLeft: "-200%",
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-90%" />

      <Image
        src="/lorry1.png"
        alt="truck"
        width={200}
        height={217}
        className="absolute bottom-[20%] lg:left-[35%] md:left-[20%] left-[5%] animate-first-lorry w-[200px] max-w-[200px]"
        style={{
          transformOrigin: "center",
        }}
      />
      <Image
        src="/lorry2.png"
        alt="truck"
        width={425}
        height={598}
        className="absolute top-[50%] lg:right-[47%] md:right-[30%] right-[20%] w-[70px] animate-second-lorry"
        style={{
          transformOrigin: "center",
        }}
      />
    </div>
  );
}
