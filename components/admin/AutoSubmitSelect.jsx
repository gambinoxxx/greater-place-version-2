'use client'

import { FOCUS } from '@/components/admin/ui'

// A <select> inside a <Form> (next/form) that submits the filter form as soon as it changes, so the list
// updates without a full reload and without a separate "apply" button.
export default function AutoSubmitSelect({ name, label, value, options, allLabel = 'All' }) {
  return (
    <label className="flex items-center gap-2 rounded-md border border-brand-ivory/[0.14] px-3 py-1.5 text-[12.5px] text-brand-ivory/[0.55]">
      <span>{label}:</span>
      <select
        name={name}
        defaultValue={value}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className={`cursor-pointer bg-transparent text-brand-ivory ${FOCUS}`}
      >
        <option value="" className="bg-brand-navyDeep">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-brand-navyDeep">{option}</option>
        ))}
      </select>
    </label>
  )
}
