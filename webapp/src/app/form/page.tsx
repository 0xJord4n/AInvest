'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSwipeable } from 'react-swipeable'
import { ChevronDown, DollarSign } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RainbowButton } from "@/components/ui/rainbow-button"

type QuestionComponentProps = {
  value: any;
  onChange: (value: any) => void;
};

const questions: {
  id: string;
  title: string;
  component: React.ComponentType<QuestionComponentProps>;
}[] = [
  {
    id: 'risk',
    title: 'How much risk are you comfortable with?',
    component: ({ value, onChange }: { value: number, onChange: (value: number) => void }) => (
      <div className="space-y-8">
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          max={10}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-lg text-white/80">
          <span>Low Risk</span>
          <span>High Risk</span>
        </div>
      </div>
    ),
  },
  {
    id: 'frequency',
    title: 'How often do you want to invest?',
    component: ({ value, onChange }: { value: string, onChange: (value: string) => void }) => (
      <div className="flex flex-col space-y-4">
        {['Weekly', 'Monthly', 'Quarterly'].map((option) => (
          value === option.toLowerCase() ? (
            <RainbowButton
              key={option.toLowerCase()}
              onClick={() => onChange(option.toLowerCase())}
              className="w-full py-4 text-lg bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              {option}
            </RainbowButton>
          ) : (
            <Button
              key={option.toLowerCase()}
              onClick={() => onChange(option.toLowerCase())}
              className="w-full py-4 text-lg bg-white/10 hover:bg-white/20"
            >
              {option}
            </Button>
          )
        ))}
      </div>
    ),
  },
  {
    id: 'amount',
    title: 'How much do you want to invest?',
    component: ({ value, onChange }: { value: string, onChange: (value: string) => void }) => (
      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter amount"
        />
      </div>
    ),
  },
]

function QuestionCard({ question, value, onChange }: {
  question: typeof questions[0],
  value: any,
  onChange: (value: any) => void,
}) {
  return (
    <div className="w-full max-w-md p-6">
      <h2 className="text-3xl font-bold mb-8 text-white leading-tight">{question.title}</h2>
      <question.component value={value} onChange={onChange} />
    </div>
  )
}

export default function InvestmentQuestionnaire() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({
    risk: 5,
    frequency: 'monthly',
    amount: '',
  })
  const [direction, setDirection] = useState(0)

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
      setDirection(1)
    } else {
      console.log('Form submitted:', answers)
      // Here you would typically send the data to your backend
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setDirection(-1)
    }
  }

  const handleChange = (id: string, value: any) => {
    setAnswers({ ...answers, [id]: value })
  }

  const swipeHandlers = useSwipeable({
    onSwipedUp: handleNext,
    onSwipedDown: handlePrevious,
    //preventDefaultTouchmoveEvent: true,
    trackMouse: true
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        handleNext()
      } else if (event.key === 'ArrowUp') {
        handlePrevious()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentStep])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 text-white overflow-hidden relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-soft-light" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/30 rounded-full filter blur-[100px]"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-128 h-128 bg-blue-500/30 rounded-full filter blur-[100px]"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="w-full max-w-md px-4" {...swipeHandlers}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            initial={{ opacity: 0, y: direction > 0 ? 50 : -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction > 0 ? -50 : 50 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionCard
              question={questions[currentStep]}
              value={answers[questions[currentStep].id as keyof typeof answers]}
              onChange={(value) => handleChange(questions[currentStep].id, value)}
            />
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-center">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full mx-1 ${
                index === currentStep ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button onClick={handleNext} className="px-8 py-3 text-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full">
            {currentStep === questions.length - 1 ? 'Submit' : 'Next'}
            <ChevronDown className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-white/60">
          Swipe up or down to navigate
        </div>
      </div>
    </div>
  )
}