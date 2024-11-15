'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSwipeable } from 'react-swipeable'
import { ChevronLeft, ChevronRight, DollarSign } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RainbowButton } from "@/components/ui/rainbow-button-white"

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
      <div className="space-y-8 w-full">
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          max={10}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-lg text-gray-600">
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
      <div className="flex flex-col space-y-4 w-full">
        {['Weekly', 'Monthly', 'Quarterly'].map((option) => (
          value === option.toLowerCase() ? (
            <RainbowButton
              key={option.toLowerCase()}
              onClick={() => onChange(option.toLowerCase())}
              className="w-full py-4 text-lg !bg-blue-500 hover:!bg-blue-600 !text-white border border-blue-400 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              {option}
            </RainbowButton>
          ) : (
            <Button
              key={option.toLowerCase()}
              onClick={() => onChange(option.toLowerCase())}
              className="w-full py-4 text-lg bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
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
      <div className="relative w-full">
        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md transition-all duration-300"
          placeholder="Enter amount"
        />
      </div>
    ),
  },
]

function QuestionScreen({ question, value, onChange }: {
  question: typeof questions[0],
  value: any,
  onChange: (value: any) => void,
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 leading-tight text-center">{question.title}</h2>
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
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrevious,
    trackMouse: true
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        handleNext()
      } else if (event.key === 'ArrowLeft') {
        handlePrevious()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentStep])

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-between bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 text-gray-800 overflow-hidden">
      <div className="w-full h-full flex flex-col items-center justify-between" {...swipeHandlers}>
        <div className="w-full flex-grow flex items-center justify-center overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? '100%' : '-100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? '-100%' : '100%' }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30,
                opacity: { duration: 0.2 }
              }}
              className="absolute w-full h-full flex items-center justify-center"
            >
              <QuestionScreen
                question={questions[currentStep]}
                value={answers[questions[currentStep].id as keyof typeof answers]}
                onChange={(value) => handleChange(questions[currentStep].id, value)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full px-6 py-8 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 bg-opacity-80 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <Button 
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-4 py-2 text-sm bg-white hover:bg-gray-100 text-gray-800 rounded-full shadow-md transition-all duration-300 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div className="flex space-x-2">
              {questions.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-blue-500' : 'bg-white'
                  }`}
                  animate={{ scale: index === currentStep ? 1.2 : 1 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
            <Button 
              onClick={handleNext} 
              className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md transition-all duration-300"
            >
              {currentStep === questions.length - 1 ? 'Submit' : 'Next'}
              {currentStep !== questions.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
          <p className="text-center text-sm text-gray-600">
            Swipe left or right to navigate
          </p>
        </div>
      </div>
    </div>
  )
}