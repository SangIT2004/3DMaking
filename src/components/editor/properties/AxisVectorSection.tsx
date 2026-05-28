"use client"

import { Input } from "@/components/ui/input";

type AxisVectorSectionProps = {
  title: string;
  values: [number, number, number];
  onChange: (axis: number, value: string) => void;
};

const AXES = ['X', 'Y', 'Z'] as const;

export function AxisVectorSection({ title, values, onChange }: AxisVectorSectionProps) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{title}</label>
      <div className="grid grid-cols-3 gap-2">
        {AXES.map((axis, index) => (
          <div key={axis} className="space-y-1">
            <span className="text-[9px] text-gray-600 block text-center font-bold">{axis}</span>
            <Input
              type="number"
              step="0.1"
              value={values[index].toFixed(2)}
              onChange={(event) => onChange(index, event.target.value)}
              className="h-8 px-1 text-center bg-black/20 border-white/10 text-gray-200 text-xs"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
