"use client";

import { Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoinPriceProps {
  price: number;
  className?: string;
}

export function CoinPrice({ price, className }: CoinPriceProps) {
  return (
    <div className={`flex items-center gap-1 font-medium ${className}`}>
      <Coins className="h-4 w-4 text-yellow-500" />
      <span>{price.toLocaleString()} coins</span>
    </div>
  );
}
