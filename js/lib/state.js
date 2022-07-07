
export function createState (initialValue) {
  const subscribers = []
  let value = initialValue

  const watch = (handler, passive = false) => {
    if (!passive) handler(value)
    subscribers.push(handler)
  }
  return {
    get value() {
      return value
    },
    setValue(newValue) {
      value = newValue
      subscribers.forEach((sub) => sub(value))
    },
    watch,
  }
}

export const collectValues = (states) => {
  const values = {}
  for (const key in states) values[key] = states[key].value
  return values
}

export const combine = (states, combiner = (v) => v) => {
  const finalState = createState(combiner(collectValues(states)))
  for (const key in states) {
    states[key].watch(() => {
      finalState.setValue(combiner(collectValues(states)))
    }, true)
  }

  return finalState
}