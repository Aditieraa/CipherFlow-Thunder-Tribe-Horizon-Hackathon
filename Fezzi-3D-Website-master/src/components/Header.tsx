import React from "react";
import { FizziLogo } from "@/components/FizziLogo";

type Props = {};

export default function Header({}: Props) {
  return (
    <header className="-mb-28 flex justify-center py-4">
      <div className="z-10 text-4xl font-black uppercase text-sky-950 tracking-tighter">
        Battle Bubbles
      </div>
    </header>
  );
}
