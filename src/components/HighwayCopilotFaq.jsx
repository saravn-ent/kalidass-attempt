import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const AccordionItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-slate-200 last:border-0">
    <button 
      className="w-full py-4 px-2 flex justify-between items-center text-left focus:outline-none hover:bg-slate-50 transition-colors"
      onClick={onClick}
    >
      <span className="font-semibold text-slate-900 text-sm md:text-base pr-4">{question}</span>
      {isOpen ? <ChevronUp className="w-5 h-5 text-indigo-600 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
    </button>
    {isOpen && (
      <div className="px-2 pb-6 text-slate-600 text-sm leading-relaxed">
        {answer}
      </div>
    )}
  </div>
);

export default function HighwayCopilotFaq() {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      question: "Do I need to provide food for the driver?",
      answer: "Yes, food expenses during the trip are to be borne by the customer. If the trip involves an overnight stay, safe accommodation for the driver must also be provided."
    },
    {
      question: "What if the trip extends beyond the estimated time?",
      answer: "Our charges are based on the actual duration and distance. Any additional hours or kilometers will be calculated as per the standard tariff card."
    },
    {
      question: "Are your drivers experienced with automatic cars?",
      answer: "Absolutely. All our 'Night Owl' pilots are senior drivers with 5+ years of experience handling both manual and automatic luxury vehicles."
    },
    {
      question: "How do you ensure the driver is not sleepy?",
      answer: "We have a strict 'Fresh Driver' policy. A driver assigned to a night duty is mandated to have rested for at least 8 hours during the day. We also enforce a 10-minute coffee break every 3 hours."
    },
    {
      question: "Is the return fare applicable if I only need a drop?",
      answer: "Yes, for one-way drops, the return bus/train fare for the driver to return to their base location must be paid by the customer."
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openFaq === index}
              onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
