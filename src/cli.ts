function run(args: any) {
  console.log(`readme-links :: cli :: run, args`, args);
  console.log(`before run index`);
  require('./index');
  console.log(`after run index`);
}

module.exports = {
  run,
};
