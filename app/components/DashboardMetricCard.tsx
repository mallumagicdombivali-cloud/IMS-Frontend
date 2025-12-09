"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "../components/lib/utils";
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

type IconType = React.ElementType;
export type TrendType = 'up' | 'down' | 'neutral';

export interface DashboardMetricCardProps {
  value: string | number;
  title: string;
  icon?: IconType;
  trendChange?: string;
  trendType?: TrendType;
  className?: string;
  loading?: boolean;
}

const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  value,
  title,
  icon: IconComponent,
  trendChange,
  trendType = 'neutral',
  className,
  loading = false,
}) => {
  const TrendIcon = trendType === 'up' ? ArrowUp : trendType === 'down' ? ArrowDown : Minus;
  
  const trendColorClass =
    trendType === 'up'
      ? "text-green-600"
      : trendType === 'down'
      ? "text-red-600"
      : "text-gray-500";

  if (loading) {
    return (
        <div className={cn("rounded-lg border border-taupe bg-white/50 h-32 animate-pulse", className)} />
    )
  }

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "cursor-pointer rounded-lg bg-white/50 backdrop-blur-sm border border-taupe overflow-hidden",
        className
      )}
    >
        <div className="p-6">
            <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-sm font-medium text-gray-500">
                    {title}
                </h3>
                {IconComponent && (
                    <IconComponent className="h-4 w-4 text-camel" aria-hidden="true" />
                )}
            </div>
            <div className="text-2xl font-bold text-foreground mb-2">{value}</div>
            
            {trendChange && (
            <p className={cn("flex items-center text-xs font-medium", trendColorClass)}>
                <TrendIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                {trendChange}
            </p>
            )}
        </div>
    </motion.div>
  );
};

export default DashboardMetricCard;