import { useEffect, useState } from 'react'

function useSwapContractInfo (swapContract) {
  const [contractInfo, setContractInfo] = useState({})

  useEffect(() => {
    const getSwapData = async (contract) => {
      const fromTokenAddress = await contract.hez()
      const toTokenAddress = await contract.matic()
      const swapRatio = await contract.SWAP_RATIO()

      return { fromTokenAddress, toTokenAddress, swapRatio }
    }

    if (swapContract) {
      getSwapData(swapContract).then(setContractInfo)
    }
  }, [swapContract])

  return contractInfo
}

export default useSwapContractInfo