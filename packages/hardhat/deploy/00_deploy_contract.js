// deploy/00_deploy_contract

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // const args = ['Hello!!!!!!!!'];
  // await deploy('Greeter', {
  //   // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
  //   args: args,
  //   from: deployer,
  //   log: true,
  // });

  const nft = await deploy('DevDAONFT', {
    from: deployer,
    log: true,
    autoMine: true,
  });
  const oracle = await deploy('DevDAOPriceOracle', {
    from: deployer,
    log: true,
    autoMine: true,
  });
  const registry = await deploy('DevDAORegistry', {
    from: deployer,
    log: true,
    autoMine: true,
  });
  await deploy('DevDAONameService', {
    from: deployer,
    args: [nft.address, registry.address, oracle.address, deployer],
    log: true,
    autoMine: true,
  });
};
module.exports.tags = [
  'DevDAONFT',
  'DevDAOPriceOracle',
  'DevDAORegistry',
  'DevDAONameService',
];
