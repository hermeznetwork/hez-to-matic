import { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

const INPUT_REGEX = /^\d*(?:\.\d*)?$/
// ethers BigNumber doesn't support decimals, so we need to workaround it
// using 35 as the SWAP_FACTOR instead of 3.5 and later divide the result by 10
// in the multiplyAmountBySwapFactor function
const SWAP_FACTOR = parseUnits('35', 0)
const INITIAL_VALUES = { from: '', to: '' }
const INITIAL_AMOUNTS = { from: BigNumber.from(0), to: BigNumber.from(0) }

function useSwapFormData (wallet, maxTokenAmount, tokenInfo) {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [error, setError] = useState()
  const [amounts, setAmounts] = useState(INITIAL_AMOUNTS)

  useEffect(() => {
    setValues(INITIAL_VALUES)
    setAmounts(INITIAL_AMOUNTS)
    setError()
  }, [wallet])

  const multiplyAmountBySwapFactor = (value) => value.mul(SWAP_FACTOR).div(10)

  const changeValue = (newFromValue) => {
    if (INPUT_REGEX.test(newFromValue)) {
      try {
        const newFromAmount = parseUnits(newFromValue.length > 0 ? newFromValue : '0', tokenInfo.decimals)
        const newToAmount = multiplyAmountBySwapFactor(newFromAmount)

        setAmounts({ from: newFromAmount, to: newToAmount })
        setValues({ from: newFromValue, to: formatUnits(newToAmount, tokenInfo.decimals) })

        if (newFromAmount.gt(maxTokenAmount)) {
          setError('Amount cannot exceed your balance')
        } else {
          setError()
        }
      } catch (err) { console.log(err) }
    }
  }

  const sendMax = () => {
    if (maxTokenAmount && tokenInfo) {
      const newToAmount = multiplyAmountBySwapFactor(maxTokenAmount)

      setAmounts({ from: maxTokenAmount, to: newToAmount })
      setValues({
        from: formatUnits(maxTokenAmount, tokenInfo.decimals),
        to: formatUnits(newToAmount, tokenInfo.decimals)
      })
      setError()
    }
  }

  return { values, amounts, error, changeValue, sendMax }
}

export default useSwapFormData