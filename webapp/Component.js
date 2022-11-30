sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Sorter",
    "sap/f/library",
  ],
  function (UIComponent, JSONModel, Sorter, fioriLibrary) {
    "use strict";

    return UIComponent.extend("myapp.chatapp.Component", {
      metadata: {
        // it allows component, views, router to be handles asynchronously
        manifest: "json",
      },
      init: function () {
        //the component inherits from the base class sap.ui.core.UIComponent
        UIComponent.prototype.init.apply(this, arguments);

        //create a json model to store the layout that has to be passed with the routing
        var oLayoutModel = new JSONModel();
        this.setModel(oLayoutModel);

        //initialize the router based on descriptor config
        //it creates the view based on the url/hash defined
        var oRouter = this.getRouter();
        oRouter.attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
        oRouter.initialize();

        //get chats set model data []
        var aChatsSet = this.getModel("chatsSetModel").getData();
        //get sent messages model data []
        var aSentSet = this.getModel("sentMessagesModel").getData();
        //get received msgs model data []
        var aReceivedSet = this.getModel("receivedMessagesModel").getData();

        var aConversations = aChatsSet.map((obj) => {
          var aSentMessages = aSentSet.filter(
            (msg) => msg["phone"] === obj["phone"]
          );
          var aReceivedMessages = aReceivedSet.filter(
            (msg) => msg["phone"] === obj["phone"]
          );

          var concat = aReceivedMessages.map((e, i) => [aSentMessages[i], e]);

          //concat the arrays of object in a unique array with all messages
          var allMessages = concat.reduce((a, b) => [...a, ...b], []);
          allMessages.sort((a, b) => (a.date > b.date ? -1 : 1));

          //FILTER OUT == TAKE AWAY the undefined objects
          //only want the NOT undefined
          var filteredMessages = allMessages.filter((x) => x !== undefined);

          obj.messages = filteredMessages;
          return obj;
        });

        //console.log(aConversations);
        //set the new model to the view
        var oConvModel = new JSONModel({ conversations: aConversations });
        this.setModel(oConvModel, "convSet");
        // console.log(oConvModel)
      },

      _onBeforeRouteMatched: function (oEvent) {
        var oLayoutModel = this.getModel(),
          sLayout = oEvent.getParameters().arguments.layout;

        //if no layout is detected - set a default one
        if (!sLayout) {
          sLayout = fioriLibrary.LayoutType.OneColumn;
        }

       oLayoutModel.setProperty("/layout", sLayout);
      },
    });
  }
);
