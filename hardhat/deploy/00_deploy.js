module.exports = async ({ getNamedAccounts, deployments }) => {
  {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log(`Deploying Drs...`);
    log(`Deployer: ${deployer}`);

    const drs = await deploy("DRS", {
      from: deployer,
      log: true,
    });

    log(`The contract address is ${drs.address}.`);

    log(`Deploying Test DRS...`);
  }
};
