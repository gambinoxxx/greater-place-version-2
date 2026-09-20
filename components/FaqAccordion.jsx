'use client'

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

// items: [{ question: string, answer: node }]. The first item starts open.
export default function FaqAccordion({ items, label = 'Frequently asked questions' }) {
  return (
    <div role="group" aria-label={label} className="border-b border-atmos-line">
      {items.map((item, index) => (
        <Accordion
          key={item.question}
          defaultExpanded={index === 0}
          disableGutters
          square
          elevation={0}
          sx={{
            bgcolor: 'transparent',
            color: 'inherit',
            backgroundImage: 'none',
            borderTop: 1,
            borderColor: 'divider',
            '&::before': { display: 'none' },
          }}
        >
          <AccordionSummary
            id={`faq-${index}-header`}
            aria-controls={`faq-${index}-panel`}
            expandIcon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            }
            sx={{ px: 0, py: 1, '& .MuiAccordionSummary-content': { my: 2 } }}
          >
            <span className="font-serif text-xl md:text-2xl">{item.question}</span>
          </AccordionSummary>
          <AccordionDetails id={`faq-${index}-panel`} sx={{ px: 0, pt: 0, pb: 3 }}>
            <div className="max-w-2xl leading-relaxed text-atmos-muted">{item.answer}</div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}
