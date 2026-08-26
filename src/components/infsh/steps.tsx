'use client'

import { cn } from '@/lib/utils'
import { Check, Circle } from 'lucide-react'
import React, { useMemo } from 'react'

// =============================================================================
// Steps Component
// =============================================================================

interface StepInfo {
    title: string
    children: React.ReactNode
    icon?: React.ReactNode
}

function extractSteps(children: React.ReactNode): StepInfo[] {
    const steps: StepInfo[] = []

    React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child)) return

        const type = child.type
        const typeName = typeof type === 'string' ? type.toLowerCase() : ''

        if (typeName === 'step' || (typeof type === 'function' && (type as React.FC).displayName === 'DocsStep')) {
            const props = child.props as { title?: string; icon?: React.ReactNode; children?: React.ReactNode }
            steps.push({
                title: props.title || '',
                icon: props.icon,
                children: props.children,
            })
        }
    })

    return steps
}

export interface StepsProps {
    children: React.ReactNode
    className?: string
    /** Title text size: 'p' (default), 'h2', 'h3' */
    titleSize?: 'p' | 'h2' | 'h3'
}

export function Steps({ children, className, titleSize = 'p' }: StepsProps) {
    const steps = useMemo(() => extractSteps(children), [children])

    if (steps.length === 0) {
        return <div className={className}><span>{children}</span></div>
    }

    const titleClasses = {
        'p': 'text-base font-semibold',
        'h2': 'text-xl font-bold',
        'h3': 'text-lg font-semibold',
    }

    return (
        <div className={cn('my-6 space-y-0', className)}>
            {steps.map((step, i) => (
                <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
                    {/* Vertical line */}
                    {i < steps.length - 1 && (
                        <div className="absolute left-[15px] top-8 h-[calc(100%-16px)] w-px bg-border" />
                    )}

                    {/* Step number indicator */}
                    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-brand-pink bg-background text-sm font-semibold text-brand-pink">
                        {step.icon || i + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-0.5">
                        {step.title && (
                            <div className={cn(titleClasses[titleSize], 'mb-2')}>
                                {step.title}
                            </div>
                        )}
                        <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                            {step.children}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

// =============================================================================
// Step Component (individual step)
// =============================================================================

export interface StepProps {
    title?: string
    icon?: React.ReactNode
    children: React.ReactNode
}

export function Step({ children }: StepProps) {
    // This component is just a marker - actual rendering happens in Steps
    return <>{children}</>
}

Step.displayName = 'DocsStep'
