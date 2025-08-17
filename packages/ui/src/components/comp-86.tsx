import { ArrowRight } from "lucide-react";

import { Button } from "@gb/ui/components/ui/button";

export default function ButtonArrow() {
  return (
    <Button className="group ">
      Get Started
      <ArrowRight
        className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
        size={16}
        aria-hidden="true"
      />
    </Button>
  );
}
