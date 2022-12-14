sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/m/FeedListItem",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/format/DateFormat",
  ],
  function (
    Controller,
    History,
    JSONModel,
    FeedListItem,
    Sorter,
    Filter,
    FilterOperator,
    DateFormat
  ) {
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
        //BIND the table in the detail view to reflect the currently selected CONTACT from the master view.
        this._contact = oEvent.getParameter("arguments").contact;
        this.getView().bindElement({
          path: "/conversations/" + this._contact,
          model: "convSet",
          events: { change: this._onBindingChange.bind(this) },
        });
      },

      _onBindingChange: function () {
        var oView = this.getView(),
          oElementBinding = oView.getBindingContext("convSet").getObject(),
          sObjectKey = oElementBinding.phone;

        console.log(oElementBinding);
        console.log(sObjectKey);

        // Filter the list by key (phone) - only show new comments for view's object
        var oList = this.byId("idMessagesList");
        var oBinding = oList.getBinding("items");
        oBinding.filter(new Filter("phone", FilterOperator.EQ, sObjectKey));
      },

      onPost: function (oEvent) {
        //get the contact object bound to the view
        var oObject = this.getView().getBindingContext("convSet").getObject();

        //get the value of the FeedInput ("comment wrote")
        var sValue = oEvent.getParameter("value");

        //create date instance
        // var oFormat = DateFormat.getDateTimeInstance({ style: "short", format: 'dd/MM/YY' });
        // var sDate = oFormat.format(new Date());
        var sDate = new Date();
       
        //create entry for the new comment 
        var oEntry = {
          phone: oObject.phone,
          text: sValue,
          date: sDate,
          type: "Comment",
        };

        //get convSet model
        var oModel = this.getView().getModel("convSet");
        var aConv = oModel.getData().conversations;
        //store the new comment in Array
        var aEntries;

        //update the messages arr of each contact with the new entry
        aConv.map((obj) => {
          aEntries = obj.messages;
          aEntries.push(oEntry);
        });

        //update the data of the model bound to the list
        oModel.setData({ conversations: aConv });
      },

      navBack: function () {
        //history is a routing dependency
        var oHistory = History.getInstance();
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
