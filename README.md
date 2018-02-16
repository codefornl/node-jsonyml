# node-jsonyml


Start the node server and feed it some remote json url or yaml url

## First run
```
git clone https://github.com/codefornl/node-jsonyml
cd node-jsonyml
node index.js
```

## Docker
```
docker build .
docker run -d -p 8080:8080 <buildnumber>
```


Tested with:

* http://localhost:8080/?f=https://raw.githubusercontent.com/BetaNYC/civic.json/master/civic.json
* http://localhost:8080/?f=https://raw.githubusercontent.com/publiccodenet/publiccode.yml/master/example/publiccode.yml
