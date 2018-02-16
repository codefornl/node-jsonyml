# node-jsonyml

I was surfing on the internet looking for a json to yaml converter that could accept an url and do 'live' transformation. All the solutions I found where clientside javascript and thus not fit for automation. This is why I wrote this little microservice.

__Feed the microservice some remote json url or yaml url on the `f` parameter__

For example:

* http://localhost:8080/?f=https://raw.githubusercontent.com/BetaNYC/civic.json/master/civic.json
* http://localhost:8080/?f=https://raw.githubusercontent.com/publiccodenet/publiccode.yml/master/example/publiccode.yml



## Get started
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

