'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSwipeable } from 'react-swipeable'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { keyframes } from '@emotion/react'
import { useRouter } from 'next/navigation'

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

// Add the RainbowButton component
const RainbowButton = ({ className, ...props }: React.ComponentProps<typeof Button>) => (
  <Button
    className={`relative overflow-hidden ${className}`}
    {...props}
  >
    <span className="relative z-10">{props.children}</span>
    <span className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 animate-gradient-x" />
  </Button>
)

type QuestionComponentProps = {
  value: string;
  onChange: (value: string) => void;
};

const questions: {
  id: string;
  title: string;
  options: { value: string; label: string }[];
}[] = [
  {
    id: 'cryptoKnowledge',
    title: 'What do you know about crypto?',
    options: [
      { value: 'nothing', label: 'Nothing' },
      { value: 'basic', label: 'Basic understanding' },
      { value: 'advanced', label: 'Advanced knowledge' },
    ],
  },
  {
    id: 'investmentReason',
    title: 'Why do you want to invest?',
    options: [
      { value: 'diversify', label: 'Diversify my income' },
      { value: 'explore', label: 'Explore crypto without taking high risks' },
      { value: 'maximize', label: 'Maximize potential gains' },
    ],
  },
  {
    id: 'investmentDuration',
    title: 'How long are you willing to keep your money invested?',
    options: [
      { value: 'shortTerm', label: 'Less than a year' },
      { value: 'mediumTerm', label: '1 to 5 years' },
      { value: 'longTerm', label: 'More than 5 years' },
    ],
  },
  {
    id: 'riskTolerance',
    title: 'How would you react if your investment temporarily lost 50% of its value?',
    options: [
      { value: 'low', label: 'I\'d panic and sell' },
      { value: 'medium', label: 'I\'d be worried but hold' },
      { value: 'high', label: 'No problem, I\'d buy more' },
    ],
  },
  {
    id: 'budgetRange',
    title: 'What is your budget range for investing in crypto?',
    options: [
      { value: 'low', label: 'Less than $1,000' },
      { value: 'medium', label: 'Between $1,000 and $10,000' },
      { value: 'high', label: 'More than $10,000' },
    ],
  },
  {
    id: 'frequency',
    title: 'How often do you want to invest?',
    options: [
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'quarterly', label: 'Quarterly' },
    ],
  },
]

function QuestionScreen({ question, value, onChange }: {
  question: typeof questions[0],
  value: string,
  onChange: (value: string) => void,
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 leading-tight text-center">{question.title}</h2>
      <div className="flex flex-col space-y-4 w-full">
        {question.options.map((option) => (
          value === option.value ? (
            <RainbowButton
              key={option.value}
              onClick={() => onChange(option.value)}
              className="w-full py-4 text-lg border border-blue-400 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              {option.label}
            </RainbowButton>
          ) : (
            <Button
              key={option.value}
              onClick={() => onChange(option.value)}
              className="w-full py-4 text-lg bg-white hover:bg-gray-100 text-gray-800 border border-blue-300 rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
            >
              {option.label}
            </Button>
          )
        ))}
      </div>
    </div>
  )
}

function ProfileResult({ answers }: { answers: Record<string, string> }) {
  const router = useRouter()
  const determineProfile = () => {
    let conservativePoints = 0;
    let balancedPoints = 0;
    let aggressivePoints = 0;

    if (answers.cryptoKnowledge === 'nothing') conservativePoints += 2;
    if (answers.cryptoKnowledge === 'basic') balancedPoints += 2;
    if (answers.cryptoKnowledge === 'advanced') aggressivePoints += 2;

    if (answers.investmentReason === 'explore') conservativePoints += 2;
    if (answers.investmentReason === 'diversify') balancedPoints += 2;
    if (answers.investmentReason === 'maximize') aggressivePoints += 2;

    if (answers.investmentDuration === 'shortTerm') conservativePoints += 1;
    if (answers.investmentDuration === 'mediumTerm') balancedPoints += 1;
    if (answers.investmentDuration === 'longTerm') aggressivePoints += 1;

    if (answers.riskTolerance === 'low') conservativePoints += 2;
    if (answers.riskTolerance === 'medium') balancedPoints += 2;
    if (answers.riskTolerance === 'high') aggressivePoints += 2;

    if (answers.budgetRange === 'low') conservativePoints += 2;
    if (answers.budgetRange === 'medium') balancedPoints += 2;
    if (answers.budgetRange === 'high') aggressivePoints += 2;

    if (answers.frequency === 'quarterly') conservativePoints += 1;
    if (answers.frequency === 'monthly') balancedPoints += 1;
    if (answers.frequency === 'weekly') aggressivePoints += 1;

    if (conservativePoints >= balancedPoints && conservativePoints >= aggressivePoints) {
      return {
        profile: 'Conservative Investor',
        strategy: 'We will prioritize safe strategies focusing on education, stablecoins, and staking.',
      };
    } else if (balancedPoints >= aggressivePoints) {
      return {
        profile: 'Balanced Investor',
        strategy: 'We will implement a balanced strategy with a hint of boldness, including a mix of stablecoins and established cryptocurrencies.',
      };
    } else {
      return {
        profile: 'Aggressive Investor',
        strategy: 'We will pursue an aggressive strategy, including advanced options like yield farming and a focus on high-potential cryptocurrencies.',
      };
    }
  }

  const result = determineProfile()

  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-6 text-center">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">Your Investor Profile</h2>
      <p className="text-2xl font-semibold mb-4 text-blue-600">{result.profile}</p>
      <p className="text-lg mb-8 text-gray-600">{result.strategy}</p>
      <RainbowButton 
        className="px-6 py-3 text-lg rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
        onClick={() => router.push('/dashboard')}
      >
        Start Investing
      </RainbowButton>
    </div>
  )
}

export default function CryptoInvestmentQuestionnaire() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [direction, setDirection] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
      setDirection(1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setDirection(-1)
    }
  }

  const handleChange = (id: string, value: string) => {
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

  const isLastStep = currentStep === questions.length -1;

  if (!isClient) {
    return null
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-between bg-gradient-to-br from-white via-gray-100 to-gray-200 text-gray-800 overflow-hidden">
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
              {isLastStep ? (
                <ProfileResult answers={answers} />
              ) : (
                <QuestionScreen
                  question={questions[currentStep]}
                  value={answers[questions[currentStep].id] || ''}
                  onChange={(value) => handleChange(questions[currentStep].id, value)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full px-6 py-8 bg-gradient-to-br from-white via-gray-100 to-gray-200 bg-opacity-80 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <Button 
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-4 py-2 text-sm bg-white hover:bg-gray-100 text-gray-800 rounded-full shadow-md transition-all duration-300 disabled:opacity-50 border border-blue-300"
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
            {!isLastStep && (
              <RainbowButton 
                onClick={handleNext} 
                disabled={!answers[questions[currentStep].id]}
                className="px-4 py-2 text-sm rounded-full shadow-md transition-all duration-300 disabled:opacity-50 border border-blue-300"
              >
                <span className="relative z-10 flex items-center">
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </span>
              </RainbowButton>
            )}
          </div>
          {!isLastStep && (
            <p className="text-center text-sm text-gray-600">
              Swipe left or right to navigate
            </p>
          )}
        </div>
      <style jsx global>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
      </div>
    </div>
  )
}
