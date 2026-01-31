
"use client"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { surveySchema, SurveyValues } from "@/lib/schema"
import { QUESTIONS_DATA, Question, Section } from "@/lib/questions"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, ArrowLeft, ArrowRight, Check, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Helper to flatten questions with section context
type FlattenedQuestion = Question & {
    sectionTitle: string
    sectionDescription?: string
    sectionScale?: string[]
}

const getAllQuestions = (): FlattenedQuestion[] => {
    return QUESTIONS_DATA.flatMap((section) =>
        section.questions.map((q) => ({
            ...q,
            sectionTitle: section.sectionTitle,
            sectionDescription: section.description,
            sectionScale: section.scale,
        }))
    )
}

const ALL_QUESTIONS = getAllQuestions()

export function SurveyForm() {
    const [showWelcome, setShowWelcome] = useState(true)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [direction, setDirection] = useState(0) // -1 for back, 1 for next
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [historyStack, setHistoryStack] = useState<number[]>([]) // track visited indices for accurate back navigation
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const form = useForm<SurveyValues>({
        resolver: zodResolver(surveySchema),
        mode: "onChange",
    })

    // Determine current visible question based on conditions
    const currentQuestion = ALL_QUESTIONS[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / ALL_QUESTIONS.length) * 100

    // Scroll to top on question change
    const cardRef = useRef<HTMLDivElement>(null)

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "auto" }) // Instant scroll per user request
    }

    const handleStart = () => {
        setShowWelcome(false)
        scrollToTop()
    }

    // Watch current value to handle disabled state
    const currentValue = form.watch(currentQuestion.id as keyof SurveyValues);
    const isNextDisabled = !currentValue || (typeof currentValue === "string" && currentValue.trim() === "");

    const handleNext = async (delay = 75) => { // Reduced delay significantly
        // Validation check
        const val = form.getValues(currentQuestion.id as keyof SurveyValues);
        if (!val || (typeof val === "string" && val.trim() === "")) {
            return; // Block progress if empty
        }

        // Validate current field
        const isValid = await form.trigger(currentQuestion.id as keyof SurveyValues)
        if (!isValid) return

        // Add to history stack
        setHistoryStack((prev) => [...prev, currentQuestionIndex])

        // Trigger safe auto-scroll to top
        window.scrollTo({ top: 0, behavior: "auto" });

        setTimeout(() => {
            // Calculate next index based on conditions
            let nextIndex = currentQuestionIndex + 1

            // Safety check for end of survey
            if (nextIndex >= ALL_QUESTIONS.length) {
                // We're done? Or submit?
                return
            }

            // Skip questions that don't meet conditions
            while (nextIndex < ALL_QUESTIONS.length) {
                const q = ALL_QUESTIONS[nextIndex]
                if (q.conditional) {
                    const watchedValue = form.getValues(q.conditional.field as any)
                    if (watchedValue !== q.conditional.value) {
                        nextIndex++
                        continue
                    }
                }
                break
            }

            if (nextIndex < ALL_QUESTIONS.length) {
                setDirection(1)
                setCurrentQuestionIndex(nextIndex)
                scrollToTop()
            } else {
                // Reached the end, ready to submit?
                // Maybe show a review screen? For now, we just stay on last question waiting for submit click.
                // But typically we want a distinct submit step.
                // Let's implement submit here.
                // Do nothing, wait for submit button click on last question?
                // Actually auto-submit on last question is risky. Let them review.
            }
        }, delay)
    }

    const handleBack = () => {
        if (historyStack.length === 0) return

        const prevIndex = historyStack[historyStack.length - 1]
        setHistoryStack((prev) => prev.slice(0, -1))
        setDirection(-1)
        setCurrentQuestionIndex(prevIndex)
        scrollToTop()
    }

    async function onSubmit(data: SurveyValues) {
        if (isSubmitting) return;
        setIsSubmitting(true)
        setErrorMessage(null)
        try {
            const response = await fetch("/api/submit", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }

            setIsSuccess(true)
            window.scrollTo(0, 0)
        } catch (error: any) {
            console.error(error)
            setErrorMessage(error.message || "Failed to submit survey. Please try again.")
            // alert(error.message || "Failed to submit survey. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Animation variants
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
            position: 'absolute' as 'absolute' // To prevent layout shift during transition? actually standard absolute makes content overlap
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            position: 'relative' as 'relative'
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0,
            position: 'absolute' as 'absolute'
        }),
    }

    // Simplified variants for speed/snappiness without absolute positioning issues
    const simplerVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 20 : -20, // Reduced distance
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 20 : -20, // Reduced distance
            opacity: 0,
        })
    }


    if (isSuccess) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="w-full max-w-lg mx-auto text-center shadow-[0_20px_50px_rgba(31,78,70,0.08)] border-0 border-t-8 border-secondary bg-surface rounded-[2rem]">
                        <CardHeader>
                            <div className="mx-auto bg-primary-light p-5 rounded-full mb-4">
                                <Check className="h-10 w-10 text-primary" />
                            </div>
                            <CardTitle className="text-4xl text-primary font-serif mb-2">Thank You!</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl text-text-main font-sans">
                                Your responses have been recorded successfully.
                            </p>
                            <p className="text-text-muted mt-4 font-serif italic text-lg">
                                We appreciate your contribution to this research.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        )
    }

    if (showWelcome) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-lg"
                >
                    <Card className="shadow-[0_20px_50px_rgba(31,78,70,0.15)] border-0 border-t-8 border-primary bg-surface rounded-[2rem]">
                        <CardHeader className="text-center pb-2 pt-8">
                            <CardTitle className="text-4xl md:text-5xl font-bold font-serif text-primary tracking-tight">Welcome</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-8 pt-6 px-8">
                            <p className="text-text-main text-xl leading-relaxed font-sans">
                                Thank you for participating in this survey about <br /><span className="font-serif italic text-2xl text-secondary">Latter-day Saint beliefs</span> and perspectives.
                            </p>

                            <div className="bg-primary-light/40 py-4 px-6 rounded-2xl inline-flex items-center space-x-3 text-primary font-semibold mx-auto border border-primary/10">
                                <Clock className="h-5 w-5" />
                                <span>Estimated time: 4 minutes</span>
                            </div>

                            <p className="text-base text-text-muted italic font-serif">
                                Please answer honestly. Your responses are anonymous.
                            </p>
                        </CardContent>
                        <CardFooter className="justify-center pb-10 pt-4">
                            <Button onClick={handleStart} className="w-full max-w-sm text-lg h-16 rounded-full bg-secondary hover:bg-secondary-hover shadow-xl shadow-secondary/20 transition-all hover:scale-105 active:scale-95 text-white font-bold tracking-wide">
                                Start Survey <ArrowRight className="ml-2 h-6 w-6" />
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        )
    }

    // Logic to differentiate "Last Question" for Submit button
    const isLastQuestion = (() => {
        let nextIndex = currentQuestionIndex + 1
        while (nextIndex < ALL_QUESTIONS.length) {
            const q = ALL_QUESTIONS[nextIndex]
            if (q.conditional) {
                const watchedValue = form.getValues(q.conditional.field as any)
                if (watchedValue !== q.conditional.value) {
                    nextIndex++
                    continue
                }
            }
            return false // found a valid next question
        }
        return true // no valid next questions found
    })()


    return (
        <div className="min-h-screen bg-transparent py-4 px-4 flex flex-col items-center">
            <div className="w-full max-w-2xl mx-auto space-y-8 flex-1 flex flex-col" ref={cardRef}>

                {/* Progress Header */}
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm font-bold text-primary/80 uppercase tracking-widest px-1">
                        <span>Question {historyStack.length + 1}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-3 bg-white/50 rounded-full" />
                </div>
                {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline"> {errorMessage}</span>
                    </div>
                )}

                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentQuestion.id}
                        custom={direction}
                        variants={simplerVariants} // Use simpler variants for correct layout flow
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 500, damping: 30, mass: 0.5 }, // Increased stiffness for snappy feel
                            opacity: { duration: 0.1 },
                        }}
                        className="w-full"
                    >
                        <Card className="border-t-8 border-t-primary shadow-[0_20px_50px_rgba(31,78,70,0.08)] bg-surface overflow-hidden rounded-[2rem] border-0 ring-1 ring-black/5">
                            <CardHeader className="pb-2 bg-primary-light/30 border-b border-border p-5 md:p-6">
                                <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1 font-sans opacity-80">
                                    {currentQuestion.sectionTitle}
                                </div>
                                {currentQuestion.sectionDescription && (
                                    <p className="text-text-muted text-base mb-1 leading-relaxed font-serif italic">
                                        {currentQuestion.sectionDescription}
                                    </p>
                                )}
                                <CardTitle className="text-xl md:text-3xl font-serif font-medium text-text-main leading-tight mt-1">
                                    {currentQuestion.label}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="pt-6 p-5 md:p-6 min-h-[200px] flex flex-col justify-center">
                                <Form {...form}>
                                    <form className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name={currentQuestion.id as any}
                                            render={({ field }) => (
                                                <FormItem className="space-y-4">
                                                    <FormControl>
                                                        {(() => {
                                                            // RENDER INPUT BASED ON TYPE
                                                            const type = currentQuestion.type
                                                            let options: string[] | undefined = []

                                                            if (currentQuestion.type === "scale") {
                                                                // Use specific options if provided, otherwise section default
                                                                options = currentQuestion.options || currentQuestion.sectionScale
                                                            } else {
                                                                options = currentQuestion.options
                                                            }

                                                            if (type === "select") {
                                                                return (
                                                                    <Select
                                                                        onValueChange={(val) => {
                                                                            field.onChange(val)
                                                                            handleNext(100) // Super fast auto-advance
                                                                        }}
                                                                        defaultValue={field.value}
                                                                    >
                                                                        <SelectTrigger className="w-full h-12 text-lg px-4 rounded-xl border-2 border-border focus:border-primary focus:ring-primary/20 bg-surface">
                                                                            <SelectValue placeholder="Select an option" />
                                                                        </SelectTrigger>
                                                                        <SelectContent className="bg-surface border-border rounded-lg shadow-xl">
                                                                            {options?.map((opt) => (
                                                                                <SelectItem key={opt} value={opt} className="text-base py-3 px-3 focus:bg-primary-light text-text-main cursor-pointer">
                                                                                    {opt}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                )
                                                            }

                                                            if (type === "number" || type === "text") {
                                                                return (
                                                                    <Input
                                                                        type={type}
                                                                        {...field}
                                                                        value={field.value || ""}
                                                                        onChange={(e) => field.onChange(e.target.value)}
                                                                        className="h-12 text-lg px-4 rounded-xl border-2 border-border focus:border-primary focus:ring-primary/20 bg-surface placeholder:text-text-muted/50"
                                                                        placeholder="Type your answer..."
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') {
                                                                                e.preventDefault()
                                                                                handleNext(50)
                                                                            }
                                                                        }}
                                                                    />
                                                                )
                                                            }

                                                            // Radio, Scale
                                                            return (
                                                                <RadioGroup
                                                                    onValueChange={(val) => {
                                                                        field.onChange(val)
                                                                        handleNext(100) // Super fast auto-advance
                                                                    }}
                                                                    defaultValue={field.value}
                                                                    className="flex flex-col gap-2"
                                                                >
                                                                    {options?.map((opt) => (
                                                                        <FormItem
                                                                            key={opt}
                                                                            className={`flex items-center space-x-3 space-y-0 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer group ${field.value === opt
                                                                                ? "border-primary bg-primary-light shadow-sm"
                                                                                : "border-border bg-surface hover:border-primary/50 hover:bg-surface"
                                                                                }`}
                                                                            onClick={() => {
                                                                                field.onChange(opt)
                                                                                handleNext(100)
                                                                            }}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter') {
                                                                                    e.preventDefault()
                                                                                    if (!isNextDisabled) {
                                                                                        handleNext(50)
                                                                                    }
                                                                                }
                                                                            }}
                                                                        >
                                                                            <FormControl>
                                                                                <RadioGroupItem value={opt} className="h-5 w-5 text-primary border-2 border-text-muted/40 data-[state=checked]:border-primary" />
                                                                            </FormControl>
                                                                            <FormLabel className="font-medium cursor-pointer flex-1 text-base text-text-main group-hover:text-primary transition-colors select-none">
                                                                                {opt}
                                                                            </FormLabel>
                                                                        </FormItem>
                                                                    ))}
                                                                </RadioGroup>
                                                            )
                                                        })()}
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </form>
                                </Form>
                            </CardContent>

                            <CardFooter className="flex justify-between pt-4 border-t border-border bg-surface p-5 md:p-6">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleBack}
                                    disabled={currentQuestionIndex === 0 && historyStack.length === 0} // Can only go back if stack not empty
                                    className="text-text-muted hover:text-primary hover:bg-primary-light transition-colors text-base px-4 h-12 rounded-full"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                </Button>

                                <div className="flex gap-2">
                                    {/* Always show Next/Submit button for accessibility or if auto-advance fails/is annoying */}
                                    {isLastQuestion ? (
                                        <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting || isNextDisabled} className="bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 px-8 h-12 rounded-full text-base font-bold tracking-wide transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Complete Survey"}
                                        </Button>
                                    ) : (
                                        <Button type="button" onClick={() => handleNext(0)} disabled={isNextDisabled} className="bg-secondary hover:bg-secondary-hover text-white shadow-lg shadow-secondary/20 px-6 h-12 rounded-full text-base font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                                            Next <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
