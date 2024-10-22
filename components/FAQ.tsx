import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: "Why does Remote Launchpad cost money?",
      answer:
        "We employ advanced AI and machine learning technologies to continuously scan and analyze thousands of remote job opportunities across the internet. \n\nThis sophisticated system operates 24/7 and incurs significant costs. We charge for access to ensure we can maintain and improve this service, keeping Remote Launchpad at the forefront of remote job discovery.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Absolutely! You have the flexibility to cancel your subscription at any time without any hidden fees or penalties. \n\nAfter cancellation, you'll retain access to Remote Launchpad until the end of your current billing period.",
    },
    {
      question: "What sets Remote Launchpad apart from other job boards?",
      answer:
        "Unlike traditional job boards that only feature listings from companies that pay to post, Remote Launchpad uses AI-powered scraping to gather jobs from across the internet. \n\nThis means we offer a much more comprehensive selection of opportunities, including those from companies that don't advertise on paid platforms. Our approach ensures you have access to thousands more job listings, giving you a significant advantage in your job search.",
    },
    {
      question: "How frequently are new jobs added to Remote Launchpad?",
      answer:
        "Our AI-driven system continuously updates our job listings. \n\nWe scan and analyze company websites and various job sources daily, ensuring that Remote Launchpad always presents the most current and relevant job opportunities in the remote work market.",
    },
    {
      question: "Is it possible to suggest jobs or companies to be included?",
      answer:
        "Definitely! We value input from our community and are always looking to expand our job sources. \n\nIf you have suggestions for jobs or companies to include, please email us at support@remotelaunchpad.com. We review every suggestion to help make Remote Launchpad even more comprehensive.",
    },
    {
      question: "Who is behind Remote Launchpad?",
      answer:
        "Remote Launchpad was founded by a team of tech enthusiasts and remote work advocates. \n\nOur mission is to revolutionize the way people find remote job opportunities by leveraging cutting-edge AI technology. We're passionate about connecting talented individuals with exciting remote positions across the globe.",
    },
  ];

  return (
    <section className="py-10 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-3xl mx-auto space-y-6"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-gray-700 rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-4 hover:bg-[hsla(217,33%,22%,0.5)] transition-colors">
                <span className="text-left text-lg font-semibold">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 bg-[hsla(217,33%,22%,0.5)]">
                {faq.answer.split("\n\n").map((paragraph, i) => (
                  <p key={i} className={i > 0 ? "mt-4" : ""}>
                    {paragraph}
                  </p>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
