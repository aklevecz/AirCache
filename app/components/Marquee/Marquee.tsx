import { Children, ReactElement } from "react";

type PropsConditional = {
  condition: boolean;
  wrapper: (children: ReactElement) => ReactElement | null | undefined;
  children: ReactElement;
};

export const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: PropsConditional): JSX.Element =>
  condition ? wrapper(children) ?? children : children;

export const formatMarquee = (marquee: string | null): string[] | null =>
  marquee ? marquee.split(",").map((a) => a.trim()) : null;

export default function Marquee({ children }: any) {
  const keyframes = `
    @keyframes scroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-100%);
      }
    }
  `;

  const aniScroll = {
    animation: "scroll 30s linear infinite",
  };

  return (
    <>
      <style>{keyframes}</style>
      <div
        aria-hidden="true"
        className="font-black z-10 fixed bottom-0 left-0 flex w-full h-10 bg-transparent overflow-hidden"
      >
        {[0, 1].map((_, index) => (
          <div key={index} className="flex text-white" style={aniScroll}>
            {Children.map(children, (child) => {
              return (
                <div
                  key={index}
                  className="flex items-center whitespace-nowrap text-xs my-2 mx-4 ml-0 pointer-events-none"
                >
                  <ConditionalWrapper
                    condition={child === "Egg Hunt"}
                    wrapper={(children) => (
                      <div className="text-yellow-400">{children}</div>
                    )}
                  >
                    {child}
                  </ConditionalWrapper>
                  <span className="ml-3">&ndash;</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}
