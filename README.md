

## React setup
1. install node.js and npm


2. cd into the frontend directory
3. npm start to start the React development server


npm run build to create a production build of the React app 



http://127.0.0.1:3000/ local development server (default React port)


when running, press Ctrl+C to stop the server




# Proxy setup

if you get this error when running the React development server:
```Invalid options object. Dev Server has been initialized using an options object that does not match the API schema.  
 - options.allowedHosts[0] should be a non-empty string.```


run:	npm install http-proxy-middleware --save-dev 
for setupProxy.js in src


