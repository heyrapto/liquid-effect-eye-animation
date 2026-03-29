import { LiquidEffectAnimation } from "@/components/ui/liquid-effect-animation";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <LiquidEffectAnimation
        text={["", ""]}
        subText=""
        tagline=""
        backgroundColor="#fafafa"
        textColor="#1d1d1f"
      />
    </main>
  );
}
