/*!
 * OS.js - JavaScript Cloud/Web Desktop Platform
 *
 * Copyright (c) 2011-2016, Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author  Anders Evenrud <andersevenrud@gmail.com>
 * @licence Simplified BSD License
 */
(function(API, Utils, VFS) {
  'use strict';

  /////////////////////////////////////////////////////////////////////////////
  // HANDLER
  /////////////////////////////////////////////////////////////////////////////

  /**
   * @extends OSjs.Core._Handler
   * @class
   */
  function AgileHandler() {
    //hide login form!
    document.getElementById("Login").style.visibility="hidden";
    OSjs.Core._Handler.apply(this, arguments);
  }

  AgileHandler.prototype = Object.create(OSjs.Core._Handler.prototype);
  AgileHandler.constructor = OSjs.Core._Handler;

  AgileHandler.prototype.init = function(callback) {
    var self = this;
    OSjs.Core._Handler.prototype.init.call(this, function() {
      console.log("Initializing AGILE Client Handler now...");

      function getQueryVariable(query,variable) {
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split('=');
          if (decodeURIComponent(pair[0]) == variable) {
              return decodeURIComponent(pair[1]);
          }
        }
        console.log('Query variable %s not found', variable);
      }

      function loginAttempt(){
        if(document.getElementById("LoginForm").onsubmit){
             var IDMLogin = OSjs.API.getConfig("Connection.RedirectIDM");
             var hash = window.location.href.substring(window.location.href.indexOf("#")+1);
             var token = getQueryVariable(hash, "access_token");
             var type = getQueryVariable(hash, "token_type");
             if(token && type){
               document.getElementById('LoginUsername').value= "";
               document.getElementById('LoginPassword').value= token;
               document.getElementById("LoginSubmit").click();
             }
             else{
               console.error('redirecting unauthenticated user!');
               //we ask IDM to redirect to this same website afterwards!
               var myUrl = window.location.href;
               //in case we already were in IDM, reamove the fragment
               if(myUrl.indexOf("#")>0){
                  myUrl = myUrl.substring(0,myUrl.indexOf("#"));
               }
               IDMLogin = IDMLogin+"?response_type=token&redirect_uri="+myUrl+"&client_id="+OSjs.API.getConfig("Oauth2.id");
               window.location = IDMLogin;
             }

        }
        else{
           console.warn("waiting: submit is "+document.getElementById("LoginForm").onsubmit);
           setTimeout(loginAttempt,100)
        }
      }
      loginAttempt();
      self.initLoginScreen(callback);
    });
  };

  AgileHandler.prototype.login = function(username, password, callback) {
    return OSjs.Core._Handler.prototype.login.apply(this, arguments);
  };

  AgileHandler.prototype.logout = function(save, callback) {
    return OSjs.Core._Handler.prototype.logout.apply(this, arguments);
  };

  AgileHandler.prototype.saveSettings = function(pool, storage, callback) {
    return OSjs.Core._Handler.prototype.saveSettings.apply(this, arguments);
  };

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  OSjs.Core.Handler = AgileHandler;

})(OSjs.API, OSjs.Utils, OSjs.VFS);
