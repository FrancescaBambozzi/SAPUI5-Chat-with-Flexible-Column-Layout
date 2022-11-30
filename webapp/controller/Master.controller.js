sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/f/library",
  ],
  function (Controller, Filter, FilterOperator, fioriLibrary) {
    "use strict";

    return Controller.extend("myapp.chatapp.controller.Master", {
      onInit: function () {
        this.oRouter = this.getOwnerComponent().getRouter();

        var model = this.getOwnerComponent().getModel("convSet");
        this.getView().setModel(model);
      },

      onSearch: function (oEvent) {
        //get table by id from the view
        var oTable = this.getView().byId("listId");

        //store event query in array
        var aFilter = [];
        var sQuery = oEvent.getParameter("query"); //mParameters

        //if a query exist, create a new filter containing the query (not case-sensitive)
        if (sQuery && sQuery.length > 0) {
          aFilter.push(
            new Filter("contactName", FilterOperator.Contains, sQuery)
          );
        }

        //get the binding of the list's aggregation items and call the filter method with the new array of filters
        oTable.getBinding("items").filter(aFilter);
      },

      onPressNavTo: function (oEvent) {
        //get the item pressed
        var oItem = oEvent.getSource(); //ObjectListItem

        // 1. navigate to the route with name "detail"
        // 2. get the'contactPath' and then the nav params "contact" (as defined in manifest)
        var contactPath = oItem.getBindingContext().getPath();
        var contact = contactPath.split("/").slice(-1).pop();

        this.oRouter.navTo("detail", {
          layout: fioriLibrary.LayoutType.TwoColumnsMidExpanded,
          contact: contact,
        });
      },
    });
  }
);
