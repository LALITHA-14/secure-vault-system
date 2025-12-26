module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Deploying MyContract with deployer:", deployer);

  await deploy("MyContract", {
    from: deployer,
    args: ["Hello, Hardhat!"], // initial message
    log: true,
  });
};

module.exports.tags = ["MyContract"];
