"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  showOutsideDays = false,
  ...props
}: CalendarProps) {
  return (
    <div className={cn("calendar-wrapper", className)}>
      <style dangerouslySetInnerHTML={{
        __html: `
          .calendar-wrapper .rdp-root {
            /* Fix colors to grayscale */
            --rdp-accent-color: #1e293b;
            --rdp-accent-background-color: #f1f5f9;
            
            /* Fix column sizes (make it compact) */
            --rdp-day-height: 32px;
            --rdp-day-width: 32px;
            
            margin: 0;
            --rdp-month_font_family: inherit;
          }
          
          /* Dark mode colors */
          .dark .calendar-wrapper .rdp-root {
            --rdp-accent-color: #f1f5f9;
            --rdp-accent-background-color: #334155;
          }
          
          /* Selected text color */
          .calendar-wrapper .rdp-day_selected:not(.rdp-day_range_middle) {
            color: #ffffff;
            font-weight: 500;
          }
          .dark .calendar-wrapper .rdp-day_selected:not(.rdp-day_range_middle) {
            color: #0f172a;
          }
          
          /* Middle range text color */
          .calendar-wrapper .rdp-day_range_middle {
            color: #475569;
          }
          .dark .calendar-wrapper .rdp-day_range_middle {
            color: #cbd5e1;
          }
          
          /* Typography tweaks */
          .calendar-wrapper .rdp-month_caption {
            font-weight: 600;
            font-size: 0.875rem;
          }
          .calendar-wrapper .rdp-chevron {
            fill: #64748b;
          }
          .calendar-wrapper .rdp-head_cell {
            font-size: 0.75rem;
            color: #64748b;
            font-weight: 500;
            text-transform: uppercase;
          }
        `
      }} />
      <DayPicker
        showOutsideDays={showOutsideDays}
        className="p-1 md:p-2 text-sm"
        {...props}
      />
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
