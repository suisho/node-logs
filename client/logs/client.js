var Client = function(){}

Client.prototype = {
  LOAD_SOCKET_IO_COMPLETE : "loadSocketIoComplete",
  socket : null,
  server : null,
  notificationBaseUrl : null,

  /**
   * @type {Object} {target : [logの通知を一時的にスキップするか？] }
   * @see  bindSocketEvent
   */
  skipNotificate : {},

  /**
   * 起動
   * @param {string}  server  server
   */
  start : function(server){
    var self = this;
    self.server = server;
    if(self.socket != null){
      self.socketInit();
      return;
    }
    //socket.io.jsの読み込み
    $(self).bind(self.LOAD_SOCKET_IO_COMPLETE,function(){
      self.socketInit()
    });
    self.loadSocketIo();
  },

  /**
   * notificationを出す。$.notificationのラッパー
   * @param  {Object} notificationArgs argument
   */
  showNotification : function(notificationArgs){
    var defaultArgs = {
      onclick : function(){
        this.close();
      },
      onerror : function(e){
        console.log(e);
        this.close();
      },
      timeout : 5000,
      title : "Logs",
      icon : ""
    };
    if(this.notificationBaseUrl){
      defaultArgs.timeout = 0;
      defaultArgs.onclick = undefined;
      defaultArgs.onerror = undefined;
    }
    var mergedArgs = $.extend(defaultArgs, notificationArgs);

    //url構築
    if(this.notificationBaseUrl && mergedArgs.url == undefined){
      var param = $.param({
        title : mergedArgs.title,
        message : mergedArgs.content
      },true);
      if(notificationArgs.url_params){
        var notificationArgsParam = $.param(mergedArgs.url_params);
        param = param + "&" + notificationArgsParam;
      }
      mergedArgs.url = this.notificationBaseUrl + "?" + param

    }

    $.notification(mergedArgs).show();
  },

  /**
   * socketの初期化
   */
  socketInit : function(){
    var self = this;
    self.bindSocketEvent();
  },

  /**
   * socket.io.jsをサーバーからロードする。
   * @event self.LOAD_SOCKET_IO_COMPLETE ロード完了時に呼ばれる
   */
  loadSocketIo : function(){
    var self = this;
    var socketIoUrl = this.server + "/socket.io/socket.io.js";
    $.getScript(socketIoUrl).done(function(){
      $(self).trigger(self.LOAD_SOCKET_IO_COMPLETE);
    });
    //getScriptだとfailが取れないっぽいので、下記でなんとか。
    $.get(socketIoUrl).fail(function(){
      self.showNotification({
        content : "Start failed. Cannot access server:"+ self.server
      });
    });
  },

  /**
   * socketにイベントバインディング
   */
  bindSocketEvent : function(){
    var self = this;
    self.socket = io.connect(self.server); //socketはひとつだけ持つ。
    /*self.socket.on('connect',function(){
      self.showNotification({
        content : "Connect"
      })
    })*/
    self.socket.on('tail',function(data){
      self.onTailEvent(data);
    })
  },
  onTailEvent : function(data){
    var self = this;
    self.showNotification({
      title : data.file_name,
      content : data.line,
      onclick : function(){
        try{
          var openUrl = self.server+"/browse?target="+data.target;
          window.open(openUrl);
          this.close();
        }catch(e){
          console.log(e);
        }
      },
      url_params : {
        target : data.target
      }
    });
  }
}
