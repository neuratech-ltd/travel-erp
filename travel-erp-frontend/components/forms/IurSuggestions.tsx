import { useEffect, useId, useState } from 'react'
import { api } from '../../lib/api'

export type IurSuggestionField =
  | 'passengerName'
  | 'passengerType'
  | 'passportNo'
  | 'contactNo'
  | 'passengerEmail'
  | 'dateOfBirth'
  | 'passportIssueDate'
  | 'passportExpiryDate'
  | 'ticketNo'
  | 'pnr'
  | 'route'
  | 'class'
  | 'journeyDate'
  | 'returnDate'
  | 'travelSegment'
  | 'ticketingRemarks'
  | 'baseFare'
  | 'taxesCommission'
  | 'aitTax'
  | 'clientPrice'
  | 'commission'
  | 'calculatedCommission'
  | 'purchaseCost'
  | 'netCommission'
  | 'discount'
  | 'extraFee'
  | 'profit'
  | 'airline'

type IurSuggestionsResponse = {
  suggestions: Partial<Record<IurSuggestionField, string[]>>
}

export function useIurSuggestions() {
  const [suggestions, setSuggestions] = useState<IurSuggestionsResponse['suggestions']>({})
  const [error, setError] = useState('')
  const formId = useId().replace(/:/g, '')

  useEffect(() => {
    let active = true

    api
      .get<IurSuggestionsResponse>('/iur/suggestions')
      .then(({ data }) => {
        if (active) setSuggestions(data.suggestions ?? {})
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load IUR suggestions')
        }
      })

    return () => {
      active = false
    }
  }, [])

  return {
    error,
    listId: (field: IurSuggestionField) => `iur-${formId}-${field}`,
    values: (field: IurSuggestionField) => suggestions[field] ?? [],
  }
}

export function IurSuggestionOptions({
  id,
  values,
}: {
  id: string
  values: string[]
}) {
  if (!values.length) return null

  return (
    <datalist id={id}>
      {values.map((value) => (
        <option key={value} value={value} />
      ))}
    </datalist>
  )
}

export function IurSuggestionStatus({ error }: { error: string }) {
  if (!error) return null

  return (
    <p className="text-xs text-amber-700" role="status">
      IUR suggestions unavailable: {error}
    </p>
  )
}
