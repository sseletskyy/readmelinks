
### How to test readmelinks locally

Copy `readmelinks` to parent node_modules folder
```shell script
cp -R ~/projects/readmelinks ~/projects/<parent_project>/node_modules
```

Run script in parents root folder and check console for logs
```shell script
npx ./node_modules/readmelinks/src/index.js
```

Make changes, rebuild module and update it in parent folder (run this command in `readmelinks` folder)
```
npm run build && rm -rf ~/projects/<parent_project>/node_modules/readmelinks/src &&  cp -R ~/projects/readmelinks/src ~/projects/<parent_project>/node_modules/readmelinks/src
```
