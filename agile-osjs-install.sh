#git clone https://github.com/doitdagi/OS.js
cd OS.js
git checkout 3e9a9e4dcd72e8b4cc666e57e0088c675c449062
#npm install
#npm install --production
grunt create-handler:Agile
#put handlers!
cp ../src/client/javascript/handlers/agile/handler.js  ./src/client/javascript/handlers/agile/handler.js
cp ../src/server/node/handlers/agile/handler.js ./src/server/node/handlers/agile/handler.js
#set agile handler
grunt config --set=handler --value=agile
#Configure AGILE IDM part
# In order for authentication to work, OSjs needs to be a valid client registered with a url equal to the url of the OS js interface registered in AGILE IDM
grunt config --set=server.handlers.agile.idm --value=http://agilegw.local:3000/oauth2/api/userinfo
grunt config -set=client.Connection.RedirectIDM --value=http://agilegw.local:3000/oauth2/dialog/authorize/
#grunt config -set=client.Oauth2.id --value=OSjs
grunt config -set=client.Oauth2.id --value=AGILE-OSJS


grunt
