
### Dev process

Copy project to parent node_modules folder
```shell script
cp -R ~/projects/readme-links ~/projects/cw-buyer/node_modules
```

Run script in parents root folder and check console for logs
```shell script
npx ./node_modules/readme-links/src/index.js
```

Make changes, rebuild module and update it in parent folder
```
npm run build && rm -rf ~/projects/cw-buyer/node_modules/readme-links/src &&  cp -R ~/projects/readme-links/src ~/projects/cw-buyer/node_modules/readme-links/src
```
