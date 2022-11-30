sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/m/FeedListItem",
    "sap/ui/model/Sorter",
  ],
  function (Controller, History, JSONModel, FeedListItem, Sorter) {
    "use strict";

    return Controller.extend("myapp.chatapp.controller.Detail", {
      onInit: function () {
        var oOwnerComponent = this.getOwnerComponent();

        this.oRouter = oOwnerComponent.getRouter();
        this.oModel = oOwnerComponent.getModel();

        this.oRouter
          .getRoute("master")
          .attachPatternMatched(this._onObjectMatched, this);
        this.oRouter
          .getRoute("detail")
          .attachPatternMatched(this._onObjectMatched, this);
      },

      _onObjectMatched: function (oEvent) {
        //bindElement creates the bind context for the view and
        //for the control connected to the fields of the model 
        //BIND the table in the detail view to reflect the currently selected CONTACT from the master view.
        this._contact = oEvent.getParameter("arguments").contact;
        // console.log(this._contact);
        this.getView().bindElement({
          path: "/conversations/" + this._contact,
          model: "convSet",
        });

        var oBindingContext = this.getView().getBindingContext("convSet");
        //console.log(oBindingContext);

        var oObject = oBindingContext.getObject();
        //console.log(oObject);

        var aMessages = oObject.messages;
        //USE SORTER ON THE LIST INSTEAD
        aMessages.sort((a, b) => (a.date > b.date ? 1 : -1));
        //console.log(aMessages);

        var oModel = new JSONModel({ messages: aMessages });
        //console.log(oModel);

        var oList = this.getView().byId("idMessagesList");
        // console.log(oList);

        var oFeedListItem = new FeedListItem({
          timestamp: "{date}",
          text: "{text}",
        });

        oList.bindAggregation("items", {
          path: "/messages",
          template: oFeedListItem,
        });
        oList.setModel(oModel);
      },

      navBack: function () {
        //history is a routing dependency
        var oHistory = History.getInstance();
        //get the previous hash/ url as string from the nav history
        var sPreviousHash = oHistory.getPreviousHash();

        //if a nav happened before go back to the -1 hash
        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          //else always return to main page
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("master", {}, true);
        }
      },
    });
  }
);
