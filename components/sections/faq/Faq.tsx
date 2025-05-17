import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Do you have a trial period?",
    answer:
      "Yes, we offer a 1-day free trial so you can test the functionality of our scanner. You can request your demo from our website.",
  },
  {
    question: "What do surebets mean?",
    answer:
      "Surebets are betting opportunities that guarantee a profit regardless of the outcome. They occur when bookmakers offer different odds for the same event, allowing bettors to place wagers on all possible outcomes and secure a profit.",
  },
  {
    question: "What are Prematch and Live surebets?",
    answer:
      "Prematch surebets are betting opportunities available before an event starts, while Live surebets occur during the event. Our platform offers tools for both types, allowing you to maximize your profits in different scenarios.",
  },
  {
    question: "How much can I earn?",
    answer:
      "Earnings vary based on your investment amount, the frequency of your bets, and market conditions. Many of our users report consistent profits of 5-15% on their investments, but results can vary.",
  },
]

export default function Faq() {
  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Frequently Asked Questions</h2>
          </div>
        </div>
        <div className="mx-auto max-w-3xl mt-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
