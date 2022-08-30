import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContractRead, useContractWrite, useProvider } from 'wagmi';
import { useEffect, useState } from 'react';
import {
  getPriceToBePaid,
  nameServiceContractConfig,
  registryContractConfig,
} from '@/utils';
import { useDebounce } from '@/hooks';
import Confetti from 'react-confetti';

export default function Home() {
  const [inputUsername, setInputUsername] = useState('');
  const debouncedUsername = useDebounce(inputUsername);

  const {
    writeAsync,
    isLoading: isClaimLoading,
    error: claimError,
  } = useContractWrite({
    ...nameServiceContractConfig,
    functionName: 'mint',
    mode: 'recklesslyUnprepared',
  });

  const [claimSuccess, setClaimSuccess] = useState(false);

  const {
    data: tokenId,
    isError: tokenIdError,
    refetch,
  } = useContractRead({
    ...registryContractConfig,
    functionName: 'namesToTokenId',
    args: [debouncedUsername],
  });
  const isNameAvailable = tokenId?.toString() === '0';
  const showAvailability = debouncedUsername.length > 0 && !claimSuccess;

  const provider = useProvider();

  const onSubmit = async () => {
    try {
      const priceToBePaid = await getPriceToBePaid(
        inputUsername.length,
        provider
      );
      const tx = await writeAsync?.({
        recklesslySetUnpreparedArgs: [
          inputUsername,
          {
            value: priceToBePaid,
          },
        ],
      });
      const res = await tx?.wait();
      console.log(res);
      setClaimSuccess(true);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setClaimSuccess(false);
  }, [inputUsername]);

  return (
    <div className='p-20'>
      <h1 className='text-4xl font-bold'>.devdao domains</h1>

      <ConnectButton />

      <div className='flex items-center mt-4'>
        <input
          disabled={isClaimLoading}
          className='border border-slate-400 p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed'
          value={inputUsername}
          onChange={(e) => setInputUsername(e.target.value)}
        />
        <span>.devdao</span>
      </div>

      <button
        disabled={!isNameAvailable || isClaimLoading}
        onClick={onSubmit}
        className='block disabled:opacity-50 disabled:cursor-not-allowed text-white bg-slate-800 rounded px-4 py-2 mt-4'
      >
        {isClaimLoading ? 'Claiming... (Confirm TX in wallet)' : 'Claim'}
      </button>

      {showAvailability && (
        <span className='text-sm text-slate-400 mt-2 block'>
          {isNameAvailable ? 'Available' : 'Not available'}
        </span>
      )}

      {claimError && (
        <span className='text-sm text-slate-400 mt-2 block'>
          There was an error while claiming: {claimError.message}
        </span>
      )}

      {claimSuccess && <Confetti />}

      {claimSuccess && (
        <span className='text-sm text-green-700 mt-2 block'>
          Claimed successfully!
        </span>
      )}
    </div>
  );
}
