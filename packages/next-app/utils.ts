import contracts from '@/contracts/hardhat_contracts.json';
import { NETWORK_ID } from '@/config';
import { ethers, providers, Signer } from 'ethers';
import { UseContractConfig } from 'wagmi/dist/declarations/src/hooks/contracts/useContract';

const chainId = Number(NETWORK_ID);

const allContracts = contracts as any;
const oracleAddress =
  allContracts[chainId][0].contracts.DevDAOPriceOracle.address;
const oracleABI = allContracts[chainId][0].contracts.DevDAOPriceOracle.abi;

const devDaoNameServiceAddress =
  allContracts[chainId][0].contracts.DevDAONameService.address;
const devDaoNameServiceABI =
  allContracts[chainId][0].contracts.DevDAONameService.abi;

const devDaoRegistryAddress =
  allContracts[chainId][0].contracts.DevDAORegistry.address;
const devDaoRegistryABI = allContracts[chainId][0].contracts.DevDAORegistry.abi;

export const nameServiceContractConfig: UseContractConfig = {
  addressOrName: devDaoNameServiceAddress,
  contractInterface: devDaoNameServiceABI,
};

export const registryContractConfig: UseContractConfig = {
  addressOrName: devDaoRegistryAddress,
  contractInterface: devDaoRegistryABI,
};

export const getPriceToBePaid = async (
  length: number,
  provider: providers.Provider
) => {
  const contract = new ethers.Contract(oracleAddress, oracleABI, provider);
  const price = await (await contract.lengthToPrices(length)).toString();
  console.log({ price });
  return price;
};

export const checkIfNameIsAvailable = async (
  name: string,
  provider: providers.Provider
): Promise<boolean> => {
  const registryContract = new ethers.Contract(
    devDaoRegistryAddress,
    devDaoRegistryABI,
    provider
  );
  const resolvedTokenId = await registryContract.namesToTokenId(name);
  const tokenId = resolvedTokenId.toString();
  return tokenId === '0';
};
